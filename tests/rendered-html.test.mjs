import assert from "node:assert/strict";
import test from "node:test";

async function render() {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}`);
  const { default: worker } = await import(workerUrl.href);
  return worker.fetch(new Request("http://localhost/", { headers: { accept: "text/html" } }), {
    ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) },
  }, { waitUntil() {}, passThroughOnException() {} });
}

test("renders the booking journey content", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  const html = await response.text();
  assert.match(html, /Подберите номер в Небуге под свои даты/);
  assert.match(html, /Соберите запрос за минуту/);
  assert.match(html, /https:\/\/wa\.me\/79184505226/);
  assert.match(html, /\/photos\/object-02\.png/);
  assert.match(html, /openstreetmap\.org\/export\/embed\.html/);
  assert.match(html, /Наличие и окончательная стоимость подтверждаются владельцем/);
  assert.match(html, /Размещение с домашними животными не предусмотрено/);
  assert.doesNotMatch(html, /codex-preview|Your site is taking shape|react-loading-skeleton/i);
});
