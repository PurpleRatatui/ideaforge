import { CATEGORIES, DECISION_COUNT, DEFAULT_GOAL, dimensionsFor, type DimensionKey, type Goal } from './questions'
import { averageScore, LOW_CLARITY_WARNING, SCORING_VERSION } from './scoring'
import type { Evaluation } from './types'
import { getVerdict } from './verdict'

const clamp = (value: number, min = 10, max = 92) => Math.max(min, Math.min(max, Math.round(value)))
const has = (text: string, pattern: RegExp) => pattern.test(text)

const PATTERNS = {
  target: /\b(for|para|ajuda(?:r)?|helps?|women|mulheres|builders?|founders?|devs?|developers?|times?|teams?|parents?|m[aã]es|pais|students?|estudantes|creators?|criadoras?|pm(?:s)?|designers?|marketers?)\b/i,
  pain: /\b(problem|pain|dor|dificuldade|fric[cç][aã]o|waste|perde|perdem|reduce|reduzir|save|economi[sz]a|manual|lento|slow|expensive|caro|risco|risk|fail|falha|validate|validar)\b/i,
  demand: /\b(already|today|hoje|currently|atualmente|spreadsheet|planilha|manual|workaround|gambiarra|existing|existente|pay|pagam|pagar|hours?|horas|every week|toda semana)\b/i,
  money: /\b(pay|paid|pricing|price|subscription|subscribe|revenue|charge|cobrar|pagamento|pre[cç]o|assinatura|mensal|monthly|r\$|\$|saves money|reduz custo|economiza)\b/i,
  reach: /\b(community|comunidade|discord|whatsapp|telegram|instagram|tiktok|linkedin|github|reddit|newsletter|marketplace|meetup|evento|seo|search|busca|creators?|influencers?)\b/i,
  different: /\b(unlike|diferente|instead|em vez|because|porque|solana|onchain|blockchain|ai|ia|agentic|ag[eê]ntic|open source|first|novo|nova)\b/i,
  buildable: /\b(app|web|site|plugin|bot|api|dashboard|mvp|prototype|prot[oó]tipo|no-code|hackathon|software|workflow|fluxo)\b/i,
  hardToBuild: /\b(hardware|medical device|dispositivo m[eé]dico|bank|banco|insurance|seguro|drone|robot|rob[oô]|biotech|clinical|cl[ií]nico|factory|f[aá]brica|satellite|sat[eé]lite)\b/i,
  share: /\b(share|compartilh|viral|invite|convite|referral|indica|community|comunidade|social|friends?|amigos|network|rede|show|mostrar)\b/i,
}

function wordCount(idea: string) {
  return idea.trim().split(/\s+/).filter(Boolean).length
}

function scoreDimension(idea: string, key: DimensionKey): number {
  const text = idea.toLowerCase()
  const words = wordCount(idea)
  const detail = words >= 35 ? 10 : words >= 22 ? 6 : words >= 12 ? 2 : -8

  switch (key) {
    case 'problem':
      return clamp(34 + detail + (has(text, PATTERNS.pain) ? 22 : 0) + (has(text, PATTERNS.target) ? 10 : 0) + (has(text, /\b(nice to have|curiosity|curiosidade|fun only)\b/i) ? -12 : 0))
    case 'customer':
      return clamp(32 + detail + (has(text, PATTERNS.target) ? 26 : 0) + (has(text, /\b(everyone|todo mundo|anyone|qualquer pessoa)\b/i) ? -22 : 0))
    case 'demand':
      return clamp(30 + detail + (has(text, PATTERNS.demand) ? 24 : 0) + (has(text, PATTERNS.pain) ? 8 : 0))
    case 'money':
      return clamp(26 + detail + (has(text, PATTERNS.money) ? 30 : 0) + (has(text, /\b(b2b|business|empresa|teams?|times?|saves money|revenue|reduz custo)\b/i) ? 12 : 0))
    case 'reach':
      return clamp(34 + detail + (has(text, PATTERNS.reach) ? 26 : 0) + (has(text, PATTERNS.target) ? 8 : 0))
    case 'different':
      return clamp(33 + detail + (has(text, PATTERNS.different) ? 20 : 0) + (has(text, /\b(ai app|app de ia|marketplace|social network|rede social)\b/i) ? -8 : 0))
    case 'buildable':
      return clamp(62 + (has(text, PATTERNS.buildable) ? 16 : 0) + (has(text, PATTERNS.hardToBuild) ? -30 : 0) + (words > 90 ? -6 : 0), 18, 95)
    case 'shareable':
      return clamp(34 + detail + (has(text, PATTERNS.share) ? 26 : 0) + (has(text, /\b(consumer|creator|community|comunidade|friends?|amigos)\b/i) ? 8 : 0))
    case 'adoption':
      return clamp(34 + detail + (has(text, /\b(api|sdk|github|open source|developer|devs?|library|biblioteca|cli|framework)\b/i) ? 30 : 0))
    case 'appeal':
      return clamp(36 + detail + (has(text, /\b(fun|game|jogo|meme|viral|surprising|curioso|instant|imediato)\b/i) ? 24 : 0))
    case 'fun':
      return clamp(34 + detail + (has(text, /\b(fun|game|jogo|play|brincar|meme|challenge|desafio|creative|criativo)\b/i) ? 28 : 0))
  }
}

