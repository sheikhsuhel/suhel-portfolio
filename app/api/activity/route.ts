import { events } from "../../analytics-events";
import { dayKey, redisConfigured, transaction } from "../../server/analytics";

export async function POST(request: Request) {
  if (request.headers.get("origin") !== new URL(request.url).origin) return new Response(null, {status: 403});
  if (!redisConfigured() || (process.env.ADMIN_ANALYTICS_TOKEN?.length ?? 0) < 32) return new Response(null, {status: 204});
  if (Number(request.headers.get("content-length")) > 32) return new Response(null, {status: 413});
  const reader = request.body?.getReader();
  if (!reader) return new Response(null, {status: 400});
  const bytes: number[] = [];
  while (true) {
    const {done, value} = await reader.read();
    if (done) break;
    if (bytes.length + value.length > 32) { await reader.cancel(); return new Response(null, {status: 413}); }
    bytes.push(...value);
  }
  const event = new TextDecoder().decode(new Uint8Array(bytes));
  if (!Object.hasOwn(events, event)) return new Response(null, {status: 400});
  const key = dayKey(new Date());
  try {
    await transaction([["HINCRBY",key,event,1],["EXPIRE",key,35 * 86400]]);
    return new Response(null, {status: 204});
  } catch { return new Response(null, {status: 503}); }
}
