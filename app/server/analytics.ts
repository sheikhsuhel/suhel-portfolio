export function redisConfigured() {
  return Boolean(process.env.UPSTASH_REDIS_REST_URL && process.env.UPSTASH_REDIS_REST_TOKEN);
}

export async function transaction(commands: (string | number)[][]): Promise<unknown[]> {
  const url = new URL("/multi-exec", process.env.UPSTASH_REDIS_REST_URL);
  if (url.protocol !== "https:") throw new Error("Secure storage required");
  const response = await fetch(url, {
    method: "POST", headers: { Authorization: "Bearer " + process.env.UPSTASH_REDIS_REST_TOKEN, "Content-Type": "application/json" },
    body: JSON.stringify(commands), cache: "no-store", signal: AbortSignal.timeout(4000),
  });
  if (!response.ok) throw new Error("Analytics storage unavailable");
  const rows = await response.json() as {result?: unknown; error?: string}[];
  if (!Array.isArray(rows) || rows.length !== commands.length || rows.some(item => item.error)) throw new Error("Analytics read/write failed");
  return rows.map(row => row.result);
}

export function dayKey(date: Date) {
  return "portfolio:activity:" + date.toISOString().slice(0,10);
}
