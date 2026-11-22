import { redisConfigured, transaction } from "./analytics";

let windowStart = 0;
let total = 0;
let cooldown = 0;
const callers = new Map<string,number>();

export function pauseCloud(seconds: number) { cooldown = Math.max(cooldown,Date.now() + seconds * 1000); }
export async function admission(request: Request): Promise<number> {
  const now = Date.now();
  if (now < cooldown) return Math.ceil((cooldown-now)/1000);
  const minute = Math.floor(now / 60000);
  if (windowStart !== minute) { windowStart = minute; callers.clear(); total = 0; }
  const retry = 60 - Math.floor(now/1000) % 60;
  const ip = request.headers.get("x-vercel-forwarded-for")?.split(",")[0]?.trim() || "shared";
  const bytes = await crypto.subtle.digest("SHA-256",new TextEncoder().encode(minute + "/" + ip));
  const caller = Array.from(new Uint8Array(bytes).slice(0,12), b=>b.toString(16).padStart(2,"0")).join("");
  const count = callers.get(caller) || 0;
  if (count >= 4 || total >= 12) return retry;
  callers.set(caller,count+1); total++;
  if (redisConfigured()) {
    try {
      const key = "portfolio:chat-limit:" + minute;
      const values = await transaction([["HINCRBY",key,caller,1],["HINCRBY",key,"all",1],["EXPIRE",key,90]]);
      if (Number(values[0]) > 4 || Number(values[1]) > 12) return retry;
    } catch { return retry; }
  }
  return 0;
}
