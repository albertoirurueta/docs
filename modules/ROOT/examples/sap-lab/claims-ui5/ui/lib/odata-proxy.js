import http from "node:http";

// Passes every request whose path starts with the prefix on to the CAP server,
// so the browser only ever talks to the origin that served the app.
export default function ({ options }) {
  const target = new URL(options.configuration.target);
  const prefix = options.configuration.prefix;
  return (req, res, next) => {
    if (!req.url.startsWith(prefix)) {
      return next();
    }
    const proxied = http.request(
      {
        host: target.hostname,
        port: target.port,
        path: req.url,
        method: req.method,
        headers: req.headers
      },
      (answer) => {
        res.writeHead(answer.statusCode, answer.headers);
        answer.pipe(res);
      }
    );
    proxied.on("error", next);
    req.pipe(proxied);
  };
}
