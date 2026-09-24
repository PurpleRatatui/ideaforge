import type { JevQuestion } from './questions'

export const TYPESAFE_URL = 'https://api.typesafe.ai/v1/systemone'
export const JEV_MODEL = 'jev-latest'

export type JevProvider = 'typesafe' | 'vercel'
const PROVIDERS = {
  typesafe: { url: TYPESAFE_URL, model: JEV_MODEL },
  vercel: { url: 'https://ai-gateway.vercel.sh/typesafe/v1/systemone', model: 'typesafe-ai/jev' },
} as const

/** Choose once, before a request. Never forward one provider's key to another. */
export function resolveJevCredentials(env: Record<string, string | undefined>): { apiKey: string; provider: JevProvider } | null {
  if (env.TYPESAFE_API_KEY?.trim()) return { apiKey: env.TYPESAFE_API_KEY.trim(), provider: 'typesafe' }
  if (env.AI_GATEWAY_API_KEY?.trim()) return { apiKey: env.AI_GATEWAY_API_KEY.trim(), provider: 'vercel' }
  return null
}

export type ScoreAnswer = {
  type: 'score'
  score: number
  legend: Record<string, string>
  probabilities: Record<string, number>
  confidence: number
}
export type ChoiceAnswer = {
  type: 'choice'
  choice: string
  probabilities: Record<string, number>
  confidence: number
}
export type NoulAnswer = { type: 'noul'; noul: number }
export type Answer = ScoreAnswer | ChoiceAnswer | NoulAnswer

export type SystemOneResponse = {
  model: string
  answers: Record<string, Answer>
  usage?: { input_tokens: number; output_tokens: number }
}

export class TypeSafeError extends Error {
  constructor(
    message: string,
    readonly status: number,
  ) {
    super(message)
  }
}

const RETRYABLE = new Set([429, 529])

/** One request, all questions in parallel. Latency covers the full round trip, including a retry. */
export async function askJev(opts: {
  apiKey: string
  provider?: JevProvider
  state: unknown
  questions: Record<string, JevQuestion>
  timeoutMs?: number
}): Promise<{ response: SystemOneResponse; latencyMs: number }> {
  const endpoint = PROVIDERS[opts.provider ?? 'typesafe']
  const body = JSON.stringify({ model: endpoint.model, state: opts.state, questions: opts.questions })
  const started = performance.now()

  for (let attempt = 0; ; attempt++) {
    const res = await fetch(endpoint.url, {
      method: 'POST',
      headers: { Authorization: `Bearer ${opts.apiKey}`, 'Content-Type': 'application/json' },
      body,
      signal: AbortSignal.timeout(opts.timeoutMs ?? 12_000),
    })
    if (res.ok) {
      const response = (await res.json()) as SystemOneResponse
      return { response, latencyMs: Math.round(performance.now() - started) }
    }
    if (RETRYABLE.has(res.status) && attempt === 0) {
      await new Promise((r) => setTimeout(r, 300))
      continue
    }
    const detail = await res.text().catch(() => '')
    throw new TypeSafeError(`Jev provider responded ${res.status}: ${detail.slice(0, 500)}`, res.status)
  }
}

export function readScore(answers: Record<string, Answer>, key: string): ScoreAnswer {
  const a = answers[key]
  if (a?.type !== 'score' || !Number.isFinite(a.score)) throw new Error(`Missing score answer: ${key}`)
  return a
}

export function readChoice<T extends string>(
  answers: Record<string, Answer>,
  key: string,
  allowed: readonly T[],
  fallback: T,
): ChoiceAnswer & { choice: T } {
  const a = answers[key]
  if (a?.type !== 'choice') throw new Error(`Missing choice answer: ${key}`)
  const choice = (allowed as readonly string[]).includes(a.choice) ? (a.choice as T) : fallback
  return { ...a, choice }
}

export function readNoul(answers: Record<string, Answer>, key: string): number {
  const a = answers[key]
  if (a?.type !== 'noul' || !Number.isFinite(a.noul)) throw new Error(`Missing noul answer: ${key}`)
  return a.noul
}
