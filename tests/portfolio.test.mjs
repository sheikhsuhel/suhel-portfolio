import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import test from "node:test";

// These tests import the same TypeScript modules that Next resolves at build time.
registerHooks({resolve(specifier, context, next) {
  if (specifier.startsWith(".") && !/\.[a-z]+$/.test(specifier)) return next(specifier + ".ts", context);
  return next(specifier, context);
}});
const {answer} = await import("../app/content/assistant.ts");
const {GET} = await import("../app/admin/route.ts");
const {POST} = await import("../app/api/activity/route.ts");
const {events} = await import("../app/analytics-events.ts");

test("portfolio retrieval answers specific questions and retains the topic", async () => {
  const olist = await answer("Tell me about Suhel's Olist project.", []);
  assert.match(olist.text, /99,441/);
  const follow = await answer("What recommendations came from that?", [olist]);
  assert.match(follow.text, /timestamps/);
  const sql = await answer("What about SQL?", [olist, follow]);
  assert.match(sql.text, /7,591/);
  assert.match((await answer("What is his salary?", [])).text, /Try asking about/);
});

test("on-device generation receives retrieved evidence and releases its session", async t => {
  let closed = false;
  t.mock.method(globalThis, "fetch", () => { throw Error("Unexpected network access"); });
  globalThis.LanguageModel = {availability: async () => "available", create: async () => ({
    prompt: async input => {assert.match(input, /North South University/); return JSON.stringify({passages:[{source:1,text:"Suhel studies Business Administration at North South University."}]});},
    destroy: () => {closed = true;},
  })};
  t.after(() => {delete globalThis.LanguageModel;});
  assert.equal((await answer("What degree is he studying?", [], true)).text, "Suhel studies Business Administration at North South University.");
  assert.equal(closed, true);
  globalThis.LanguageModel.create = async () => ({prompt: async () => JSON.stringify({passages:[{source:1,text:"He leads a consulting firm."}]}), destroy() {}});
  assert.equal((await answer("What degree is he studying?", [], true)).mode, "Portfolio sources");
});

test("dashboard fails closed and reads seven days only after authentication", async t => {
  const names = ["ADMIN_ANALYTICS_TOKEN","UPSTASH_REDIS_REST_URL","UPSTASH_REDIS_REST_TOKEN"];
  const before = names.map(key => process.env[key]);
  t.after(() => names.forEach((key,i) => {if (before[i] === undefined) delete process.env[key]; else process.env[key] = before[i];}));
  for (const key of names) delete process.env[key];
  const url = "https://portfolio.example/admin";
  assert.equal((await GET(new Request(url))).status, 503);
  process.env.ADMIN_ANALYTICS_TOKEN = "x".repeat(32);
  assert.equal((await GET(new Request(url))).status, 401);
  process.env.UPSTASH_REDIS_REST_URL = "https://storage.example";
  process.env.UPSTASH_REDIS_REST_TOKEN = "test-storage-token";
  const auth = {Authorization: "Basic " + btoa("admin:" + process.env.ADMIN_ANALYTICS_TOKEN)};
  const transport = t.mock.method(globalThis, "fetch", async (_, options) => {
    const commands = JSON.parse(options.body);
    if (commands[0][0] === "HINCRBY") {
      assert.equal(commands[0][2], "question");
      assert.equal(commands[1][0], "EXPIRE");
      return Response.json([{result: 1}, {result: 1}]);
    }
    assert.equal(commands.length, 7);
    return Response.json(commands.map(() => ({result: Object.keys(events).map(() => 2)})));
  });
  const response = await GET(new Request(url, {headers: auth}));
  assert.equal(response.status, 200);
  assert.match(response.headers.get("cache-control"), /no-store/);
  assert.match(await response.text(), /<strong>14<\/strong>/);
  const activity = (body, origin) => POST(new Request("https://portfolio.example/api/activity", {method:"POST", headers:{origin},body}));
  assert.equal((await activity("question","https://other.example")).status,403);
  assert.equal((await activity("unknown","https://portfolio.example")).status,400);
  assert.equal((await activity("x".repeat(40),"https://portfolio.example")).status,413);
  assert.equal((await activity("question","https://portfolio.example")).status,204);
  assert.equal(transport.mock.callCount(),2);
  transport.mock.mockImplementation(async () => Response.json(Array.from({length:7}, () => ({result:Object.keys(events).map(() => "")}))));
  assert.equal((await GET(new Request(url, {headers:auth}))).status,503);
  transport.mock.mockImplementation(async () => Response.json([{}, {}]));
  assert.equal((await activity("question","https://portfolio.example")).status,503);
});
