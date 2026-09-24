import Link from "next/link";
import { ArrowRight, CalendarDays, Flame, GraduationCap, Handshake, Hexagon, Sparkles, Target, Users, Zap } from "lucide-react";

type Card = [string, string, string];
type SimpleCard = [string, string];

type LandingCopy = {
  lang: "pt-BR" | "en";
  homePath: string;
  alternatePath: string;
  alternateLabel: string;
  nav: { journey: string; hackathon: string; roaster: string; support: string };
  aria: { home: string; nav: string; program: string; hackathonDates: string };
  hero: { kicker: string; title: string; description: string; primary: string; secondary: string };
  program: { label: string; year: string; title: string; body: string; tags: string[] };
  about: { label: string; title: string; cards: Card[] };
  features: { label: string; title: string; cards: Card[] };
  journey: { label: string; title: string; items: Card[] };
  organizers: { label: string; title: string; cards: SimpleCard[]; note: string; link: string };
  hackathon: { label: string; title: string; body: string; official: string; date: string; edition: string; cardText: string };
  roaster: { label: string; title: string; body: string; cta: string };
  footer: { text: string; cta: string };
};

export const landingCopy: Record<"pt" | "en", LandingCopy> = {
  pt: {
    lang: "pt-BR",
    homePath: "/",
    alternatePath: "/en",
    alternateLabel: "EN",
    nav: { journey: "Jornada", hackathon: "Hackathon", roaster: "Roaster", support: "Apoio" },
    aria: { home: "Página inicial da She Is Solana", nav: "Navegação principal", program: "Resumo do programa", hackathonDates: "Datas do hackathon" },
    hero: {
      kicker: "Educação gratuita · comunidade · prática onchain",
      title: "She Is Solana",
      description: "Uma iniciativa educacional e comunitária para formação e inclusão de mulheres no ecossistema Web3 e na tecnologia blockchain da rede Solana, desenvolvida no Brasil pela Carol Labs em parceria com a Superteam Brasil.",
      primary: "Testar minha ideia",
      secondary: "Ver a jornada",
    },
    program: {
      label: "Jornada She Is Solana",
      year: "2026",
      title: "Da primeira aula ao pitch de hackathon.",
      body: "Meetups online e presenciais, workshops e mentorias técnicas para conectar mulheres desenvolvedoras, criadoras e entusiastas do mercado cripto.",
      tags: ["Carol Labs", "Superteam Brasil", "Solana"],
    },
    about: {
      label: "O QUE É",
      title: "Um ponto de entrada para aprender, construir e pertencer.",
      cards: [
        ["She Is Solana", "Formação e inclusão", "Uma jornada criada para aproximar mulheres da Web3 com conteúdo, comunidade e prática em Solana — do vocabulário básico à construção de produtos."],
        ["Para quem é", "Builders, criadoras e curiosas", "Para desenvolvedoras, founders, designers, marketers, PMs e entusiastas que querem entender o ecossistema e colaborar em projetos reais."],
      ],
    },
    features: {
      label: "PRINCIPAIS CARACTERÍSTICAS",
      title: "Aprender de graça, se conectar e colocar a mão na massa.",
      cards: [
        ["Educação gratuita", "Aulas introdutórias e avançadas", "Conteúdos para entender Solana, Web3 e como criar aplicações descentralizadas com mais confiança."],
        ["Comunidade e conexão", "Meetups, networking e mentoria", "Encontros online e presenciais em cidades brasileiras para fortalecer carreiras, repertório técnico e colaboração."],
        ["Foco em prática", "Produtos antes de teoria infinita", "A jornada incentiva participantes a saírem da ideia, testarem hipóteses e criarem projetos aproveitando rapidez e baixas taxas da Solana."],
      ],
    },
    journey: {
      label: "A JORNADA SHE IS SOLANA",
      title: "Do primeiro contato com Solana ao projeto pronto para competir.",
      items: [
        ["01", "Entender o ecossistema", "Web3, Solana, oportunidades de mercado, linguagem de builders e como uma ideia vira uma startup onchain."],
        ["02", "Encontrar uma ideia", "Mapear problemas reais, escolher um público inicial e transformar curiosidade em hipótese clara para hackathon."],
        ["03", "Testar antes de codar", "Usar o roaster para receber feedback brutal, melhorar a proposta com Hivemind e sair com um plano de go-to-market."],
        ["04", "Entrar na arena", "Chegar na Colosseum com narrativa, MVP, pitch, validação inicial e próximos passos para competir com seriedade."],
      ],
    },
    organizers: {
      label: "QUEM ORGANIZA",
      title: "Carol Labs com apoio da Superteam Brasil.",
      cards: [
        ["Carol Labs", "Desenha a jornada, curadoria de conteúdo e rituais para transformar aprendizado em projetos."],
        ["Superteam Brasil", "Apoia a iniciativa com ecossistema, comunidade, recursos e conexão com builders da rede Solana no Brasil."],
        ["Mentoras e comunidade", "Apoiam decisões de produto, mercado, carreira, pitch e execução durante o sprint."],
      ],
      note: "A paleta de apoio usa referências da marca Superteam Brasil: verde esmeralda, amarelo e off-white.",
      link: "Ver marca Superteam Brasil",
    },
    hackathon: {
      label: "AGORA: COLOSSEUM",
      title: "Estamos organizando a entrada para o Crypto World’s Fair.",
      body: "A Colosseum trata seus hackathons como competições globais online para founders: quatro semanas para transformar uma hipótese em produto, narrativa, tração inicial e submissão clara. A edição ativa é o Crypto World’s Fair, de 14 de setembro a 12 de outubro de 2026.",
      official: "Página oficial da Colosseum",
      date: "14 set → 12 out",
      edition: "Crypto World’s Fair 2026",
      cardText: "Antes de construir, valide se a ideia tem problema real, público inicial, diferencial e caminho de distribuição.",
    },
    roaster: {
      label: "FERRAMENTA DA JORNADA",
      title: "Passe sua ideia pelo roaster antes de entrar na arena.",
      body: "O roaster usa KillMyIdea para encontrar furos, depois Hivemind para dar uma forma melhor ao projeto e criar um plano de go-to-market para o hackathon.",
      cta: "Abrir o roaster",
    },
    footer: { text: "She Is Solana · Jornada para builders", cta: "Testar uma ideia" },
  },
  en: {
    lang: "en",
    homePath: "/en",
    alternatePath: "/",
    alternateLabel: "PT",
    nav: { journey: "Journey", hackathon: "Hackathon", roaster: "Roaster", support: "Support" },
    aria: { home: "She Is Solana home", nav: "Main navigation", program: "Program summary", hackathonDates: "Hackathon dates" },
    hero: {
      kicker: "Free education · community · onchain practice",
      title: "She Is Solana",
      description: "An educational and community initiative for the training and inclusion of women in Web3 and the Solana blockchain ecosystem, developed in Brazil by Carol Labs in partnership with Superteam Brazil.",
      primary: "Test my idea",
      secondary: "See the journey",
    },
    program: {
      label: "She Is Solana Journey",
      year: "2026",
      title: "From first class to hackathon pitch.",
      body: "Online and in-person meetups, workshops, and technical mentorship connecting women developers, creators, and crypto-curious builders.",
      tags: ["Carol Labs", "Superteam Brazil", "Solana"],
    },
    about: {
      label: "WHAT IT IS",
      title: "An entry point to learn, build, and belong.",
      cards: [
        ["She Is Solana", "Training and inclusion", "A journey designed to bring more women into Web3 through content, community, and hands-on Solana practice — from basic vocabulary to product building."],
        ["Who it is for", "Builders, creators, and curious people", "For developers, founders, designers, marketers, PMs, and enthusiasts who want to understand the ecosystem and collaborate on real projects."],
      ],
    },
    features: {
      label: "KEY PROGRAM FEATURES",
      title: "Learn for free, connect with people, and build in public.",
      cards: [
        ["Free education", "Introductory and advanced classes", "Content to understand Solana, Web3, and how to create decentralized applications with more confidence."],
        ["Community and connection", "Meetups, networking, and mentorship", "Online and in-person events in Brazilian cities to strengthen careers, technical confidence, and collaboration."],
        ["Practice first", "Products over endless theory", "The journey encourages participants to move from idea to hypothesis testing and product building, using Solana’s speed and low fees."],
      ],
    },
    journey: {
      label: "THE SHE IS SOLANA JOURNEY",
      title: "From first contact with Solana to a project ready to compete.",
      items: [
        ["01", "Understand the ecosystem", "Web3, Solana, market opportunities, builder language, and how an idea can become an onchain startup."],
        ["02", "Find an idea", "Map real problems, choose an initial audience, and turn curiosity into a clear hackathon hypothesis."],
        ["03", "Test before coding", "Use the roaster for direct feedback, improve the concept with Hivemind, and leave with a go-to-market plan."],
        ["04", "Enter the arena", "Arrive at Colosseum with a story, MVP, pitch, early validation, and next steps to compete seriously."],
      ],
    },
    organizers: {
      label: "WHO ORGANIZES IT",
      title: "Carol Labs with support from Superteam Brazil.",
      cards: [
        ["Carol Labs", "Designs the journey, content curation, and rituals that turn learning into projects."],
        ["Superteam Brazil", "Supports the initiative with ecosystem reach, community, resources, and connection to Solana builders in Brazil."],
        ["Mentors and community", "Support product, market, career, pitch, and execution decisions throughout the sprint."],
      ],
      note: "The support palette references Superteam Brazil’s brand: emerald green, yellow, and off-white.",
      link: "See Superteam Brazil brand",
    },
    hackathon: {
      label: "NOW: COLOSSEUM",
      title: "We are organizing the path into Crypto World’s Fair.",
      body: "Colosseum frames its hackathons as global online competitions for founders: four weeks to turn a hypothesis into a product, narrative, early traction, and a clear submission. The active edition is Crypto World’s Fair, from September 14 to October 12, 2026.",
      official: "Official Colosseum page",
      date: "Sep 14 → Oct 12",
      edition: "Crypto World’s Fair 2026",
      cardText: "Before building, validate whether the idea has a real problem, initial audience, differentiation, and distribution path.",
    },
    roaster: {
      label: "JOURNEY TOOL",
      title: "Run your idea through the roaster before entering the arena.",
      body: "The roaster uses KillMyIdea to find gaps, then Hivemind to reshape the project and create a go-to-market plan for the hackathon.",
      cta: "Open the roaster",
    },
    footer: { text: "She Is Solana · Builder journey", cta: "Test an idea" },
  },
};

