import { DIMENSION_LABELS, type DimensionKey } from "@/lib/killmyidea/questions";
import type { ResultModel } from "@/lib/killmyidea/types";

const DEFAULT_BASE_URL = "https://hivemind.myosin.xyz";

export type HivemindCredentials = {
  apiKey: string;
  baseUrl: string;
};

export type HivemindPersona = "genius-strategist" | "gtm-architect" | "ghostwriter" | "general-assistant";
export type HivemindLocale = "pt-BR" | "en";

export type HivemindSource = {
  title: string;
  author?: string;
};

export type HivemindChatOutput = {
  response: string;
  persona?: {
    id?: string;
    name?: string;
  };
  sources: HivemindSource[];
  conversationId?: string;
  messageId?: string;
};

export type HivemindShapeOutput = {
  project: {
    id: string;
    name: string;
    enrichmentStatus?: string;
    ready: boolean;
    alreadyExisted?: boolean;
  };
  rebuild: HivemindChatOutput;
  gtm: HivemindChatOutput;
};

type JsonRecord = Record<string, unknown>;

export class HivemindError extends Error {
  status: number;
  code?: string;
  retryAfter?: string;

  constructor(message: string, status: number, code?: string, retryAfter?: string) {
    super(message);
    this.name = "HivemindError";
    this.status = status;
    this.code = code;
    this.retryAfter = retryAfter;
  }
}

export function resolveHivemindCredentials(env: Record<string, string | undefined>): HivemindCredentials | null {
  const apiKey = env.HIVEMIND_API_KEY?.trim();
  if (!apiKey) return null;
  const baseUrl = (env.HIVEMIND_API_BASE_URL?.trim() || DEFAULT_BASE_URL).replace(/\/+$/, "");
  return { apiKey, baseUrl };
}

export async function shapeIdeaWithHivemind(
  credentials: HivemindCredentials,
  idea: string,
  result: ResultModel,
  locale: HivemindLocale = "en",
): Promise<HivemindShapeOutput> {
  const createdProject = await createProject(credentials, idea, result, locale);
  const settledProject = await waitForProject(credentials, createdProject.id, createdProject.enrichmentStatus);
  const project = { ...createdProject, ...settledProject, ready: settledProject.enrichmentStatus === "ready" };

  const rebuild = await chatWithPersistenceFallback(credentials, {
    projectId: project.id,
    persona: "genius-strategist",
    text: buildRebuildPrompt(idea, result, locale),
    startConversation: true,
  });

  const gtm = await chatWithHistoryFallback(credentials, {
    projectId: project.id,
    persona: "gtm-architect",
    text: buildGtmPrompt(idea, result, rebuild.response, locale),
    conversationId: rebuild.conversationId,
  });

  return { project, rebuild, gtm };
}

async function createProject(credentials: HivemindCredentials, idea: string, result: ResultModel, locale: HivemindLocale) {
  const name = inferProjectName(idea);
  const projectType = sanitizeProjectType(result.category);
  const response = await hivemindJson<{
    success?: boolean;
    already_existed?: boolean;
    data?: JsonRecord;
  }>(credentials, "/api/v1/projects", {
    method: "POST",
    body: JSON.stringify({
      project_name: name,
      description: buildProjectDescription(idea, result, locale),
      project_type: projectType?.length ? projectType : undefined,
      stage: "idea",
      objectives: [
        "Improve the idea after a KillMyIdea roast",
        "Create a practical go-to-market plan",
        "Validate demand with low-cost experiments",
      ],
    }),
  }, 60000);

  const data = response.data || {};
  const id = asString(data.id) || asString(data.project_id);
  if (!id) throw new HivemindError("Hivemind did not return a project id.", 502, "invalid_project_response");

  return {
    id,
    name: asString(data.project_name) || name,
    enrichmentStatus: asString(data.enrichment_status),
    ready: data.enrichment_status === "ready",
    alreadyExisted: response.already_existed === true,
  };
}

