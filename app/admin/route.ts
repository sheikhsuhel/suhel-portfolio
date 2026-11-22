import { events } from "../analytics-events";
import { dayKey, redisConfigured, transaction } from "../server/analytics";

export const dynamic = "force-dynamic";
const headers = { "Cache-Control": "private, no-store", "X-Robots-Tag": "noindex, nofollow", "Vary": "Authorization", "Referrer-Policy": "no-referrer" };

async function authorized(request: Request, token: string) {
  const auth = request.headers.get("authorization") ?? "";
  const expected = "Basic " + btoa("admin:" + token);
  const digest = (s: string) => crypto.subtle.digest("SHA-256", new TextEncoder().encode(s));
  const [left, right] = await Promise.all([digest(auth), digest(expected)]);
  const a = new Uint8Array(left), b = new Uint8Array(right);
  let difference = 0;
  for (let i = 0; i < a.length; i++) difference |= a[i] ^ b[i];
  return difference === 0;
}

export async function GET(request: Request) {
  const token = process.env.ADMIN_ANALYTICS_TOKEN;
  if (!token || token.length < 32) return new Response("Dashboard locked.", {status: 503, headers});
  if (!await authorized(request, token)) return new Response("Sign in to view analytics.", {status: 401, headers: {...headers, "WWW-Authenticate": 'Basic realm="Portfolio analytics", charset="UTF-8"'}});
  if (!redisConfigured()) return new Response("Analytics storage is not configured.", {status: 503, headers});
  const now = Date.now();
  const days = Array.from({length: 7}, (_, i) => dayKey(new Date(now - i * 86400000)));
  const labels = Object.values(events);
  try {
    const result = await transaction(days.map(day => ["HMGET", day, ...Object.keys(events)]));
    const rows = result.map(item => {
      if (!Array.isArray(item) || item.length !== labels.length) throw new Error("Invalid daily counts");
      return item.map(value => {
        const n = Number(value);
        if (!Number.isSafeInteger(n) || n < 0) throw new Error("Invalid count");
        return n;
      });
    });
    const totals = labels.map((_, i) => rows.reduce((sum, row) => sum + row[i], 0));
    const cards = labels.map((label, i) => `<article><h2>${label}</h2><strong>${totals[i]}</strong></article>`).join("");
    const table = days.map((day, i) => `<tr><th scope="row">${day.slice(-10)}</th>${rows[i].map(n => "<td>" + n + "</td>").join("")}</tr>`).join("");
    return new Response(`<!doctype html><html lang="en"><meta charset="utf-8"><meta name="viewport" content="width=device-width, initial-scale=1"><title>Portfolio analytics</title><style>
    *{box-sizing:border-box}body{font:1rem/1.5 system-ui;background:#0b192a;color:#edf4fb;margin:auto;max-width:70rem;padding:clamp(1rem,4vw,4rem)}h1{font-size:clamp(2rem,5vw,4rem);margin-bottom:0}p{color:#b8c7d9}section{display:grid;grid-template-columns:repeat(auto-fit,minmax(10rem,1fr));gap:.8rem}article{background:#142b46;padding:1rem;border-radius:.7rem}article h2,th{font-size:.88rem}strong{font-size:2rem}div{overflow:auto}table{border-collapse:collapse;width:100%}td,th{padding:.75rem;text-align:left;border-bottom:1px solid #496079}caption{text-align:left;font-weight:bold;margin:2rem 0 .5rem}
    </style><main><h1>Portfolio analytics</h1><p>Last seven UTC days, including today. Counts represent events. Repeat visits can contribute multiple events.</p><section>${cards}</section><div tabindex="0" aria-label="Scrollable daily counts"><table><caption>Daily activity</caption><thead><tr><th>Date (UTC)</th>${labels.map(l => "<th>" + l + "</th>").join("")}</tr></thead><tbody>${table}</tbody></table></div></main></html>`, {headers: {...headers, "Content-Type": "text/html; charset=utf-8", "Content-Security-Policy": "default-src 'none'; style-src 'unsafe-inline'; frame-ancestors 'none'; base-uri 'none'"}});
  } catch { return new Response("Analytics temporarily unavailable.", {status: 503, headers}); }
}
