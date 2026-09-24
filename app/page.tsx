"use client";

import { useEffect, useRef, useState } from "react";
import { ArrowDown, ArrowRight, Check, Copy, Flame, Hexagon, LoaderCircle, RotateCcw, Sparkles, Target, X } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Textarea } from "@/components/ui/textarea";
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs";
import { DIMENSION_LABELS, type DimensionKey } from "@/lib/killmyidea/questions";
import { riskCopy, strengthCopy } from "@/lib/killmyidea/copy";
import type { ResultModel } from "@/lib/killmyidea/types";

const exampleIdea = "An AI meal planner for busy people. It creates a weekly menu based on dietary preferences, generates a grocery list, and charges $9 per month.";
const exampleResult: ResultModel = { score: 53, verdict: "FIX", category: "Consumer", dimensions: { problem: 50, customer: 50, demand: 75, money: 25, reach: 50, different: 25, buildable: 100, shareable: 75 } };
const examplePlan = [
  ["01", "Find the pain", "Days 1–7", "Interview 10 parents managing a diagnosed food allergy. Ask how they plan safe meals, check labels, and shop today.", "Signal: 6 describe the same weekly problem."],
  ["02", "Test the promise", "Days 8–14", "Offer a manually prepared meal plan and shopping list to 5 families. Have a qualified specialist review allergy-related content.", "Signal: 3 families agree to a paid pilot."],
  ["03", "Earn repeat use", "Days 15–30", "Run a two-week concierge pilot. Recruit through one parent community with moderator permission, then ask participating families for referrals.", "Signal: 3 families return for a second week."],
];
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
  return `Improve this startup idea and create a practical go-to-market plan.\n\nORIGINAL IDEA\n${idea}\n\nKILLMYIDEA ASSESSMENT\nVerdict: ${result.verdict} IT\nScore: ${result.score}/100\n${Object.entries(result.dimensions).map(([k,v]) => `${DIMENSION_LABELS[k as DimensionKey] || k}: ${v}/100`).join("\n")}\n\nTreat the assessment as a hypothesis, not market evidence. Address the lowest-scoring dimensions first. Return: a sharper idea; a specific initial customer; the problem and existing alternatives; differentiation; a small MVP; a pricing hypothesis; one initial acquisition channel; positioning and a sample message; a 30-day plan with experiments, success metrics, and stop/pivot criteria. Identify assumptions and facts that need research. Do not invent customer evidence or market statistics.`;
}
export default function Home() {
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
      if (!response.ok) throw new Error(data.error || "Hivemind could not finish the plan. Please try again.");
      if (run === hivemindRun.current) setHivemindPlan(data);
    } catch (e) {
      if (run !== hivemindRun.current) return;
      const message = e instanceof Error && e.name !== "AbortError" ? e.message : "Hivemind took too long. Please try again.";
      setHivemindError(message);
    } finally {
      window.clearTimeout(timeout);
      if (run === hivemindRun.current) setHivemindLoading(false);
    }
  }
  async function roast(value: string) {
    const clean = value.trim();
    if (requestLock.current) return { error: "An evaluation is already running." };
    if (clean.length < 20 || clean.length > 5000) { const message = "Give us 20–5,000 characters: who it helps, what it does, and how it makes money."; setError(message); inputRef.current?.focus(); return { error: message }; }
    requestLock.current = true; clearHivemind(); setLoading(true); setError(""); setResult(null); setIdea(value);
    try {
      const response = await fetch("/api/evaluate", { method: "POST", headers: { "Content-Type": "application/json" }, body: JSON.stringify({ idea: clean }), signal: AbortSignal.timeout(35000) });
      const data = await response.json() as ResultModel & { error?: string };
      if (!response.ok) throw new Error(data.error || "The roast couldn’t finish. Please try again.");
      if (data.needsDetail) { setError("This idea needs a little more detail. Tell us exactly who the customer is and what problem you solve."); return { needsDetail: true }; }
      setSubmittedIdea(clean); setResult(data); setIsExample(false); setTab("roast"); revealResult();
      void runHivemind(clean, data);
      return { score: data.score, verdict: data.verdict, dimensions: data.dimensions };
    } catch (e) { const message = e instanceof Error && e.name !== "TimeoutError" ? e.message : "The roast took too long. Please try again."; setError(message); return { error: message }; }
    finally { requestLock.current = false; setLoading(false); }
  }
  function showExample() { clearHivemind(); setError(""); setSubmittedIdea(exampleIdea); setResult(exampleResult); setIsExample(true); setTab("roast"); revealResult(); }
  async function copyBrief() {
    if (!result) return;
    try { await navigator.clipboard.writeText(createBrief(submittedIdea, result)); setCopied(true); setTimeout(() => setCopied(false), 2500); }
    catch { setError("Clipboard access is unavailable. Select and copy the brief below."); }
  }
  useEffect(() => {
    const context = (document as Document & { modelContext?: { registerTool: (tool: object, options: { signal: AbortSignal }) => void | Promise<void> } }).modelContext;
    if (!context?.registerTool) return;
    const lifecycle = new AbortController();
    Promise.resolve(context.registerTool({ name: "roast_startup_idea", title: "Roast a startup idea", description: "Submit an idea to KillMyIdea and show the assessment on this page. Sends the idea to TypeSafe. Returns an error when the service is unavailable.", inputSchema: { type: "object", properties: { idea: { type: "string", minLength: 20, maxLength: 5000 } }, required: ["idea"], additionalProperties: false }, annotations: { readOnlyHint: false, untrustedContentHint: true }, execute: async (input: unknown) => { if (!input || typeof input !== "object" || typeof (input as { idea?: unknown }).idea !== "string") throw new Error("idea must be a string"); return roast((input as { idea: string }).idea); } }, { signal: lifecycle.signal })).catch(() => {});
    return () => lifecycle.abort();
  }, []);
  const ranked = result ? Object.entries(result.dimensions).sort((a,b) => a[1]-b[1]) : [];
  return (
    <div className="site-shell">
      <a className="skip-link" href="#idea">Skip to idea form</a>
      <header className="site-header wrap">
        <a className="wordmark" href="#" aria-label="Idea Forge home"><span className="brand-icon"><Flame size={23} fill="currentColor" /></span>idea<span className="brand-light">forge</span><span className="brand-period">.</span></a>
        <nav aria-label="Main navigation"><a href="#how-it-works">How it works</a><button onClick={showExample} disabled={loading}>See an example <ArrowRight size={15}/></button></nav>
      </header>
      <main>
        <section className="hero wrap" aria-labelledby="headline">
          <div className="hero-copy">
            <div className="eyebrow"><span className="tiny-line"/> FOR FOUNDERS WITH A THICK SKIN</div>
            <h1 id="headline">Your idea.<br/>Under fire.<br/><span>Built better.</span></h1>
            <p className="hero-description">Find the holes before the market does. Get a brutal reality check, sharpen your idea, and turn what survives into a go-to-market plan.</p>
            <div className="engine-line"><span>THE ONE–TWO PUNCH</span><div><Flame size={16}/> KillMyIdea <span className="engine-plus">+</span><Hexagon size={17}/> Hivemind</div></div>
            <div className="reference-collage" aria-hidden="true">
              <div className="collage-photo photo-one" />
              <div className="collage-photo photo-two" />
              <div className="collage-photo photo-three" />
              <div className="collage-ribbon">SCORE / REBUILD / GTM</div>
              <div className="collage-badge">01/03</div>
              <div className="collage-mark">FORGE</div>
            </div>
          </div>
          <div className="input-area">
            <div className="card-note"><span>Big ambition. Small ego.</span><ArrowDown size={22}/></div>
            <form className="idea-card" onSubmit={e => { e.preventDefault(); void roast(idea); }} aria-busy={loading}>
              <div className="card-heading"><span className="mono">01 / THE REALITY CHECK</span><Flame size={20}/></div>
              <label htmlFor="idea">So, what’s the big idea?</label>
              <p className="input-help" id="idea-help">Who’s it for? What problem does it solve?<br/>Why would someone pay?</p>
              <Textarea ref={inputRef} id="idea" value={idea} onChange={e => { setIdea(e.target.value); if (error) setError(""); }} placeholder="An app that helps [your customer] solve [a real problem] by [your unfair advantage]…" maxLength={5000} disabled={loading} aria-describedby={`idea-help${error ? " idea-error" : ""}`} aria-invalid={!!error} className="idea-input"/>
              <div className="input-caption"><span>A rough pitch is all you need.</span><span>{idea.length.toLocaleString()} / 5,000</span></div>
              {error && <p className="form-error" id="idea-error" role="alert">{error}</p>}
              <Button type="submit" className="roast-button" disabled={loading}>{loading ? <><LoaderCircle className="spin"/> Putting it under pressure…</> : <><Flame size={19}/> Roast my idea <ArrowRight className="button-arrow" size={20}/></>}</Button>
              <p className="card-footnote">Live roast first. Hivemind takes over after the verdict.</p>
            </form>
            <button className="example-link" onClick={showExample} disabled={loading}>Just looking? <span>Watch an idea get roasted</span><ArrowRight size={16}/></button>
          </div>
        </section>
        <section className="process-section wrap" id="how-it-works" aria-labelledby="process-title">
          <div className="process-intro"><h2 id="process-title">A little destruction.<br/>A lot of direction.</h2><span className="mono">FROM “WHAT IF” TO “WHAT’S NEXT”</span></div>
          <div className="process-grid">
            <article className="process-step"><div className="step-top"><span className="step-number">01</span><Flame size={21}/></div><h3>Roast it.</h3><p>Eight hard questions. One verdict. Find out what’s weak before you spend months building it.</p><span className="step-provider">KILLMYIDEA</span></article>
            <article className="process-step"><div className="step-top"><span className="step-number">02</span><Sparkles size={21}/></div><h3>Rebuild it.</h3><p>Give Hivemind the tough feedback. Find a sharper customer, a stronger angle, and a smaller first product.</p><span className="step-provider">HIVEMIND</span></article>
            <article className="process-step"><div className="step-top"><span className="step-number">03</span><Target size={21}/></div><h3>Take it to market.</h3><p>Leave with positioning, a first acquisition channel, and a 30-day plan to test real demand.</p><span className="step-provider">YOUR NEXT MOVE</span></article>
          </div>
        </section>
        {result && <section className="results-section wrap" ref={resultsRef} aria-labelledby="results-title" tabIndex={-1}>
          <div className="results-heading"><div><span className="eyebrow">{isExample ? "ILLUSTRATIVE EXAMPLE · NOT A LIVE EVALUATION" : "YOUR IDEA, UNDER THE MICROSCOPE"}</span><h2 id="results-title">Here’s what survives.</h2></div><Button variant="ghost" className="close-results" onClick={() => { clearHivemind(); setResult(null); inputRef.current?.focus(); }} aria-label="Close results"><X size={20}/></Button></div>
          <p className="submitted-idea">“{submittedIdea}”</p>
          <Tabs value={tab} onValueChange={setTab}>
            <TabsList className="result-tabs"><TabsTrigger value="roast">01 The roast</TabsTrigger><TabsTrigger value="rebuild">02 The rebuild</TabsTrigger><TabsTrigger value="launch">03 The GTM plan</TabsTrigger></TabsList>
            <TabsContent value="roast"><div className="roast-result"><div className="verdict-panel"><span className="mono">THE VERDICT</span><h3>{result.verdict} IT<span>.</span></h3><div className="score">{result.score}<span>/100</span></div><p>{result.verdict === "KILL" ? "The foundations need work. Challenge the assumptions before you build." : result.verdict === "FIX" ? "There’s something here. The current version needs a sharper reason to exist." : "A promising starting point. Now test it with people who might actually pay."}</p><span className="assessment-note">An assessment of your pitch, not proof of demand.</span></div><div className="dimension-grid">{Object.entries(result.dimensions).map(([key,value]) => <div className="dimension" key={key}><div><span>{DIMENSION_LABELS[key as DimensionKey] || key}</span><strong>{value}<span>/100</span></strong></div><div className="bar"><span style={{ width: `${value}%`, background: value < 50 ? "#eb4b24" : value < 65 ? "#b57913" : "#3d7256" }}/></div></div>)}</div></div><div className="takeaways"><div><span className="mono">THE BIGGEST HOLE</span><p>{riskCopy[ranked[0][0] as DimensionKey]}</p></div><div><span className="mono">SOMETHING TO BUILD ON</span><p>{strengthCopy[ranked[ranked.length-1][0] as DimensionKey]}</p></div></div><Button className="next-button" onClick={() => setTab("rebuild")}>Let’s make it better <ArrowRight size={18}/></Button>{!isExample && hivemindLoading && <p className="hivemind-inline-status"><LoaderCircle className="spin" size={15}/> Hivemind is creating the project and drafting the next step.</p>}</TabsContent>
            <TabsContent value="rebuild">{isExample ? <div className="rebuild-panel"><div className="section-label"><Hexagon size={19}/> AN EXAMPLE OF THE NEXT STEP</div><h3>“Busy people” isn’t a niche.<br/>A specific weekly headache is.</h3><p className="rebuild-pitch">A meal-planning assistant for parents managing a child’s food allergy, starting with one dietary constraint and one local grocery store.</p><div className="rebuild-details"><div><span className="mono">A CLEARER CUSTOMER</span><p>Parents who spend hours checking recipes and ingredient labels every week.</p></div><div><span className="mono">A SMALLER FIRST PRODUCT</span><p>A reviewed weekly plan and editable shopping list. Start manually before building an app.</p></div><div><span className="mono">THE ASSUMPTION TO TEST</span><p>Will families pay for time saved? Test a $15 weekly concierge pilot before setting a subscription price.</p></div></div><p className="sample-note">Sample direction written for this walkthrough. Not generated by Hivemind; customer demand and safe delivery still need validation.</p><Button className="next-button" onClick={() => setTab("launch")}>Turn it into a plan <ArrowRight size={18}/></Button></div> : <HivemindPanel mode="rebuild" plan={hivemindPlan} loading={hivemindLoading} error={hivemindError} result={result} idea={submittedIdea} copied={copied} onCopy={copyBrief} onRetry={() => void runHivemind(submittedIdea, result)} onNext={() => setTab("launch")}/> }</TabsContent>
            <TabsContent value="launch">{isExample ? <div className="plan-panel"><div className="section-label"><Target size={19}/> EXAMPLE · YOUR FIRST 30 DAYS</div><h3>Find five families.<br/>Earn a second week.</h3><div className="plan-grid">{examplePlan.map(([number,title,time,body,metric]) => <article key={number}><span className="mono">{time}</span><h4>{title}</h4><p>{body}</p><strong>{metric}</strong></article>)}</div><p className="sample-note">These are proposed experiments and targets, not forecasts. If interviews reveal no recurring pain or nobody pays, revisit the customer and offer.</p><Button className="next-button" onClick={() => { clearHivemind(); setResult(null); inputRef.current?.focus(); }}><RotateCcw size={16}/> Try your own idea</Button></div> : <HivemindPanel mode="launch" plan={hivemindPlan} loading={hivemindLoading} error={hivemindError} result={result} idea={submittedIdea} copied={copied} onCopy={copyBrief} onRetry={() => void runHivemind(submittedIdea, result)} onNext={() => { clearHivemind(); setResult(null); inputRef.current?.focus(); }}/> }</TabsContent>
          </Tabs>
        </section>}
      </main>
      <footer className="site-footer wrap"><span>Less wishful thinking. More worth building.</span><a href="https://github.com/monteduro/killmyidea" target="_blank" rel="noreferrer">Built with KillMyIdea <ArrowRight size={14}/></a></footer>
    </div>
  );
}
function HivemindPanel({ mode, plan, loading, error, result, idea, copied, onCopy, onRetry, onNext }: { mode: "rebuild" | "launch"; plan: HivemindPlan | null; loading: boolean; error: string; result: ResultModel; idea: string; copied: boolean; onCopy: () => void; onRetry: () => void; onNext: () => void }) {
  const answer = mode === "rebuild" ? plan?.rebuild : plan?.gtm;
  const label = mode === "rebuild" ? "HIVEMIND REBUILD" : "HIVEMIND GTM";
  const heading = mode === "rebuild" ? "Hivemind is giving it a better shape." : "Now it has a first route to market.";
  if (loading && !answer) return <div className="handoff-panel hivemind-panel"><div className="section-label"><LoaderCircle className="spin" size={19}/> HIVEMIND IS WORKING</div><h3>{mode === "rebuild" ? "Creating the project and rebuilding the idea." : "Creating the project and drafting the launch plan."}</h3><div className="status-steps"><span>New project in Hivemind</span><span>Project intel pass</span><span>Sharper idea and GTM plan</span></div><p>It can take a little while because Hivemind is creating a fresh project before it writes the strategy.</p></div>;
  if (error) return <div className="handoff-panel hivemind-panel"><div className="section-label"><Hexagon size={19}/> HIVEMIND NEEDS ATTENTION</div><h3>Hivemind could not finish this step.</h3><p>{error}</p><div className="button-row"><Button className="next-button" onClick={onRetry}><RotateCcw size={16}/> Try Hivemind again</Button><Button variant="ghost" className="copy-button" onClick={onCopy}>{copied ? <Check size={17}/> : <Copy size={17}/>} {copied ? "Brief copied" : "Copy fallback brief"}</Button></div><details><summary>Read the fallback brief</summary><pre>{createBrief(idea,result)}</pre></details></div>;
  if (!plan || !answer) return <div className="handoff-panel hivemind-panel"><div className="section-label"><Hexagon size={19}/> NEXT: HIVEMIND</div><h3>Turn the feedback into a better bet.</h3><p>Hivemind will create a project from the roast, then use that project to sharpen the idea and draft the go-to-market plan.</p><Button className="next-button" onClick={onRetry}>Start Hivemind <ArrowRight size={18}/></Button></div>;
  return <div className="hivemind-panel"><div className="section-label">{mode === "rebuild" ? <Sparkles size={19}/> : <Target size={19}/>} {label}</div><div className="project-strip"><span>Project created in Hivemind</span><strong>{plan.project.ready ? "Intel ready" : plan.project.enrichmentStatus === "failed" ? "Intel still usable" : "Intel queued"}</strong></div><h3>{heading}</h3><FormattedAnswer text={answer.response}/><Sources sources={answer.sources}/><Button className="next-button" onClick={onNext}>{mode === "rebuild" ? <>Turn it into a plan <ArrowRight size={18}/></> : <><RotateCcw size={16}/> Try another idea</>}</Button></div>;
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
  return <div className="source-list"><span className="mono">SOURCES HIVEMIND USED</span>{sources.map((source) => <p key={`${source.title}-${source.author || ""}`}>{source.title}{source.author ? <span> by {source.author}</span> : null}</p>)}</div>;
}
