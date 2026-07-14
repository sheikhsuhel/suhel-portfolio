import assert from "node:assert/strict";
import { readFile } from "node:fs/promises";
import test from "node:test";

async function render(path = "/") {
  const workerUrl = new URL("../dist/server/index.js", import.meta.url);
  workerUrl.searchParams.set("test", `${process.pid}-${Date.now()}-${path}`);
  const { default: worker } = await import(workerUrl.href);

  return worker.fetch(
    new Request(`http://localhost${path}`, { headers: { accept: "text/html" } }),
    { ASSETS: { fetch: async () => new Response("Not found", { status: 404 }) } },
    { waitUntil() {}, passThroughOnException() {} },
  );
}

test("server-renders the verified portfolio", async () => {
  const response = await render();
  assert.equal(response.status, 200);
  assert.match(response.headers.get("content-type") ?? "", /^text\/html\b/i);

  const html = await response.text();
  assert.match(html, /Sheikh Suhel Ahmed/);
  assert.match(html, /Olist Order Delivery Analysis/);
  assert.match(html, /Google Data Analytics Professional Certificate/);
  assert.match(html, /Management Information Systems/);
  assert.match(html, /Ask Suhel AI/);
  assert.doesNotMatch(html, /Information Required|Coming Soon|Portfolio prototype/i);
  assert.doesNotMatch(html, /codex-preview|react-loading-skeleton|Your site is taking shape/i);
});

test("server-renders the Olist case-study route", async () => {
  const response = await render("/projects/olist-excel-analytics");
  assert.equal(response.status, 200);

  const html = await response.text();
  assert.match(html, /99,441/);
  assert.match(html, /91\.9%/);
  assert.match(html, /Order Distribution by Status/);
  assert.match(html, /Business recommendations/);
  assert.match(html, /Skills demonstrated/);
});

test("keeps claims bounded and supports Enter-key submission", async () => {
  const page = await readFile(new URL("../app/page.tsx", import.meta.url), "utf8");
  const caseStudy = await readFile(new URL("../app/content/olist-case-study.ts", import.meta.url), "utf8");
  const css = await readFile(new URL("../app/globals.css", import.meta.url), "utf8");

  assert.match(page, /event\.key === "Enter"/);
  assert.match(page, /event\.nativeEvent\.isComposing/);
  assert.match(page, /No percentage proficiency scores are claimed/);
  assert.match(caseStudy, /7_827/);
  assert.match(caseStudy, /2_965/);
  assert.doesNotMatch(page, /skill-progress|skill-percentage/);
  assert.match(css, /prefers-reduced-motion/);
});
