"""Bookshelf stand-in: a small HTTP service that exposes the telemetry of the Bookshelf Spring Boot application."""
import json, math, os, queue, random, threading, time, urllib.request
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

APP = "bookshelf"
ENV = os.environ.get("DEPLOYMENT_ENVIRONMENT", "lab")
OTLP = os.environ.get("OTEL_EXPORTER_OTLP_ENDPOINT", "")
OTLP_LOGS = os.environ.get("OTEL_LOGS_EXPORTER", "none") == "otlp"
LOG_FILE = os.environ.get("LOG_FILE", "")
BUCKETS = [0.05, 0.1, 0.25, 0.5, 1.0, 2.5, 5.0]
ROUTES = ["/api/books", "/api/books/{id}", "/api/loans", "/api/search"]

lock = threading.Lock()
counts, sums, buckets = {}, {}, {}
active = 0
export_q = queue.Queue(maxsize=10000)
started = time.time()


def now_ns():
    return str(time.time_ns())


def attrs(d):
    out = []
    for k, v in d.items():
        if isinstance(v, bool):
            out.append({"key": k, "value": {"boolValue": v}})
        elif isinstance(v, int):
            out.append({"key": k, "value": {"intValue": str(v)}})
        else:
            out.append({"key": k, "value": {"stringValue": str(v)}})
    return out


RESOURCE = {"attributes": attrs({"service.name": APP, "deployment.environment.name": ENV,
                                 "service.version": "1.0.0"})}


def log(level, message, **extra):
    rec = {"timestamp": time.strftime("%Y-%m-%dT%H:%M:%S", time.gmtime()) + ".%03dZ" % (time.time() * 1000 % 1000),
           "level": level, "logger": "com.irurueta.bookshelf", "message": message, "application": APP}
    rec.update(extra)
    line = json.dumps(rec)
    print(line, flush=True)
    if LOG_FILE:
        with open(LOG_FILE, "a") as f:
            f.write(line + "\n")
    if OTLP and OTLP_LOGS:
        sev = {"INFO": 9, "WARN": 13, "ERROR": 17}[level]
        export_q.put(("logs", {"timeUnixNano": now_ns(), "severityNumber": sev, "severityText": level,
                               "body": {"stringValue": message},
                               "traceId": extra.get("trace_id", ""), "spanId": extra.get("span_id", ""),
                               "attributes": attrs({k: v for k, v in extra.items() if k not in ("trace_id", "span_id")})}))


def exporter():
    spans, logs = [], []
    last = time.time()
    while True:
        try:
            kind, item = export_q.get(timeout=1)
            (spans if kind == "spans" else logs).append(item)
        except queue.Empty:
            pass
        if time.time() - last >= 1 and (spans or logs):
            last = time.time()
            if spans:
                post("/v1/traces", {"resourceSpans": [{"resource": RESOURCE, "scopeSpans": [
                    {"scope": {"name": "bookshelf"}, "spans": spans}]}]})
                spans = []
            if logs:
                post("/v1/logs", {"resourceLogs": [{"resource": RESOURCE, "scopeLogs": [
                    {"scope": {"name": "bookshelf"}, "logRecords": logs}]}]})
                logs = []


def post(path, body):
    try:
        req = urllib.request.Request(OTLP + path, json.dumps(body).encode(), {"Content-Type": "application/json"})
        urllib.request.urlopen(req, timeout=5).read()
    except Exception as e:  # collector down: drop the batch
        print("otlp export failed:", e, flush=True)


def record(uri, method, status, seconds):
    outcome = "SUCCESS" if status < 400 else ("CLIENT_ERROR" if status < 500 else "SERVER_ERROR")
    key = (uri, method, str(status), outcome)
    with lock:
        counts[key] = counts.get(key, 0) + 1
        sums[key] = sums.get(key, 0.0) + seconds
        b = buckets.setdefault(key, [0] * (len(BUCKETS) + 1))
        for i, le in enumerate(BUCKETS):
            if seconds <= le:
                b[i] += 1
        b[-1] += 1


