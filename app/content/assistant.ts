import { instruction, lookup, retrieve, type Turn } from "./knowledge";
export type { Turn } from "./knowledge";
type Session = { prompt(input: string, options: {signal: AbortSignal}): Promise<string>; destroy(): void };
type LocalModel = { availability(options: object): Promise<string>; create(options: object): Promise<Session> };

const modelOptions = { expectedInputs: [{type: "text", languages: ["en"]}], expectedOutputs: [{type: "text", languages: ["en"]}] };
const localModel = () => (globalThis as typeof globalThis & { LanguageModel?: LocalModel }).LanguageModel;

export async function modelAvailability() {
  return await localModel()?.availability(modelOptions) ?? "unavailable";
}

export async function prepareModel(onProgress: (percent: number) => void) {
  const model = localModel();
  if (!model) throw new Error("Model unavailable");
  const session = await model.create({...modelOptions, monitor(monitor: EventTarget) {
    monitor.addEventListener("downloadprogress", event => onProgress(Math.round((event as ProgressEvent).loaded * 100)));
  }});
  session.destroy();
}


export async function answer(question: string, history: Turn[], onDevice = false): Promise<Turn> {
  const base = lookup(question, history);
  if (!onDevice || !base.source) return base;
  let session: Session | undefined;
  try {
    const model = localModel();
    if (model && await model.availability(modelOptions) === "available") {
      const signal = AbortSignal.timeout(8000);
      session = await model.create({...modelOptions, signal, initialPrompts:[{role:"system",content:instruction}]});
      const evidence = retrieve(question, [...history].reverse().find(t => t.source)?.source);
      const text = (await session.prompt(JSON.stringify({question, evidence:evidence.map(s=>s.fact), recentQuestions:history.filter(t=>t.role==="user").slice(-3).map(t=>t.text)}), {signal})).trim();
      if (text && text.length <= 2400) return {...base, text, mode:"On-device AI", references:evidence};
    }
  } catch { /* Return the immediately available evidence if local generation fails. */ }
  finally { session?.destroy(); }
  return base;
}
