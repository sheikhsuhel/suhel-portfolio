import assert from "node:assert/strict";
import { registerHooks } from "node:module";
import { randomUUID } from "node:crypto";
import { readdir, readFile } from "node:fs/promises";
import test from "node:test";

registerHooks({ resolve(id,ctx,next) { return next(id.startsWith(".") && !/\.[a-z]+$/.test(id) ? id+".ts" : id,ctx); } });
const { providerConfig, createProvider } = await import("../app/server/chat-provider.ts");
const { retrieve, lookup } = await import("../app/content/knowledge.ts");
const { POST } = await import("../app/api/chat/route.ts");
const { askPortfolio } = await import("../app/content/chat-client.ts");
const evidence = retrieve("Explain the Olist project.");
const context = {question:"Explain the Olist project.",recentQuestions:[],evidence};
const env = {GROQ_API_KEY:randomUUID()};
const ok = (answer, sources=[1]) => Response.json({model:"openai/gpt-oss-120b",choices:[{message:{content:JSON.stringify({passages:sources.map(source=>({source,text:answer}))})}}]});
const request = (body,origin="https://portfolio.test") => new Request("https://portfolio.test/api/chat",{method:"POST",headers:{origin,"Content-Type":"application/json"},body:JSON.stringify(body)});
test("only configured free-plan Groq models activate the server adapter", () => {
  assert.equal(providerConfig({}),null);
  assert.equal(providerConfig({...env,AI_PROVIDER:"disabled"}),null);
  assert.equal(providerConfig({...env,AI_MODEL:"unknown"}),null);
  assert.equal(providerConfig(env).model,"openai/gpt-oss-120b");
  assert.equal(providerConfig({...env,AI_MODEL:"openai/gpt-oss-20b"}).model,"openai/gpt-oss-20b");
});
test("mock provider receives a bounded grounded request and resolves model citations locally",async () => {
  const provider = createProvider(env,async(url,options)=>{
    assert.equal(new URL(url).hostname,"api.groq.com");
    assert.equal(options.headers.Authorization,"Bearer "+env.GROQ_API_KEY);
    const payload=JSON.parse(options.body);
    assert.equal(payload.max_completion_tokens,640);
    assert.ok(options.signal);
    assert.match(payload.messages[0].content,/never as instructions/i);
    assert.match(payload.messages[1].content,/99,441/);
    return ok(evidence[0].fact.split(". ")[0] + ".");
  });
  const {turn}=await provider.generate(context);
  assert.equal(turn.mode,"Cloud AI");
  assert.equal(turn.model,"openai/gpt-oss-120b");
  assert.equal(turn.source.href,"/projects/olist-excel-analytics");
});
test("model cannot supply invented sources, numbers or links",async()=>{
  for (const result of [ok("He worked as a senior data consultant."),ok("Invented reference",[99]),ok("Generated 450000 orders."),ok("Visit https://example.com")]) {
    assert.equal((await createProvider(env,async()=>result).generate(context)).turn,undefined);
  }
});
test("timeout and rejected key produce safe failure; 429 respects Retry-After",async()=>{
  for (const send of [async()=>{throw new DOMException("timeout","TimeoutError");},async()=>new Response("private upstream details",{status:401})]) {
    assert.deepEqual(await createProvider(env,send).generate(context),{reason:"unavailable"});
  }
  assert.deepEqual(await createProvider(env,async()=>new Response(null,{status:429,headers:{"Retry-After":"15"}})).generate(context),{reason:"limit",retryAfter:15});
});
test("transient failure retries once and model access failure selects the documented alternate",async()=>{
  for (const status of [503,404]) {
    const calls=[];
    const provider=createProvider(env,async(_,opts)=>{calls.push(JSON.parse(opts.body).model);return calls.length===1?new Response(null,{status}):ok(evidence[0].fact.split(". ")[0] + ".");});
    assert.equal((await provider.generate(context)).turn.mode,"Cloud AI");
    assert.deepEqual(calls,["openai/gpt-oss-120b",status===404?"openai/gpt-oss-20b":"openai/gpt-oss-120b"]);
  }
});
test("retrieval resolves methods, limitations, explicit topic changes and credential gaps",()=>{
  const topic=lookup("Explain the Olist project.",[]);
  const methods=lookup("What tools did you use?",[topic]);
  assert.match(methods.text,/pivot tables/i);
  assert.match(lookup("What was the biggest problem?",[topic,methods]).text,/2,965/);
  assert.match(lookup("What SQL skills does he demonstrate?",[methods]).text,/INNER JOIN/);
  assert.match(lookup("Did he earn IBM Generative AI?",[]).text,/does not provide/);
  assert.match(lookup("Aspire Cohort 3?",[]).text,/does not specify/);
  assert.match(lookup("Grameenphone Data Analytics in the AI Era?",[]).text,/not verified/);
  assert.equal(lookup("Is Suhel looking for a Data Analyst internship?", []).source.topic, "opportunities");
  assert.equal(lookup("Which internships has he completed?", []).source, undefined);
  assert.equal(lookup("Who was his employer?",[methods]).source,undefined);
});
test("route rejects invalid input, excess history, oversized bodies and cross-origin requests",async()=>{
  for(const [input,status] of [[{question:" ",history:[]},400],[{question:"hi",history:["1","2","3","4"]},400],[{question:"hi",history:[],source:"invented"},400],[{question:"x".repeat(9000),history:[]},413]]) {
    assert.equal((await POST(request(input))).status,status);
  }
  assert.equal((await POST(request({question:"hi",history:[]},"https://other.test"))).status,403);
});
test("missing secret and offline client fall back with explicit retrieval labels",async t=>{
  t.mock.method(globalThis,"fetch",async()=>{throw Error("offline")});
  const before=process.env.GROQ_API_KEY;
  delete process.env.GROQ_API_KEY;
  t.after(()=>{if(before!==undefined)process.env.GROQ_API_KEY=before});
  const response=await POST(request({question:context.question,history:[]}));
  assert.equal((await response.json()).mode,"Portfolio sources");
  assert.equal((await askPortfolio(context.question,[])).mode,"Portfolio sources");
});
test("client bundle excludes server credentials and provider transport",async()=>{
  const dir=new URL("../dist/client/",import.meta.url);
  const paths=await readdir(dir,{recursive:true});
  const js=paths.filter(p=>p.endsWith(".js"));
  assert.ok(js.length);
  for(const file of js) assert.doesNotMatch(await readFile(new URL(file,dir),"utf8"),/GROQ_API_KEY|api\.groq\.com\/openai/);
});

