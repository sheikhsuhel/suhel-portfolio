import { instruction, passageFormat, passageTurn, type PortfolioSource, type Turn } from "../content/knowledge";

const models = ["openai/gpt-oss-120b", "openai/gpt-oss-20b"];
type Context = {question: string; recentQuestions: string[]; evidence: PortfolioSource[]};
type Result = {turn?: Turn; reason?: "unavailable" | "limit"; retryAfter?: number};
export interface ChatProvider { generate(context: Context): Promise<Result> }

export function providerConfig(env: Record<string, string | undefined> = process.env) {
  const model = env.AI_MODEL || models[0];
  if ((env.AI_PROVIDER || "groq") !== "groq" || !env.GROQ_API_KEY?.trim() || !models.includes(model)) return null;
  return {key: env.GROQ_API_KEY.trim(), model, allowAlternate: !env.AI_MODEL};
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
              {role:"system",content:instruction + " " + passageFormat},
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
        const turn = typeof raw === "string" ? passageTurn(raw, context.evidence, "Cloud AI") : undefined;
        if (turn && models.includes(data.model)) turn.model = data.model;
        return {turn};
      } catch { return {reason:"unavailable"}; }
    }
    return {reason:"unavailable"};
  }};
}
