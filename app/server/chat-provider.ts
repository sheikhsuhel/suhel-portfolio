import { instruction, type PortfolioSource, type Turn } from "../content/knowledge";

const models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"];
type Context = {question: string; recentQuestions: string[]; evidence: PortfolioSource[]};
type Result = {turn?: Turn; reason?: "unavailable" | "limit"; retryAfter?: number};
export interface ChatProvider { generate(context: Context): Promise<Result> }

export function providerConfig(env: Record<string, string | undefined> = process.env) {
  const model = env.AI_MODEL || models[0];
  if ((env.AI_PROVIDER || "groq") !== "groq" || !env.GROQ_API_KEY?.trim() || !models.includes(model)) return null;
  return {key: env.GROQ_API_KEY.trim(), model, allowAlternate: !env.AI_MODEL};
}

// URLs and citations are resolved from the server's allowlist, never model output.
function grounded(content: string, evidence: PortfolioSource[]): Turn | undefined {
  const item = JSON.parse(content);
  if (typeof item?.answer !== "string" || !item.answer.trim() || item.answer.length > 2400 ||
      /https?:\/\/|www\./i.test(item.answer) || !Array.isArray(item.sources) || !item.sources.length ||
      !item.sources.every((id: unknown) => Number.isInteger(id) && Number(id) >= 1 && Number(id) <= evidence.length)) return;
  const references = evidence.filter((_, i) => item.sources.includes(i + 1));
  const facts = references.map(s=>s.fact).join(" ").replaceAll(",","");
  const numbers = item.answer.replaceAll(",","").match(/\b\d+(?:\.\d+)?%?/g) ?? [];
  const supported = new Set(facts.match(/\b\d+(?:\.\d+)?%?/g) ?? []);
  if (numbers.some((n: string) => !supported.has(n))) return;
  return {role:"assistant", text:item.answer.trim(), mode:"Cloud AI", source:references[0], references};
}

export function createProvider(env: Record<string, string | undefined> = process.env, send: typeof fetch = fetch): ChatProvider | null {
  const config = providerConfig(env);
  if (!config) return null;
  return { async generate(context) {
    let model = config.model;
    const signal = AbortSignal.timeout(8000);
    for (let attempt = 0; attempt < 2; attempt++) {
      try {
        const response = await send("https://api.groq.com/openai/v1/chat/completions", {
          method:"POST", cache:"no-store", redirect:"error", signal,
          headers:{"Content-Type":"application/json",Authorization:"Bearer " + config.key},
          body:JSON.stringify({model, max_completion_tokens:640, reasoning_effort:"low", response_format:{type:"json_object"},
            messages:[
              {role:"system",content:instruction + ' Return a JSON object with answer (plain text) and sources (array of the 1-based evidence IDs actually used). Include no links.'},
              {role:"user",content:JSON.stringify({question:context.question, recentQuestions:context.recentQuestions, evidence:context.evidence.map((s,i)=>({id:i+1,title:s.title,fact:s.fact}))})},
            ]}),
        });
        if (response.status === 429) {
          const retry = Number(response.headers.get("retry-after")) || 60;
          return {reason:"limit", retryAfter:Math.min(86400,Math.max(1,Math.ceil(retry)))};
        }
        if ((response.status === 404 || response.status === 403) && config.allowAlternate && attempt === 0) {
          model = models[1]; continue;
        }
        if ([502,503,504].includes(response.status) && attempt === 0) continue;
        if (!response.ok) return {reason:"unavailable"};
        const data = await response.json();
        const raw = data.choices?.[0]?.message?.content;
        const turn = typeof raw === "string" ? grounded(raw, context.evidence) : undefined;
        if (turn && models.includes(data.model)) turn.model = data.model;
        return {turn};
      } catch { return {reason:"unavailable"}; }
    }
    return {reason:"unavailable"};
  }};
}
