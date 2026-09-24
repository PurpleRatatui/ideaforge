"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Check, Copy, Flame, Hexagon, LoaderCircle, RotateCcw, Sparkles, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DIMENSION_LABELS, type DimensionKey } from "@/lib/killmyidea/questions";
import { riskCopy, strengthCopy } from "@/lib/killmyidea/copy";
import type { ResultModel } from "@/lib/killmyidea/types";

const exampleIdea = "Um assistente de refeições com IA para famílias que lidam com alergia alimentar. Ele cria um cardápio semanal seguro, gera lista de compras e cobra R$ 49 por mês.";
const exampleResult: ResultModel = { score: 53, verdict: "FIX", category: "Consumer", dimensions: { problem: 50, customer: 50, demand: 75, money: 25, reach: 50, different: 25, buildable: 100, shareable: 75 } };
const examplePlan = [
  ["01", "Encontrar a dor", "Dias 1–7", "Entreviste 10 mães ou pais que gerenciam uma alergia alimentar diagnosticada. Pergunte como planejam refeições seguras, conferem rótulos e compram hoje.", "Sinal: 6 descrevem o mesmo problema semanal."],
  ["02", "Testar a promessa", "Dias 8–14", "Ofereça um plano de refeições e uma lista de compras feitos manualmente para 5 famílias. Peça revisão de uma pessoa qualificada para o conteúdo relacionado a alergias.", "Sinal: 3 famílias aceitam um piloto pago."],
  ["03", "Buscar uso repetido", "Dias 15–30", "Rode um piloto concierge de duas semanas. Recrute em uma comunidade de pais com permissão da moderação e peça indicações às famílias participantes.", "Sinal: 3 famílias voltam na segunda semana."],
];

const DIMENSION_LABELS_PT: Record<DimensionKey, string> = {
  problem: "Problema real",
  customer: "Cliente claro",
  demand: "Demanda",
  money: "Dinheiro",
  reach: "Alcance",
  different: "Diferente",
  buildable: "Viável",
  shareable: "Compartilhável",
  adoption: "Adoção",
  appeal: "Apelo imediato",
  fun: "Diversão",
};

const riskCopyPt: Record<DimensionKey, string> = {
  problem: "A solução está mais clara que o problema.",
  customer: "Ainda não está claro quem precisa muito disso.",
  demand: "Ninguém parece resolver isso hoje. Você teria que criar o hábito.",
  money: "Conseguir usuários parece mais fácil que conseguir clientes.",
  reach: "Construir parece mais fácil que encontrar usuários.",
  different: "Faz sentido, mas várias alternativas também fazem.",
  buildable: "O MVP pode custar demais antes de ensinar algo.",
  shareable: "Ninguém tem um motivo claro para contar para outra pessoa.",
  adoption: "É útil para você, mas ainda não para outros devs.",
  appeal: "Não há um motivo imediato para testar.",
  fun: "A ideia é esperta no papel, mas ainda não parece divertida de usar.",
};

const verdictCopyPt: Record<string, string> = { KILL: "PARE", FIX: "AJUSTE", PURSUE: "SIGA" };

