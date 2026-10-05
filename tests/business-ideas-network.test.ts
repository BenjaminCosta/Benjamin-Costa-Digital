import assert from "node:assert/strict";
import { createServer } from "node:http";
import test from "node:test";
import { readPinnedPage } from "../src/lib/business-ideas/safe-page";

test("transport enforces size, content type, status, compression and cancellation", async (t) => {
  // Test-only local server. Production orchestration never permits loopback addresses.
  const server = createServer((req, res) => {
    res.setHeader("Content-Type", "text/html; charset=utf-8");
    switch (req.url) {
      case "/json": res.setHeader("Content-Type", "application/json"); res.end('{}'); break;
      case "/compressed": res.setHeader("Content-Encoding", "gzip"); res.end("not decoded"); break;
      case "/forbidden": res.statusCode = 403; res.end("Forbidden"); break;
      case "/oversized": res.setHeader("Content-Length", 600000); res.end(); break;
      case "/chunked": res.write("a".repeat(300000)); res.end("b".repeat(300000)); break;
      case "/redirect": res.statusCode = 302; res.setHeader("Location", "/good"); res.end(); break;
      case "/slow": res.write("<html>"); break;
      default: res.end("<html><body>Public page</body></html>");
    }
  });
  await new Promise<void>((resolve) => server.listen(0, "127.0.0.1", resolve));
  t.after(() => { server.closeAllConnections(); server.close(); });
  const address = server.address();
  assert.ok(address && typeof address === "object");
  const url = (path: string) => new URL(`http://example.com:${address.port}${path}`);
  const pinned = { address: "127.0.0.1", family: 4 };
  const read = (path: string) => readPinnedPage(url(path), pinned, new AbortController().signal);
  assert.match((await read("/good")).html, /Public page/);
  for (const path of ["/json", "/compressed", "/forbidden", "/oversized", "/chunked"]) await assert.rejects(read(path));
  assert.equal((await read("/redirect")).location, "/good");
  const active = new AbortController();
  const pending = readPinnedPage(url("/slow"), pinned, active.signal);
  active.abort();
  await assert.rejects(pending);
});