function categoryFor(idea: string): (typeof CATEGORIES)[number] {
  const text = idea.toLowerCase()
  if (has(text, /\b(ai|ia|llm|gpt|agent|agente)\b/i)) return 'AI'
  if (has(text, /\b(api|sdk|developer|devs?|github|cli|infra|framework)\b/i)) return 'Developer Tool'
  if (has(text, /\b(payment|payments|bank|fintech|kyc|wallet|carteira|pagamento|pix|cripto|crypto)\b/i)) return 'Fintech'
  if (has(text, /\b(marketplace|connects buyers|connecta compradores|sellers|vendedores)\b/i)) return 'Marketplace'
  if (has(text, /\b(shop|store|ecommerce|commerce|loja|venda online)\b/i)) return 'Ecommerce'
  if (has(text, /\b(social|community|comunidade|network|rede|creator|criador)\b/i)) return 'Social'
  if (has(text, /\b(app|consumer|families|parents|pessoas|usu[aá]rios)\b/i)) return 'Consumer'
  if (has(text, /\b(b2b|saas|subscription|assinatura|dashboard|teams?|times?)\b/i)) return 'SaaS'
  return 'Other'
}

function understandableFor(idea: string) {
  const words = wordCount(idea)
  let score = words >= 20 ? 0.82 : words >= 12 ? 0.62 : 0.38
  if (has(idea, PATTERNS.target) && has(idea, PATTERNS.pain)) score += 0.1
  return Math.min(0.95, score)
}

export function composeLocalEvaluation(idea: string, latencyMs = 0, goal: Goal = DEFAULT_GOAL): Evaluation {
  const keys = dimensionsFor(goal)
  const dimensions = Object.fromEntries(keys.map((key) => [key, scoreDimension(idea, key)])) as Record<DimensionKey, number>
  const score = averageScore(dimensions, keys)
  const understandable = understandableFor(idea)
  const category = categoryFor(idea)
  const response = {
    model: 'local-fallback',
    answers: {
      ...Object.fromEntries(keys.map((key) => [key, {
        type: 'score' as const,
        score: Math.round((dimensions[key] / 100) * 4),
        legend: {},
        probabilities: {},
        confidence: 0.35,
      }])),
      category: { type: 'choice' as const, choice: category, probabilities: {}, confidence: 0.35 },
      is_understandable: { type: 'noul' as const, noul: understandable },
    },
  }

  return {
    score,
    verdict: getVerdict(score),
    needsDetail: understandable < LOW_CLARITY_WARNING,
    scoringVersion: SCORING_VERSION,
    goal,
    dimensions,
    category,
    understandable,
    decisions: DECISION_COUNT,
    latencyMs,
    evaluationSource: 'local-fallback',
    debug: {
      model: response.model,
      latencyMs,
      mock: true,
      dimensions: keys.map((key) => ({ key, raw: Math.round((dimensions[key] / 100) * 4), normalized: dimensions[key], confidence: 0.35, probabilities: {} })),
      category: { choice: category, confidence: 0.35, probabilities: {} },
      understandable,
      response,
    },
  }
}
