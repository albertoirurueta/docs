"""Load generator with a control endpoint: POST /mode/<normal|failing|slow|log-errors|stop> on port 8090."""
import os, random, threading, time, urllib.request
from http.server import BaseHTTPRequestHandler, HTTPServer

TARGET = os.environ.get("TARGET", "http://bookshelf:8080")
RATE = float(os.environ.get("RATE", "10"))
FAULTS = {"normal": "", "failing": "error", "slow": "slow", "log-errors": "log-errors"}
state = {"mode": "normal"}
URIS = ["/api/books", "/api/books/42", "/api/loans", "/api/search"]


def worker():
    while True:
        mode = state["mode"]
        if mode != "stop":
            req = urllib.request.Request(TARGET + random.choice(URIS), headers={"X-Fault": FAULTS[mode]})
            try:
                urllib.request.urlopen(req, timeout=10).read()
            except Exception:
                pass
        time.sleep(random.expovariate(RATE / 4))  # 4 workers share the rate


class Control(BaseHTTPRequestHandler):
    def log_message(self, *a):
        pass

    def reply(self, text):
        self.send_response(200)
        self.send_header("Content-Length", str(len(text)))
        self.end_headers()
        self.wfile.write(text.encode())

    def do_POST(self):
        name = self.path.rsplit("/", 1)[-1]
        if self.path.startswith("/mode/") and (name in FAULTS or name == "stop"):
            state["mode"] = name
        self.reply("mode=%s\n" % state["mode"])

    def do_GET(self):
        self.reply("mode=%s\n" % state["mode"])


for _ in range(4):
    threading.Thread(target=worker, daemon=True).start()
HTTPServer(("0.0.0.0", 8090), Control).serve_forever()