const strengthCopyPt: Record<DimensionKey, string> = {
  problem: "As pessoas sentem esse problema.",
  customer: "Você sabe exatamente para quem é.",
  demand: "As pessoas já tentam resolver isso hoje.",
  money: "A parte de pagamento está clara.",
  reach: "Você sabe onde encontrar usuários.",
  different: "Não parece igual a tudo que já existe.",
  buildable: "Dá para lançar uma primeira versão rápido.",
  shareable: "Usar o produto já dá motivo para comentar.",
  adoption: "Devs teriam motivo para usar.",
  appeal: "O gancho dá vontade de testar agora.",
  fun: "As pessoas brincariam com isso só pela experiência.",
};
type HivemindPlan = {
  project: { id: string; name: string; enrichmentStatus?: string; ready: boolean; alreadyExisted?: boolean };
  rebuild: HivemindAnswer;
  gtm: HivemindAnswer;
};
type HivemindAnswer = {
  response: string;
  persona?: { id?: string; name?: string };
  sources: { title: string; author?: string }[];
};
function createBrief(idea: string, result: ResultModel) {
  return `Melhore esta ideia de startup e crie um plano prático de go-to-market em português.\n\nIDEIA ORIGINAL\n${idea}\n\nAVALIAÇÃO KILLMYIDEA\nVeredito: ${result.verdict}\nScore: ${result.score}/100\n${Object.entries(result.dimensions).map(([k,v]) => `${DIMENSION_LABELS_PT[k as DimensionKey] || DIMENSION_LABELS[k as DimensionKey] || k}: ${v}/100`).join("\n")}\n\nTrate a avaliação como hipótese, não como prova de mercado. Ataque primeiro as dimensões com menor pontuação. Devolva: uma ideia mais nítida; uma cliente inicial específica; o problema e alternativas existentes; diferenciação; um MVP pequeno; hipótese de preço; um canal inicial de aquisição; posicionamento e uma mensagem exemplo; plano de 30 dias com experimentos, métricas de sucesso e critérios de parar ou pivotar. Identifique suposições e fatos que precisam de pesquisa. Não invente evidência de clientes nem estatísticas de mercado.`;
}
export default function IdeaRoasterPage() {
  const [idea, setIdea] = useState("");
  const [submittedIdea, setSubmittedIdea] = useState("");
  const [result, setResult] = useState<ResultModel | null>(null);
  const [isExample, setIsExample] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState("");
  const [hivemindPlan, setHivemindPlan] = useState<HivemindPlan | null>(null);
  const [hivemindLoading, setHivemindLoading] = useState(false);
  const [hivemindError, setHivemindError] = useState("");
  const [tab, setTab] = useState("roast");
  const [copied, setCopied] = useState(false);
  const resultsRef = useRef<HTMLElement>(null);
  const inputRef = useRef<HTMLTextAreaElement>(null);
  const requestLock = useRef(false);
  const hivemindRun = useRef(0);
  const hivemindAbort = useRef<AbortController | null>(null);

  function revealResult() { requestAnimationFrame(() => resultsRef.current?.scrollIntoView({ behavior: "smooth", block: "start" })); }
  function clearHivemind() {
    hivemindAbort.current?.abort();
    hivemindRun.current += 1;
    setHivemindPlan(null);
    setHivemindLoading(false);
    setHivemindError("");
  }
  async function runHivemind(ideaText: string, roastResult: ResultModel) {
    const run = ++hivemindRun.current;
    hivemindAbort.current?.abort();
    const controller = new AbortController();
    hivemindAbort.current = controller;
    const timeout = window.setTimeout(() => controller.abort(), 160000);
    setHivemindPlan(null); setHivemindError(""); setHivemindLoading(true);
    try {
      const response = await fetch("/api/hivemind", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea: ideaText, result: roastResult }), signal: controller.signal });
      const data = await response.json() as HivemindPlan & { error?: string };
      if (!response.ok) throw new Error(data.error || "O Hivemind não conseguiu terminar o plano. Tente novamente.");
      if (run === hivemindRun.current) setHivemindPlan(data);
    } catch (e) {
      if (run !== hivemindRun.current) return;
      const message = e instanceof Error && e.name !== "AbortError" ? e.message : "O Hivemind demorou demais. Tente novamente.";
      setHivemindError(message);
    } finally {
      window.clearTimeout(timeout);
      if (run === hivemindRun.current) setHivemindLoading(false);
    }
  }
  async function roast(value: string) {
    const clean = value.trim();
    if (requestLock.current) return { error: "Já existe uma avaliação em andamento." };
    if (clean.length < 20 || clean.length > 5000) { const message = "Escreva entre 20 e 5.000 caracteres: quem a ideia ajuda, o que ela faz e por que alguém usaria ou pagaria."; setError(message); inputRef.current?.focus(); return { error: message }; }
    requestLock.current = true; clearHivemind(); setLoading(true); setError(""); setResult(null); setIdea(value);
    try {
      const response = await fetch("/api/evaluate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea: clean }), signal: AbortSignal.timeout(35000) });
      const data = await response.json() as ResultModel & { error?: string };
      if (!response.ok) throw new Error(data.error || "A análise não terminou. Tente novamente.");
      if (data.needsDetail) { setError("A ideia precisa de mais detalhe. Diga quem é a cliente e qual problema você resolve."); return { needsDetail: true }; }
      setSubmittedIdea(clean); setResult(data); setIsExample(false); setTab("roast"); revealResult();
      void runHivemind(clean, data);
      return { score: data.score, verdict: data.verdict, dimensions: data.dimensions };
    } catch (e) { const message = e instanceof Error && e.name !== "TimeoutError" ? e.message : "A análise demorou demais. Tente novamente."; setError(message); return { error: message }; }
    finally { requestLock.current = false; setLoading(false); }
  }
  function showExample() { clearHivemind(); setError(""); setSubmittedIdea(exampleIdea); setResult(exampleResult); setIsExample(true); setTab("roast"); revealResult(); }
  async function copyBrief() {
    if (!result) return;
    try { await navigator.clipboard.writeText(createBrief(submittedIdea, result)); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    catch { setError("Não foi possível acessar a área de transferência. Selecione e copie o briefing abaixo."); }
  }
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: object, options: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    Promise.resolve(context.registerTool({ name: "roast_startup_idea", title: "Testar uma ideia de startup", description: "Envia uma ideia ao KillMyIdea e mostra a avaliação nesta página. A ideia é enviada à TypeSafe. Retorna erro quando o serviço está indisponível.", inputSchema: { type: "object", properties: { idea: { type: "string", minLength: 20, maxLength: 5000 } }, required: ["idea"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: true }, execute: async (input: unknown) => { if (!input || typeof input !== "object" || typeof (input as { idea?: unknown }).idea !== "string") throw new Error("idea must be a string"); return roast((input as { idea: string }).idea); } }, { signal: lifecycle.signal })).catch(() => {});
    return () => lifecycle.abort();
  }, []);
  const ranked = result ? Object.entries(result.dimensions).sort((a,b) => a[1]-b[1]) : [];
  return (
    <div className="site-shell">
      <a className="skip-link" href="#idea">Pular para o formulário da ideia</a>
      <header className="site-header wrap">
        <a className="wordmark" href="/roaster" aria-label="Página inicial do Idea Roaster"><span className="brand-icon"><Flame size={23} fill="currentColor" /></span>idea<span className="brand-light">forge</span><span className="brand-period">.</span></a>
        <nav aria-label="Navegação principal"><a href="/">She Is Solana</a><a href="#how-it-works">Como funciona</a><button onClick={showExample} disabled={loading}>Ver exemplo <ArrowRight size={15}/></button></nav>
      </header>
      <main>
        <section className="hero wrap" aria-labelledby="headline">
          <div className="hero-copy">
            <div className="eyebrow"><span className="tiny-line"/> PARA IDEIAS DE HACKATHON QUE PRECISAM DE TESTE</div>
            <h1 id="headline">Sua ideia.<br/>Sob pressão.<br/><span>Pronta para submeter.</span></h1>
            <p className="hero-description">Antes de submeter na Colosseum, teste a ideia. Veja os pontos fracos, ajuste a proposta e saia com um plano de go-to-market de 30 dias.</p>
            <div className="engine-line"><span>O FLUXO</span><div><Flame size={16}/> KillMyIdea <span className="engine-plus">+</span><Hexagon size={17}/> Hivemind</div></div>
            <div className="reference-collage" aria-hidden="true">
              <div className="collage-photo photo-one" />
              <div className="collage-photo photo-two" />
              <div className="collage-photo photo-three" />
              <div className="collage-ribbon">TESTE / AJUSTE / GTM</div>
              <div className="collage-badge">01/03</div>
              <div className="collage-mark">FORGE</div>
            </div>
          </div>
          <div className="input-area">
            <div className="card-note"><span>Ideia grande. Evidência primeiro.</span><ArrowDown size={22}/></div>
            <form className="idea-card" onSubmit={e => { e.preventDefault(); void roast(idea); }} aria-busy={loading}>
              <div className="card-heading"><span className="mono">01 / TESTE DA IDEIA</span><Flame size={20}/></div>
              <label htmlFor="idea">O que você está construindo?</label>
              <p className="input-help" id="idea-help">Para quem é? Qual problema dói de verdade?<br/>Por que alguém usaria ou pagaria?</p>
              <Textarea ref={inputRef} id="idea" value={idea} onChange={e => { setIdea(e.target.value); if (error) setError(""); }} placeholder="Um produto para [usuária específica] que sofre com [problema real], usando Solana porque [motivo que importa]…" maxLength={5000} disabled={loading} aria-describedby={`idea-help${error ? " idea-error" : ""}`} aria-invalid={!!error} className="idea-input"/>
              <div className="input-caption"><span>Um pitch rascunhado basta. Seja específica.</span><span>{idea.length.toLocaleString()} / 5,000</span></div>
              {error && <p className="form-error" id="idea-error" role="alert">{error}</p>}
              <Button type="submit" className="roast-button" disabled={loading}>{loading ? <><LoaderCircle className="spin"/> Testando a ideia…</> : <><Flame size={19}/> Testar a ideia <ArrowRight className="button-arrow" size={20}/></>}</Button>
              <p className="card-footnote">Teste primeiro. Hivemind ajuda a ajustar o que fizer sentido.</p>
            </form>
            <button className="example-link" onClick={showExample} disabled={loading}>Quer um exemplo? <span>Abrir o exemplo</span><ArrowRight size={16}/></button>
          </div>
        </section>
        <section className="process-section wrap" id="how-it-works" aria-labelledby="process-title">
          <div className="process-intro"><h2 id="process-title">Menos chute.<br/>Submissão melhor.</h2><span className="mono">DA IDEIA AO PRÓXIMO TESTE</span></div>
          <div className="process-grid">
            <article className="process-step"><div className="step-top"><span className="step-number">01</span><Flame size={21}/></div><h3>Teste.</h3><p>Oito perguntas diretas. Um veredito. Veja o que está fraco antes que o relógio do hackathon coma a semana.</p><span className="step-provider">KILLMYIDEA</span></article>
            <article className="process-step"><div className="step-top"><span className="step-number">02</span><Sparkles size={21}/></div><h3>Ajuste.</h3><p>Envie a análise ao Hivemind. Ajuste a usuária, o ângulo e a primeira versão que dá para entregar.</p><span className="step-provider">HIVEMIND</span></article>
            <article className="process-step"><div className="step-top"><span className="step-number">03</span><Target size={21}/></div><h3>Leve ao mercado.</h3><p>Saia com posicionamento, um canal de aquisição e um plano de 30 dias para testar demanda depois da submissão.</p><span className="step-provider">PRÓXIMO PASSO</span></article>
          </div>
        </section>
        {result && <section className="results-section wrap" ref={resultsRef} aria-labelledby="results-title" tabIndex={-1}>
          <div className="results-heading"><div><span className="eyebrow">{isExample ? "EXEMPLO ILUSTRATIVO · NÃO É UMA AVALIAÇÃO AO VIVO" : "SUA IDEIA, COM OS PONTOS FRACOS MARCADOS"}</span><h2 id="results-title">O que fica de pé.</h2></div><Button variant="ghost" className="close-results" onClick={() => { clearHivemind(); setResult(null); inputRef.current?.focus(); }} aria-label="Fechar resultados"><X size={20}/></Button></div>
          <p className="submitted-idea">“{submittedIdea}”</p>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="result-tabs"><TabsTrigger value="roast">01 O teste</TabsTrigger><TabsTrigger value="rebuild">02 O ajuste</TabsTrigger><TabsTrigger value="launch">03 Plano de GTM</TabsTrigger></TabsList>
            <TabsContent value="roast"><div className="roast-result"><div className="verdict-panel"><span className="mono">VEREDITO</span><h3>{verdictCopyPt[result.verdict] || result.verdict}<span>.</span></h3><div className="score">{result.score}<span>/100</span></div><p>{result.verdict === "KILL" ? "A base precisa de trabalho. Questione as suposições antes de construir." : result.verdict === "FIX" ? "Tem algo aqui. A versão atual precisa de um motivo mais claro para existir." : "Um bom ponto de partida. Agora teste com pessoas que poderiam usar ou pagar."}</p><span className="assessment-note">Isso pontua o pitch. Não prova demanda.</span></div><div className="dimension-grid">{Object.entries(result.dimensions).map(([key,value]) => <div className="dimension" key={key}><div><span>{DIMENSION_LABELS_PT[key as DimensionKey] || DIMENSION_LABELS[key as DimensionKey] || key}</span><strong>{value}<span>/100</span></strong></div><div className="bar"><span style={{ width: `${value}%`, background: value < 50 ? "#eb4b24" : value < 65 ? "#b57913" : "#3d7256" }}/></div></div>)}</div></div><div className="takeaways"><div><span className="mono">RISCO PRINCIPAL</span><p>{riskCopyPt[ranked[0][0] as DimensionKey]}</p></div><div><span className="mono">MELHOR SINAL</span><p>{strengthCopyPt[ranked[ranked.length-1][0] as DimensionKey]}</p></div></div><Button className="next-button" onClick={() => setTab("rebuild")}>Ajustar pontos fracos <ArrowRight size={18}/></Button>{!isExample && hivemindLoading && <p className="hivemind-inline-status"><LoaderCircle className="spin" size={15}/> Hivemind está criando o projeto e rascunhando o ajuste.</p>}</TabsContent>
            <TabsContent value="rebuild">{isExample ? <div className="rebuild-panel"><div className="section-label"><Hexagon size={19}/> EXEMPLO DO PRÓXIMO PASSO</div><h3>“Pessoas ocupadas” não é nicho.<br/>Uma dor semanal específica é.</h3><p className="rebuild-pitch">Um assistente de planejamento de refeições para famílias que lidam com alergia alimentar infantil, começando com uma restrição alimentar e um mercado local.</p><div className="rebuild-details"><div><span className="mono">CLIENTE MAIS CLARA</span><p>Famílias que passam horas conferindo receitas e rótulos toda semana.</p></div><div><span className="mono">PRIMEIRO PRODUTO MENOR</span><p>Um plano semanal revisado e uma lista de compras editável. Comece manualmente antes de criar app.</p></div><div><span className="mono">HIPÓTESE A TESTAR</span><p>Famílias pagariam pelo tempo economizado? Teste um piloto concierge semanal antes de definir assinatura.</p></div></div><p className="sample-note">Direção de exemplo escrita para esta demonstração. Não foi gerada pelo Hivemind; demanda e entrega segura ainda precisam de validação.</p><Button className="next-button" onClick={() => setTab("launch")}>Criar plano de GTM <ArrowRight size={18}/></Button></div> : <HivemindPanel mode="rebuild" plan={hivemindPlan} loading={hivemindLoading} error={hivemindError} result={result} idea={submittedIdea} copied={copied} onCopy={copyBrief} onRetry={() => void runHivemind(submittedIdea, result)} onNext={() => setTab("launch")}/> }</TabsContent>
            <TabsContent value="launch">{isExample ? <div className="plan-panel"><div className="section-label"><Target size={19}/> EXEMPLO · PRIMEIROS 30 DIAS</div><h3>Encontre cinco famílias.<br/>Conquiste a segunda semana.</h3><div className="plan-grid">{examplePlan.map(([number,title,time,body,metric]) => <article key={number}><span className="mono">{time}</span><h4>{title}</h4><p>{body}</p><strong>{metric}</strong></article>)}</div><p className="sample-note">São experimentos e metas propostas, não previsões. Se as entrevistas não mostrarem dor recorrente ou ninguém pagar, revise cliente e oferta.</p><Button className="next-button" onClick={() => { clearHivemind(); setResult(null); inputRef.current?.focus(); }}><RotateCcw size={16}/> Testar minha ideia</Button></div> : <HivemindPanel mode="launch" plan={hivemindPlan} loading={hivemindLoading} error={hivemindError} result={result} idea={submittedIdea} copied={copied} onCopy={copyBrief} onRetry={() => void runHivemind(submittedIdea, result)} onNext={() => { clearHivemind(); setResult(null); inputRef.current?.focus(); }}/> }</TabsContent>
          </Tabs>
        </section>}
      </main>
      <footer className="site-footer wrap"><span>Menos chute. Construção mais útil.</span><a href="https://github.com/monteduro/killmyidea" target="_blank" rel="noreferrer">Feito com KillMyIdea <ArrowRight size={14}/></a></footer>
    </div>
  );
}
function HivemindPanel({ mode, plan, loading, error, result, idea, copied, onCopy, onRetry, onNext }: { mode: "rebuild" | "launch"; plan: HivemindPlan | null; loading: boolean; error: string; result: ResultModel; idea: string; copied: boolean; onCopy: () => void; onRetry: () => void; onNext: () => void }) {
  const answer = mode === "rebuild" ? plan?.rebuild : plan?.gtm;
  const label = mode === "rebuild" ? "AJUSTE HIVEMIND" : "GTM HIVEMIND";
  const heading = mode === "rebuild" ? "Hivemind está ajustando a ideia." : "Agora há uma primeira rota até usuárias.";
  if (loading && !answer) return <div className="handoff-panel hivemind-panel"><div className="section-label"><LoaderCircle className="spin" size={19}/> HIVEMIND ESTÁ TRABALHANDO</div><h3>{mode === "rebuild" ? "Criando o projeto e ajustando a ideia." : "Criando o projeto e rascunhando o plano de GTM."}</h3><div className="status-steps"><span>Novo projeto no Hivemind</span><span>Leitura de contexto</span><span>Ajuste e plano de GTM</span></div><p>Isso pode levar um pouco: o Hivemind cria um projeto novo antes de escrever a estratégia.</p></div>;
  if (error) return <div className="handoff-panel hivemind-panel"><div className="section-label"><Hexagon size={19}/> HIVEMIND PRECISA DE ATENÇÃO</div><h3>O Hivemind não conseguiu terminar esta etapa.</h3><p>{error}</p><div className="button-row"><Button className="next-button" onClick={onRetry}><RotateCcw size={16}/> Tentar Hivemind de novo</Button><Button variant="ghost" className="copy-button" onClick={onCopy}>{copied ? <Check size={17}/> : <Copy size={17}/>} {copied ? "Briefing copiado" : "Copiar briefing alternativo"}</Button></div><details><summary>Ler briefing alternativo</summary><pre>{createBrief(idea,result)}</pre></details></div>;
  if (!plan || !answer) return <div className="handoff-panel hivemind-panel"><div className="section-label"><Hexagon size={19}/> PRÓXIMO: HIVEMIND</div><h3>Transforme o teste em uma versão melhor.</h3><p>Hivemind cria um projeto a partir da análise, ajusta a ideia e rascunha o plano de go-to-market.</p><Button className="next-button" onClick={onRetry}>Iniciar Hivemind <ArrowRight size={18}/></Button></div>;
  return <div className="hivemind-panel"><div className="section-label">{mode === "rebuild" ? <Sparkles size={19}/> : <Target size={19}/>} {label}</div><div className="project-strip"><span>Projeto criado no Hivemind</span><strong>{plan.project.ready ? "Contexto pronto" : plan.project.enrichmentStatus === "failed" ? "Contexto ainda utilizável" : "Contexto na fila"}</strong></div><h3>{heading}</h3><FormattedAnswer text={answer.response}/><Sources sources={answer.sources}/><Button className="next-button" onClick={onNext}>{mode === "rebuild" ? <>Criar plano de GTM <ArrowRight size={18}/></> : <><RotateCcw size={16}/> Testar outra ideia</>}</Button></div>;
}
function FormattedAnswer({ text }: { text: string }) {
  const blocks = text.trim().split(/\n{2,}/).filter(Boolean);
  return <div className="hivemind-answer">{blocks.map((block, index) => {
    const lines = block.split("\n").map(line => line.trim()).filter(Boolean);
    const title = lines[0]?.replace(/^#{1,3}\s*/, "");
    const hasHeading = /^#{1,3}\s/.test(lines[0] || "");
    return <section key={`${index}-${title || "block"}`}>{hasHeading && <h4>{title}</h4>}{(hasHeading ? lines.slice(1) : lines).map((line, lineIndex) => <p key={`${index}-${lineIndex}`}>{line.replace(/^[-*]\s*/, "").replace(/^\d+\.\s*/, "").replace(/\*\*/g, "")}</p>)}</section>;
  })}</div>;
}
function Sources({ sources }: { sources: HivemindAnswer["sources"] }) {
  if (!sources.length) return null;
  return <div className="source-list"><span className="mono">FONTES USADAS PELO HIVEMIND</span>{sources.map((source) => <p key={`${source.title}-${source.author || ""}`}>{source.title}{source.author ? <span> por {source.author}</span> : null}</p>)}</div>;
}