def metrics_text():
    out = ["# TYPE http_server_requests_seconds histogram"]
    with lock:
        for key in sorted(counts):
            uri, method, status, outcome = key
            lab = 'application="%s",method="%s",outcome="%s",status="%s",uri="%s"' % (APP, method, outcome, status, uri)
            for i, le in enumerate(BUCKETS):
                out.append('http_server_requests_seconds_bucket{%s,le="%s"} %d' % (lab, le, buckets[key][i]))
            out.append('http_server_requests_seconds_bucket{%s,le="+Inf"} %d' % (lab, buckets[key][-1]))
            out.append('http_server_requests_seconds_count{%s} %d' % (lab, counts[key]))
            out.append('http_server_requests_seconds_sum{%s} %.6f' % (lab, sums[key]))
        act = active
    out += ["# TYPE hikaricp_connections_active gauge",
            'hikaricp_connections_active{application="%s",pool="HikariPool-1"} %d' % (APP, min(10, act)),
            "# TYPE hikaricp_connections_max gauge",
            'hikaricp_connections_max{application="%s",pool="HikariPool-1"} 10' % APP,
            "# TYPE jvm_memory_used_bytes gauge",
            'jvm_memory_used_bytes{application="%s",area="heap"} %d' % (APP, 180e6 + 20e6 * math.sin(time.time() / 60)),
            "# TYPE process_uptime_seconds gauge",
            'process_uptime_seconds{application="%s"} %.1f' % (APP, time.time() - started)]
    return "\n".join(out) + "\n"


class Handler(BaseHTTPRequestHandler):
    protocol_version = "HTTP/1.1"

    def log_message(self, *a):
        pass

    def send(self, status, body, ctype="application/json"):
        data = body.encode()
        self.send_response(status)
        self.send_header("Content-Type", ctype)
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)

    def do_GET(self):
        global active
        path = self.path.split("?")[0]
        if path == "/actuator/prometheus":
            return self.send(200, metrics_text(), "text/plain; version=0.0.4")
        if path == "/actuator/health":
            return self.send(200, '{"status":"UP"}')
        if not path.startswith("/api/"):
            return self.send(404, '{"error":"not found"}')
        route = "/api/books/{id}" if path.startswith("/api/books/") else path
        if route not in ROUTES:
            return self.send(404, '{"error":"not found"}')
        fault = self.headers.get("X-Fault", "")
        trace_id, span_id = "%032x" % random.getrandbits(128), "%016x" % random.getrandbits(64)
        start = time.time()
        start_ns = time.time_ns()
        with lock:
            active += 1
        try:
            delay = random.lognormvariate(math.log(0.08), 0.5)
            if fault == "slow":
                delay = random.uniform(0.7, 1.5)
            time.sleep(delay)
            status = 200
            if fault == "error" and random.random() < 0.7:
                status = 500
            elif route == "/api/books/{id}" and random.random() < 0.02:
                status = 404
            if status == 500:
                log("ERROR", "Unhandled exception while serving " + route, uri=route, status=status,
                    trace_id=trace_id, span_id=span_id)
            elif fault == "log-errors":
                log("ERROR", "Loan reminder job failed, retry scheduled", uri=route, status=status,
                    trace_id=trace_id, span_id=span_id)
            elif random.random() < 0.05:
                log("INFO", "Served " + route, uri=route, status=status, trace_id=trace_id, span_id=span_id)
            self.send(status, json.dumps({"route": route, "status": status}))
        finally:
            with lock:
                active -= 1
        seconds = time.time() - start
        record(route, "GET", status, seconds)
        if OTLP:
            export_q.put(("spans", {
                "traceId": trace_id, "spanId": span_id, "name": "GET " + route, "kind": 2,
                "startTimeUnixNano": str(start_ns), "endTimeUnixNano": str(time.time_ns()),
                "attributes": attrs({"http.request.method": "GET", "url.path": path, "http.route": route,
                                     "http.response.status_code": status}),
                "status": {"code": 2 if status >= 500 else 0}}))


if __name__ == "__main__":
    if OTLP:
        threading.Thread(target=exporter, daemon=True).start()
    log("INFO", "Bookshelf started")
    ThreadingHTTPServer(("0.0.0.0", 8080), Handler).serve_forever()
