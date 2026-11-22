import { lookup, retrieve, sources, type Turn } from "../../content/knowledge";
import { createProvider } from "../../server/chat-provider";
import { admission, pauseCloud } from "../../server/chat-limit";

const privateText = /\b(?:gsk_|sk-|ghp_|github_pat_)\S+|[\w.+-]+@[\w.-]+\.\w+|(?:\d[ -]?){9,}|https?:\/\/\S+|(?:password|api key|secret|token)\s*[:=]/i;
const json = (data: unknown, status = 200, extra: Record<string,string> = {}) => Response.json(data,{status,headers:{"Cache-Control":"no-store",...extra}});

async function readInput(request: Request) {
  const reader = request.body?.getReader();
  if (!reader) throw Error("invalid");
  const bytes: number[] = [];
  while (true) {
    const {done,value} = await reader.read();
    if (done) break;
    if (bytes.length + value.length > 8192) { await reader.cancel(); throw Error("large"); }
    bytes.push(...value);
  }
  return JSON.parse(new TextDecoder("utf-8",{fatal:true}).decode(new Uint8Array(bytes)));
}

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return json({error:"Origin rejected"},403);
  if (request.headers.get("content-type")?.split(";")[0] !== "application/json") return json({error:"JSON required"},415);
  if (Number(request.headers.get("content-length")) > 8192) return json({error:"Request too large"},413);
  let input;
  try { input = await readInput(request); } catch (e) { return json({error:"Invalid request"}, e instanceof Error && e.message === "large" ? 413 : 400); }
  if (!input || typeof input.question !== "string" || !input.question.trim() || input.question.length > 600 ||
      !Array.isArray(input.history) || input.history.length > 3 ||
      !input.history.every((s: unknown)=>typeof s === "string" && s.length <= 600) ||
      (input.source !== undefined && (typeof input.source !== "string" || !sources.some(s=>s.title === input.source)))) return json({error:"Invalid question or history"},400);
  const question = input.question.trim();
  const previous = sources.find(s=>s.title === input.source);
  const history: Turn[] = previous ? [{role:"assistant",text:"",source:previous}] : [];
  const fallback = lookup(question,history);
  const provider = createProvider();
  if (!provider || !fallback.source || privateText.test(question) || (fallback.source.topic === "ibm-gen" || /\bcohort\b|data analytics in the ai era/i.test(question))) return json(fallback);
  const retry = await admission(request);
  if (retry) return json({...fallback,notice:"Cloud limit reached. Showing portfolio evidence."},429,{"Retry-After":String(retry)});
  const evidence = retrieve(question,previous);
  const result = await provider.generate({question,recentQuestions:input.history.filter((q: string)=>!privateText.test(q) && retrieve(q).length),evidence});
  if (result.turn) return json(result.turn);
  if (result.reason === "limit") {
    const wait = result.retryAfter || 60;
    pauseCloud(wait);
    return json({...fallback,notice:"Cloud limit reached. Showing portfolio evidence."},429,{"Retry-After":String(wait)});
  }
  return json({...fallback,notice:"Cloud answer unavailable. Showing portfolio evidence."});
}
