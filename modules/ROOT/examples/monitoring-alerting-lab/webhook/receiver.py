"""Webhook receiver: logs every POST (path and body) to stdout and keeps them for GET /received."""
import json, time
from http.server import BaseHTTPRequestHandler, ThreadingHTTPServer

received = []


class H(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def do_POST(self):
        body = self.rfile.read(int(self.headers.get("Content-Length", 0))).decode(errors="replace")
        entry = {"time": time.strftime("%H:%M:%S"), "path": self.path, "body": body[:20000]}
        received.append(entry)
        print("WEBHOOK", json.dumps(entry), flush=True)
        self.send_response(200)
        self.send_header("Content-Length", "2")
        self.end_headers()
        self.wfile.write(b"ok")

    def do_GET(self):
        data = json.dumps(received[-50:], indent=1).encode()
        self.send_response(200)
        self.send_header("Content-Type", "application/json")
        self.send_header("Content-Length", str(len(data)))
        self.end_headers()
        self.wfile.write(data)


ThreadingHTTPServer(("0.0.0.0", 8080), H).serve_forever()
