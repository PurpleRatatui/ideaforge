import { validateIdea } from "@/lib/killmyidea/evaluate";
import type { ResultModel } from "@/lib/killmyidea/types";
import { HivemindError, resolveHivemindCredentials, shapeIdeaWithHivemind } from "@/lib/hivemind/client";

function json(body: unknown, status = 200) {
  return Response.json(body, { status, headers: { "Cache-Control": "no-store" } });
}

export async function POST(request: Request) {
  if (request.headers.get("origin") && request.headers.get("origin") !== new URL(request.url).origin) {
    return json({ error: "Please submit your idea from this website." }, 403);
  }
  if (Number(request.headers.get("content-length") || 0) > 40000) return json({ error: "The idea is too long." }, 413);

  let payload: unknown;
  try {
    const text = await request.text();
    if (text.length > 40000) return json({ error: "The idea is too long." }, 413);
    payload = JSON.parse(text);
  } catch {
    return json({ error: "Please submit a valid idea." }, 400);
  }

  const record = payload && typeof payload === "object" ? payload as { idea?: unknown; result?: unknown } : {};
  const valid = validateIdea(record.idea);
  if (!valid.ok) return json({ error: valid.error }, 400);

  const result = parseResult(record.result);
  if (!result) return json({ error: "The roast result is missing or invalid." }, 400);

  let credentials = resolveHivemindCredentials(process.env);
  if (!credentials) {
    try {
      const { env } = await import("cloudflare:workers");
      credentials = resolveHivemindCredentials(env as unknown as Record<string, string>);
    } catch {}
  }
  if (!credentials) {
    return json({ error: "Hivemind is not connected yet. Add a server-side Hivemind API key to create projects and plans." }, 503);
  }

  try {
    return json(await shapeIdeaWithHivemind(credentials, valid.idea, result));
  } catch (error) {
    if (error instanceof HivemindError) {
      return json({ error: publicMessage(error) }, publicStatus(error));
    }
    return json({ error: "Hivemind could not finish the project plan. Please try again." }, 502);
  }
}

function parseResult(input: unknown): ResultModel | null {
  if (!input || typeof input !== "object" || Array.isArray(input)) return null;
  const record = input as Record<string, unknown>;
  const score = boundedNumber(record.score);
  const verdict = record.verdict === "KILL" || record.verdict === "FIX" || record.verdict === "SHIP" ? record.verdict : null;
  const category = typeof record.category === "string" && record.category.trim() ? record.category.trim().slice(0, 80) : "Other";
  const dimensionsInput = record.dimensions;
  if (score == null || !verdict || !dimensionsInput || typeof dimensionsInput !== "object" || Array.isArray(dimensionsInput)) return null;

  const dimensions = Object.fromEntries(
    Object.entries(dimensionsInput as Record<string, unknown>)
      .map(([key, value]) => [key, boundedNumber(value)])
      .filter((entry): entry is [string, number] => typeof entry[1] === "number"),
  );

  if (Object.keys(dimensions).length === 0) return null;
  return { score, verdict, category, dimensions };
}

function boundedNumber(value: unknown) {
  return typeof value === "number" && Number.isFinite(value) && value >= 0 && value <= 100 ? Math.round(value) : null;
}

function publicStatus(error: HivemindError) {
  if (error.status === 429) return 429;
  if (error.status === 504) return 504;
  if (error.status === 401 || error.status === 403) return 503;
  if (error.status === 402) return 503;
  return 502;
}

function publicMessage(error: HivemindError) {
  if (error.status === 401 || error.status === 403) return "Hivemind needs a server key with project and chat access.";
  if (error.status === 402) return "Hivemind billing or plan access is blocking this request.";
  if (error.status === 429) return "Hivemind is rate limited or out of quota. Give it a moment and try again.";
  if (error.status === 504 || error.code === "timeout") return "Hivemind took too long to respond. Try again in a moment.";
  return "Hivemind could not finish the project plan. Please try again.";
}
