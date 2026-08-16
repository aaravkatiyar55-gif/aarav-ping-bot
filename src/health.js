const http = require("node:http");

function createHealthServer({ isReady }) {
  return http.createServer((request, response) => {
    if (request.method !== "GET" || request.url !== "/healthz") {
      response.writeHead(404, { "content-type": "application/json" });
      response.end(JSON.stringify({ status: "not_found" }));
      return;
    }

    const ready = isReady();
    response.writeHead(ready ? 200 : 503, {
      "cache-control": "no-store",
      "content-type": "application/json",
    });
    response.end(JSON.stringify({ status: ready ? "ready" : "starting" }));
  });
}

function listen(server, port) {
  return new Promise((resolve, reject) => {
    server.once("error", reject);
    server.listen(port, "0.0.0.0", () => {
      server.removeListener("error", reject);
      resolve();
    });
  });
}

function close(server) {
  if (!server?.listening) return Promise.resolve();
  return new Promise((resolve, reject) => {
    server.close((error) => (error ? reject(error) : resolve()));
  });
}

module.exports = { close, createHealthServer, listen };