async function waitForProject(credentials: HivemindCredentials, projectId: string, initialStatus?: string) {
  if (initialStatus === "ready" || initialStatus === "failed") return { enrichmentStatus: initialStatus };
  const deadline = Date.now() + 25000;
  let enrichmentStatus = initialStatus;

  while (Date.now() < deadline) {
    await delay(2500);
    const response = await hivemindJson<{ success?: boolean; data?: JsonRecord }>(
      credentials,
      `/api/v1/projects/${encodeURIComponent(projectId)}`,
      { method: "GET" },
      25000,
    );
    enrichmentStatus = asString(response.data?.enrichment_status) || enrichmentStatus;
    if (enrichmentStatus === "ready" || enrichmentStatus === "failed") break;
  }

  return { enrichmentStatus };
}

async function chatWithPersistenceFallback(
  credentials: HivemindCredentials,
  input: {
    projectId: string;
    persona: HivemindPersona;
    text: string;
    startConversation: boolean;
  },
) {
  try {
    return await chat(credentials, input);
  } catch (error) {
    if (error instanceof HivemindError && error.status === 403 && input.startConversation) {
      return chat(credentials, { projectId: input.projectId, persona: input.persona, text: input.text });
    }
    throw error;
  }
}

async function chatWithHistoryFallback(
  credentials: HivemindCredentials,
  input: {
    projectId: string;
    persona: HivemindPersona;
    text: string;
    conversationId?: string;
  },
) {
  if (!input.conversationId) return chat(credentials, input);
  try {
    return await chat(credentials, input);
  } catch (error) {
    if (error instanceof HivemindError && (error.status === 403 || error.status === 404)) {
      return chat(credentials, { projectId: input.projectId, persona: input.persona, text: input.text });
    }
    throw error;
  }
}

async function chat(
  credentials: HivemindCredentials,
  input: {
    projectId: string;
    persona: HivemindPersona;
    text: string;
    startConversation?: boolean;
    conversationId?: string;
  },
): Promise<HivemindChatOutput> {
  const response = await hivemindJson<{
    status?: string;
    data?: JsonRecord;
  }>(credentials, "/api/v1/chat", {
    method: "POST",
    headers: { "Idempotency-Key": idempotencyKey(input.persona) },
    body: JSON.stringify({
      text: input.text,
      stream: false,
      persona: input.persona,
      projectId: input.projectId,
      startConversation: input.startConversation || undefined,
      conversationId: input.conversationId || undefined,
    }),
  }, 90000);

  const data = response.data || {};
  const text = asString(data.response);
  if (!text) throw new HivemindError("Hivemind returned an empty response.", 502, "empty_response");

  const persona = isRecord(data.persona)
    ? { id: asString(data.persona.id), name: asString(data.persona.name) }
    : undefined;

  return {
    response: text,
    persona,
    sources: normalizeSources(data.sources),
    conversationId: asString(data.conversation_id),
    messageId: asString(data.message_id),
  };
}

async function hivemindJson<T>(
  credentials: HivemindCredentials,
  path: string,
  init: RequestInit,
  timeoutMs: number,
): Promise<T> {
  const controller = new AbortController();
  const timeout = setTimeout(() => controller.abort(), timeoutMs);
  const headers = new Headers(init.headers);
  headers.set("x-api-key", credentials.apiKey);
  if (init.body && !headers.has("Content-Type")) headers.set("Content-Type", "application/json");

  try {
    const response = await fetch(`${credentials.baseUrl}${path}`, { ...init, headers, signal: controller.signal });
    const retryAfter = response.headers.get("Retry-After") || undefined;
    const raw = await response.text();
    const body = raw ? parseJson(raw) : null;
    const apiError = extractError(body);

    if (!response.ok || apiError) {
      throw new HivemindError(
        apiError?.message || "Hivemind request failed.",
        response.status,
        apiError?.code,
        retryAfter,
      );
    }

    return body as T;
  } catch (error) {
    if (error instanceof HivemindError) throw error;
    if (error instanceof Error && error.name === "AbortError") {
      throw new HivemindError("Hivemind took too long to respond.", 504, "timeout");
    }
    throw new HivemindError("Hivemind could not be reached.", 502, "network_error");
  } finally {
    clearTimeout(timeout);
  }
}

