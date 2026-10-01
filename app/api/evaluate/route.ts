import { buildState, composeEvaluation, validateIdea } from "@/lib/killmyidea/evaluate";
import { composeLocalEvaluation } from "@/lib/killmyidea/local-evaluate";
import { questionsFor } from "@/lib/killmyidea/questions";
import { askJev, resolveJevCredentials, TypeSafeError } from "@/lib/killmyidea/typesafe";
function json(body: unknown, status = 200) { return Response.json(body, { status, headers: { "Cache-Control": "no-store" } }); }
export async function POST(request: Request) {
  // Same-origin requests only. The site is private by default.
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) return json({ error: "Please submit your idea from this website." }, 403);
  if (Number(request.headers.get("content-length") || 0) > 30000) return json({ error: "The idea is too long." }, 413);
  let payload: unknown;
  try { const text = await request.text(); if (text.length > 30000) return json({ error: "The idea is too long." }, 413); payload = JSON.parse(text); }
  catch { return json({ error: "Please submit a valid idea." }, 400); }
  const valid = validateIdea(payload && typeof payload === "object" ? (payload as {idea?:unknown}).idea : undefined);
  if (!valid.ok) return json({ error: valid.error }, 400);
  let credentials = resolveJevCredentials(process.env);
  if (!credentials) { try { const { env } = await import("cloudflare:workers"); credentials = resolveJevCredentials(env as unknown as Record<string,string>); } catch {} }
  if (!credentials) return json({ error: "Live roasting isn’t connected yet. You can explore the example below while we finish setup." }, 503);
  const started = performance.now();
  try {
    const { response, latencyMs } = await askJev({ ...credentials, state: buildState(valid.idea), questions: questionsFor("money") });
    const { debug: _debug, ...result } = composeEvaluation(response, latencyMs, false, "money");
    return json(result);
  } catch (e) {
    if (e instanceof TypeSafeError || e instanceof Error) {
      const { debug: _debug, ...result } = composeLocalEvaluation(valid.idea, Math.round(performance.now() - started), "money");
      return json(result);
    }
    return json({ error: "The evaluation couldn’t finish. Please try again." }, 502);
  }
}