const featureIcons = [GraduationCap, Handshake, Zap];
const aboutIcons = [Hexagon, Users];

export default function SheIsSolanaLanding({ copy }: { copy: LandingCopy }) {
  return (
    <main className="sis-shell" lang={copy.lang}>
      <header className="sis-header wrap">
        <Link className="sis-wordmark" href={copy.homePath} aria-label={copy.aria.home}>
          <span className="brand-icon"><Sparkles size={22} /></span>
          She Is <span>Solana</span>
        </Link>
        <nav className="sis-nav" aria-label={copy.aria.nav}>
          <a href="#jornada">{copy.nav.journey}</a>
          <a href="#hackathon">{copy.nav.hackathon}</a>
          <a href="#apoio">{copy.nav.support}</a>
          <Link href="/roaster">{copy.nav.roaster}</Link>
          <Link className="sis-language" href={copy.alternatePath}>{copy.alternateLabel}</Link>
        </nav>
      </header>

      <section className="sis-hero wrap" aria-labelledby="sis-title">
        <div className="sis-hero-copy">
          <p className="sis-kicker"><span /> {copy.hero.kicker}</p>
          <h1 id="sis-title" className="sis-title">{copy.hero.title}</h1>
          <p className="sis-description">{copy.hero.description}</p>
          <div className="sis-actions">
            <Link className="sis-button" href="/roaster">{copy.hero.primary} <ArrowRight size={18} /></Link>
            <a className="sis-button secondary" href="#jornada">{copy.hero.secondary}</a>
          </div>
        </div>
        <div className="sis-program-card" aria-label={copy.aria.program}>
          <div className="sis-card-top"><span>{copy.program.label}</span><strong>{copy.program.year}</strong></div>
          <h2>{copy.program.title}</h2>
          <p>{copy.program.body}</p>
          <div className="sis-card-tags">{copy.program.tags.map((tag) => <span key={tag}>{tag}</span>)}</div>
        </div>
      </section>

      <section className="sis-section sis-about wrap" aria-labelledby="sobre-title">
        <div className="sis-section-header">
          <span className="mono">{copy.about.label}</span>
          <h2 id="sobre-title">{copy.about.title}</h2>
        </div>
        <div className="sis-grid two">
          {copy.about.cards.map(([title, eyebrow, text], index) => {
            const Icon = aboutIcons[index] || Hexagon;
            return (
              <article className={`sis-panel ${index === 0 ? "lavender" : "blue"}`} key={title}>
                <Icon size={24} />
                <span className="sis-card-eyebrow">{eyebrow}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="sis-section wrap" aria-labelledby="features-title">
        <div className="sis-section-header wide">
          <span className="mono">{copy.features.label}</span>
          <h2 id="features-title">{copy.features.title}</h2>
        </div>
        <div className="sis-grid three">
          {copy.features.cards.map(([title, eyebrow, text], index) => {
            const Icon = featureIcons[index] || Target;
            return (
              <article className={`sis-panel feature-${index + 1}`} key={title}>
                <Icon size={24} />
                <span className="sis-card-eyebrow">{eyebrow}</span>
                <h3>{title}</h3>
                <p>{text}</p>
              </article>
            );
          })}
        </div>
      </section>

      <section className="sis-section wrap" id="jornada" aria-labelledby="jornada-title">
        <div className="sis-section-header wide">
          <span className="mono">{copy.journey.label}</span>
          <h2 id="jornada-title">{copy.journey.title}</h2>
        </div>
        <div className="sis-timeline">
          {copy.journey.items.map(([number, title, text]) => (
            <article key={number}>
              <span>{number}</span>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
      </section>

      <section className="sis-section wrap" id="apoio" aria-labelledby="organiza-title">
        <div className="sis-section-header">
          <span className="mono">{copy.organizers.label}</span>
          <h2 id="organiza-title">{copy.organizers.title}</h2>
        </div>
        <div className="sis-grid three">
          {copy.organizers.cards.map(([title, text], index) => (
            <article className={`sis-panel ${index === 1 ? "superteam" : ""}`} key={title}>
              <h3>{title}</h3>
              <p>{text}</p>
            </article>
          ))}
        </div>
        <div className="sis-support-note">
          <p>{copy.organizers.note}</p>
          <a href="https://www.superteam.com.br/pt/brand" target="_blank" rel="noreferrer">{copy.organizers.link} <ArrowRight size={15} /></a>
        </div>
      </section>

      <section className="sis-section sis-hackathon wrap" id="hackathon" aria-labelledby="hackathon-title">
        <div className="sis-hackathon-main">
          <span className="mono">{copy.hackathon.label}</span>
          <h2 id="hackathon-title">{copy.hackathon.title}</h2>
          <p>{copy.hackathon.body}</p>
          <div className="sis-hackathon-links">
            <a href="https://colosseum.com/hackathon" target="_blank" rel="noreferrer">{copy.hackathon.official} <ArrowRight size={16} /></a>
          </div>
        </div>
        <aside className="sis-hackathon-card" aria-label={copy.aria.hackathonDates}>
          <CalendarDays size={25} />
          <strong>{copy.hackathon.date}</strong>
          <span>{copy.hackathon.edition}</span>
          <p>{copy.hackathon.cardText}</p>
        </aside>
      </section>

      <section className="sis-roaster-cta wrap" aria-labelledby="roaster-title">
        <div>
          <span className="mono">{copy.roaster.label}</span>
          <h2 id="roaster-title">{copy.roaster.title}</h2>
          <p>{copy.roaster.body}</p>
        </div>
        <Link className="sis-button" href="/roaster"><Flame size={18} /> {copy.roaster.cta}</Link>
      </section>

      <footer className="sis-footer wrap">
        <span>{copy.footer.text}</span>
        <Link href="/roaster">{copy.footer.cta} <ArrowRight size={14} /></Link>
      </footer>
    </main>
  );
}
