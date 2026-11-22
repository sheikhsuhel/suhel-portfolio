import { lookup, type Turn } from "./knowledge";

export async function askPortfolio(question: string, history: Turn[]): Promise<Turn> {
  const prior = [...history].reverse().find(t=>t.source);
  try {
    const result = await fetch("/api/chat",{
      method:"POST", headers:{"Content-Type":"application/json"}, signal:AbortSignal.timeout(10000),
      body:JSON.stringify({question, source:prior?.source?.title, history:history.filter(t=>t.role==="user").slice(-3).map(t=>t.text.slice(0,600))}),
    });
    if (result.ok || result.status === 429) {
      const turn = await result.json() as Turn;
      if (turn.role === "assistant" && turn.text && turn.mode) return turn;
    }
  } catch { /* Offline and failed requests use the same public evidence. */ }
  return {...lookup(question,history),notice:"Couldn’t reach the chat service. Showing portfolio evidence."};
}