const DIMENSION_LABELS_PT: Record<DimensionKey, string> = {
  problem: "Força do problema",
  customer: "Clareza da cliente",
  demand: "Demanda existente",
  money: "Disposição a pagar",
  reach: "Caminho de distribuição",
  different: "Diferenciação",
  buildable: "Viabilidade",
  shareable: "Potencial de indicação",
  adoption: "Adoção",
  appeal: "Apelo imediato",
  fun: "Diversão",
};

function buildProjectDescription(idea: string, result: ResultModel, locale: HivemindLocale) {
  const assessment = formatAssessment(result, locale);
  const maxIdeaLength = Math.max(1000, 4900 - assessment.length);
  if (locale === "pt-BR") {
    return [
      "Ideia de startup enviada pelo Idea Forge depois de um roast do KillMyIdea.",
      "",
      "IDEIA ORIGINAL",
      truncate(idea, maxIdeaLength),
      "",
      "AVALIAÇÃO KILLMYIDEA",
      assessment,
      "",
      "Use este projeto para ajustar cliente, posicionamento, MVP, plano de validação e caminho de go-to-market. Trate o roast como hipótese, não como evidência de mercado.",
    ].join("\n").slice(0, 5000);
  }

  return [
    "A startup idea submitted through Idea Forge after a KillMyIdea roast.",
    "",
    "ORIGINAL IDEA",
    truncate(idea, maxIdeaLength),
    "",
    "KILLMYIDEA ASSESSMENT",
    assessment,
    "",
    "Use this project to sharpen the customer, positioning, MVP, validation plan, and go-to-market path. Treat the roast as a hypothesis, not market evidence.",
  ].join("\n").slice(0, 5000);
}

function buildRebuildPrompt(idea: string, result: ResultModel, locale: HivemindLocale) {
  if (locale === "pt-BR") {
    return [
      "Ajuste esta ideia de startup depois do roast do KillMyIdea.",
      "Responda exclusivamente em português do Brasil. Não use títulos, labels ou bullets em inglês.",
      "Use tom direto, prático e específico para uma participante de hackathon da comunidade She Is Solana.",
      "",
      "IDEIA ORIGINAL",
      idea,
      "",
      "AVALIAÇÃO KILLMYIDEA",
      formatAssessment(result, locale),
      "",
      "Devolva Markdown conciso com exatamente estas seções:",
      "## Ideia ajustada",
      "## Cliente inicial",
      "## Problema e alternativas",
      "## Diferenciação",
      "## MVP pequeno",
      "## Hipótese de preço",
      "## Suposições para validar",
      "",
      "Ataque primeiro as dimensões com menor pontuação. Não invente evidência de clientes, tamanho de mercado, tração nem estatísticas. Marque afirmações incertas como suposições.",
    ].join("\n");
  }

  return [
    "Improve this startup idea after its KillMyIdea roast.",
    "",
    "ORIGINAL IDEA",
    idea,
    "",
    "KILLMYIDEA ASSESSMENT",
    formatAssessment(result, locale),
    "",
    "Return concise Markdown with these sections:",
    "## Sharper Idea",
    "## Initial Customer",
    "## Problem And Alternatives",
    "## Differentiation",
    "## Small MVP",
    "## Pricing Hypothesis",
    "## Assumptions To Validate",
    "",
    "Address the lowest-scoring dimensions first. Do not invent customer evidence, market size, traction, or statistics. Label uncertain claims as assumptions.",
  ].join("\n");
}

