import type { Metadata } from "next";
import Link from "next/link";
import { ArrowRight, CalendarDays, Flame, Hexagon, Sparkles, Target, Users } from "lucide-react";

export const metadata: Metadata = {
  title: "She Is Solana — Jornada para criar, validar e lançar ideias",
  description: "Uma jornada para mulheres e aliadas entrarem no ecossistema Solana, entenderem o hackathon da Colosseum e testarem ideias antes de construir.",
};

const journey = [
  ["01", "Entender o jogo", "Solana sem mistério: ecossistema, oportunidades, linguagem de builders e como uma ideia vira uma startup onchain."],
  ["02", "Encontrar a ideia", "Mapear problemas reais, escolher um público inicial e transformar curiosidade em hipótese clara para hackathon."],
  ["03", "Testar antes de codar", "Usar o roaster para receber feedback brutal, melhorar a proposta com Hivemind e sair com um plano de GTM."],
  ["04", "Entrar na arena", "Chegar na Colosseum com narrativa, MVP, pitch, validação inicial e próximos passos para competir com seriedade."],
];

const organizers = [
  ["Carol Labs", "Desenha a jornada, curadoria de conteúdo e rituais para transformar aprendizado em projetos."],
  ["Builders e mentoras", "Apoiam decisões de produto, mercado, comunidade, pitch e execução durante o sprint."],
  ["Comunidade Solana", "Conecta referências, recursos e oportunidades para quem quer criar no ecossistema."],
];

export default function SheIsSolanaHome() {
  return (
    <main className="sis-shell">
      <header className="sis-header wrap">
        <Link className="sis-wordmark" href="/" aria-label="She Is Solana home">
          <span className="brand-icon"><Sparkles size={22} /></span>
          She Is <span>Solana</span>
        </Link>
        <nav className="sis-nav" aria-label="Navegação principal">
          <a href="#jornada">Jornada</a>
          <a href="#hackathon">Hackathon</a>
          <Link href="/roaster">Roaster</Link>
        </nav>
      </header>

      <section className="sis-hero wrap" aria-labelledby="sis-title">
        <div className="sis-hero-copy">
          <p className="sis-kicker"><span /> Programa para builders, founders e curiosas</p>
          <h1 id="sis-title" className="sis-title">She Is Solana</h1>
          <p className="sis-description">
            Uma jornada para mulheres e aliadas entrarem no ecossistema Solana, entenderem onde estão as oportunidades e transformarem ideias em projetos fortes o bastante para competir.
          </p>
          <div className="sis-actions">
            <Link className="sis-button" href="/roaster">Testar minha ideia <ArrowRight size={18} /></Link>
            <a className="sis-button secondary" href="#jornada">Ver a jornada</a>
          </div>
        </div>
        <div className="sis-program-card" aria-label="Resumo do programa">
          <div className="sis-card-top"><span>Jornada She Is Solana</span><strong>2026</strong></div>
          <h2>Da primeira hipótese ao pitch de hackathon.</h2>
          <p>Contexto, ideação, validação, produto, narrativa e go-to-market para quem quer construir algo real na Solana.</p>
          <div className="sis-card-tags"><span>Onchain</span><span>Founders</span><span>GTM</span></div>
        </div>
      </section>

      <section className="sis-section sis-about wrap" aria-labelledby="sobre-title">
        <div className="sis-section-header">
          <span className="mono">O QUE É</span>
          <h2 id="sobre-title">Um ponto de entrada para criar com confiança.</h2>
        </div>
        <div className="sis-grid two">
          <article className="sis-panel lavender">
            <Hexagon size={24} />
            <h3>She Is Solana</h3>
            <p>É uma iniciativa de educação, comunidade e prática para aproximar mais mulheres do ecossistema Solana — com foco em criar, validar e apresentar projetos, não só assistir aulas.</p>
          </article>
          <article className="sis-panel blue">
            <Users size={24} />
            <h3>Para quem é</h3>
            <p>Para founders, devs, designers, marketers, PMs e pessoas curiosas que querem entrar em Web3 com uma ideia, um time ou vontade de colaborar em um projeto.</p>
          </article>
        </div>
      </section>

      <section className="sis-section wrap" id="jornada" aria-labelledby="jornada-title">
        <div className="sis-section-header wide">
          <span className="mono">A JORNADA SHE IS SOLANA</span>
          <h2 id="jornada-title">Aprender o ecossistema, escolher um problema e chegar pronta para construir.</h2>
        </div>
        <div className="sis-timeline">
          {journey.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sis-section wrap" aria-labelledby="organiza-title">
        <div className="sis-section-header">
          <span className="mono">QUEM ORGANIZA</span>
          <h2 id="organiza-title">Uma jornada criada pela Carol Labs com a comunidade.</h2>
        </div>
        <div className="sis-grid three">
          {organizers.map(([title, text]) => (
            <article className="sis-panel" key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sis-section sis-hackathon wrap" id="hackathon" aria-labelledby="hackathon-title">
        <div className="sis-hackathon-main">
          <span className="mono">AGORA: COLOSSEUM</span>
          <h2 id="hackathon-title">Estamos organizando a entrada para o Crypto World’s Fair.</h2>
          <p>
            A Colosseum trata seus hackathons como competições globais online para founders: quatro semanas para transformar uma hipótese em produto, narrativa, tração inicial e submissão clara. A edição ativa é o Crypto World’s Fair, de 14 de setembro a 12 de outubro de 2026.
          </p>
          <div className="sis-hackathon-links">
            <a href="https://colosseum.com/hackathon" target="_blank" rel="noreferrer">Página oficial da Colosseum <ArrowRight size={16} /></a>
          </div>
        </div>
        <aside className="sis-hackathon-card" aria-label="Datas do hackathon">
          <CalendarDays size={25} />
          <strong>14 set → 12 out</strong>
          <span>Crypto World’s Fair 2026</span>
          <p>Antes de construir, valide se a ideia tem problema real, público inicial, diferencial e caminho de distribuição.</p>
        </aside>
      </section>

      <section className="sis-roaster-cta wrap" aria-labelledby="roaster-title">
        <div>
          <span className="mono">FERRAMENTA DA JORNADA</span>
          <h2 id="roaster-title">Passe sua ideia pelo roaster antes de entrar na arena.</h2>
          <p>O roaster usa KillMyIdea para encontrar furos, depois Hivemind para dar uma forma melhor ao projeto e criar um plano de go-to-market para o hackathon.</p>
        </div>
        <Link className="sis-button" href="/roaster"><Flame size={18} /> Abrir o roaster</Link>
      </section>

      <footer className="sis-footer wrap">
        <span>She Is Solana · Jornada para builders</span>
        <Link href="/roaster">Testar uma ideia <ArrowRight size={14} /></Link>
      </footer>
    </main>
  );
}