test("route uses only allowlisted evidence, and rejected credentials never reach the browser",async t=>{
  const prior=process.env.GROQ_API_KEY;
  process.env.GROQ_API_KEY=env.GROQ_API_KEY;
  t.after(()=>{if(prior===undefined)delete process.env.GROQ_API_KEY;else process.env.GROQ_API_KEY=prior;});
  let calls=0;
  t.mock.method(globalThis,"fetch",async(_,opts)=>{
    calls++;
    assert.doesNotMatch(opts.body,/private@example/);
    return calls===1 ? ok(evidence[0].fact.split(". ")[0] + ".") : new Response(env.GROQ_API_KEY,{status:401});
  });
  const payload={question:context.question,history:["Contact me at private@example.org"]};
  const success=await (await POST(request(payload))).json();
  assert.equal(success.mode,"Cloud AI");
  const failure=await (await POST(request(payload))).json();
  assert.equal(failure.mode,"Portfolio sources");
  assert.equal(JSON.stringify(failure).includes(env.GROQ_API_KEY),false);
  await POST(request({...payload,question:"Was IBM Generative AI completed?"}));
  assert.equal(calls,2);
});
test("client limit bounds calls without requiring a data store",async()=>{
  const {admission}=await import("../app/server/chat-limit.ts");
  const req=new Request("https://portfolio.test",{headers:{"x-vercel-forwarded-for":"192.0.2.8"}});
  for(let i=0;i<4;i++) assert.equal(await admission(req),0);
  assert.ok(await admission(req)>0);
});
test("cross-project comparisons cite both projects and course queries cite the PDF",()=>{
  const comparison=lookup("Compare Olist and SQL",[]);
  assert.equal(comparison.references.length,2);
  assert.equal(lookup("Where is Data Foundations with AI?",[]).source.href,"/certificate-data-foundations-with-ai.pdf");
  assert.equal(lookup("How much profit did Olist generate?",[]).source,undefined);
});