function buildGtmPrompt(idea: string, result: ResultModel, rebuild: string, locale: HivemindLocale) {
  if (locale === "pt-BR") {
    return [
      "Crie um plano prático de go-to-market para esta ideia ajustada.",
      "Responda exclusivamente em português do Brasil. Não use títulos, labels ou bullets em inglês.",
      "Use tom direto, prático e específico para uma participante de hackathon da comunidade She Is Solana.",
      "",
      "IDEIA ORIGINAL",
      idea,
      "",
      "AVALIAÇÃO KILLMYIDEA",
      formatAssessment(result, locale),
      "",
      "DIREÇÃO AJUSTADA",
      truncate(rebuild, 2600),
      "",
      "Devolva Markdown conciso com exatamente estas seções:",
      "## Nicho inicial",
      "## Posicionamento",
      "## Primeiro canal de aquisição",
      "## Mensagem exemplo",
      "## Plano de 30 dias",
      "## Métricas",
      "## Critérios para parar ou pivotar",
      "",
      "Mantenha o plano específico e testável. Prefira descoberta direta com usuárias e experimentos baratos a campanhas amplas de marca.",
    ].join("\n");
  }

  return [
    "Create a practical go-to-market plan for this improved startup idea.",
    "",
    "ORIGINAL IDEA",
    idea,
    "",
    "KILLMYIDEA ASSESSMENT",
    formatAssessment(result, locale),
    "",
    "IMPROVED DIRECTION",
    truncate(rebuild, 2600),
    "",
    "Return concise Markdown with these sections:",
    "## Beachhead",
    "## Positioning",
    "## First Acquisition Channel",
    "## Sample Message",
    "## 30-Day Plan",
    "## Metrics",
    "## Stop Or Pivot Criteria",
    "",
    "Keep the plan specific and testable. Prefer direct customer discovery and low-cost experiments over broad brand campaigns.",
  ].join("\n");
}

function formatAssessment(result: ResultModel, locale: HivemindLocale) {
  const labels = locale === "pt-BR" ? DIMENSION_LABELS_PT : DIMENSION_LABELS;
  return [
    locale === "pt-BR" ? `Veredito: ${result.verdict}` : `Verdict: ${result.verdict} IT`,
    locale === "pt-BR" ? `Pontuação: ${result.score}/100` : `Score: ${result.score}/100`,
    locale === "pt-BR" ? `Categoria: ${result.category || "Outra"}` : `Category: ${result.category || "Other"}`,
    ...Object.entries(result.dimensions)
      .sort((a, b) => a[1] - b[1])
      .map(([key, value]) => `${labels[key as DimensionKey] || key}: ${value}/100`),
  ].join("\n");
}

function inferProjectName(idea: string) {
  const oneLine = idea.replace(/\s+/g, " ").trim();
  const firstSentence = oneLine.split(/[.!?]/)[0]?.trim() || oneLine;
  const title = firstSentence || "Idea Forge Project";
  return title.length > 64 ? `${title.slice(0, 61).trim()}...` : title;
}

function sanitizeProjectType(category: string) {
  const clean = category.replace(/\s+/g, " ").trim();
  return clean.length >= 2 && clean.length <= 50 ? [clean] : undefined;
}

function normalizeSources(input: unknown): HivemindSource[] {
  if (!Array.isArray(input)) return [];
  return input
    .map((source) => {
      if (!isRecord(source)) return null;
      const title = asString(source.title);
      if (!title) return null;
      const author = asString(source.author);
      return author ? { title, author } : { title };
    })
    .filter((source): source is HivemindSource => Boolean(source))
    .slice(0, 6);
}

function extractError(body: unknown) {
  if (!isRecord(body)) return null;
  if (body.success === false && isRecord(body.error)) {
    return {
      code: asString(body.error.code),
      message: asString(body.error.message) || "Hivemind request failed.",
    };
  }
  if (typeof body.error === "string") {
    return {
      code: asString(body.code) || body.error,
      message: asString(body.message) || body.error,
    };
  }
  return null;
}

function parseJson(raw: string) {
  try {
    return JSON.parse(raw) as unknown;
  } catch {
    throw new HivemindError("Hivemind returned an unreadable response.", 502, "invalid_json_response");
  }
}

function isRecord(value: unknown): value is JsonRecord {
  return typeof value === "object" && value !== null && !Array.isArray(value);
}

function asString(value: unknown) {
  return typeof value === "string" && value.trim() ? value.trim() : undefined;
}

function truncate(value: string, maxLength: number) {
  if (value.length <= maxLength) return value;
  return `${value.slice(0, Math.max(0, maxLength - 3)).trim()}...`;
}

function delay(ms: number) {
  return new Promise((resolve) => setTimeout(resolve, ms));
}

function idempotencyKey(prefix: string) {
  const id = typeof crypto !== "undefined" && "randomUUID" in crypto
    ? crypto.randomUUID()
    : `${Date.now()}-${Math.random().toString(36).slice(2)}`;
  return `idea-forge-${prefix}-${id}`.slice(0, 128);
}
