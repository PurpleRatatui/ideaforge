import Link from "next/link";
import { ArrowRight, CalendarDays, Flame, GraduationCap, Handshake, Hexagon, Sparkles, Target, Users, Zap } from "lucide-react";

type Card = [string, string, string];
type SimpleCard = [string, string];
type LinkItem = { label: string; href: string };
type PersonCard = {
  name: string;
  role: string;
  image: string;
  alt: string;
  bio: string;
  links: LinkItem[];
  featuredCta?: LinkItem;
};

type LandingCopy = {
  lang: "pt-BR" | "en";
  homePath: string;
  alternatePath: string;
  alternateLabel: string;
  nav: { journey: string; hackathon: string; mentoring: string; roaster: string };
  aria: { home: string; nav: string; program: string; hackathonDates: string };
  hero: { kicker: string; title: string; description: string; primary: string; secondary: string };
  program: { label: string; year: string; title: string; body: string; tags: string[] };
  about: { label: string; title: string; cards: Card[] };
  features: { label: string; title: string; cards: Card[] };
  journey: { label: string; title: string; items: Card[] };
  organizers: { label: string; title: string; cards: SimpleCard[]; note: string; link: string };
  mentorship: { label: string; title: string; body: string; people: PersonCard[]; event: { label: string; title: string; body: string; cta: string; href: string } };
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
    nav: { journey: "Jornada", hackathon: "Hackathon", mentoring: "Mentoria", roaster: "Roaster" },
    aria: { home: "Página inicial da She Is Solana", nav: "Navegação principal", program: "Resumo do programa", hackathonDates: "Datas do hackathon" },
    hero: {
      kicker: "Educação gratuita · comunidade · prática onchain",
      title: "She Is Solana",
      description: "Criada no Brasil pela Carol Labs com apoio da Superteam Brasil, a She Is Solana reúne aulas gratuitas, encontros e mentorias para mulheres que querem entender Web3 e construir na Solana.",
      primary: "Testar minha ideia",
      secondary: "Ver a jornada",
    },
    program: {
      label: "Jornada She Is Solana",
      year: "2026",
      title: "Da primeira aula ao pitch da Colosseum.",
      body: "Encontros online e presenciais, workshops e mentorias técnicas para tirar dúvidas, formar time e transformar uma ideia em projeto.",
      tags: ["Carol Labs", "Superteam Brasil", "Solana"],
    },
    about: {
      label: "O QUE É",
      title: "Um começo com aula, gente por perto e prática.",
      cards: [
        ["She Is Solana", "Formação e inclusão", "Um programa para sair do vocabulário básico de Web3 e chegar a uma ideia de produto em Solana."],
        ["Para quem é", "Builders, criadoras e curiosas", "Para devs, founders, designers, PMs, marketers e curiosas que querem criar ou entrar em times no hackathon."],
      ],
    },
    features: {
      label: "PRINCIPAIS CARACTERÍSTICAS",
      title: "Aula gratuita, encontro com gente construindo e projeto na mesa.",
      cards: [
        ["Educação gratuita", "Aulas introdutórias e avançadas", "Aulas para entender Solana, Web3 e como dApps são criados, do zero aos tópicos técnicos."],
        ["Comunidade e conexão", "Meetups, networking e mentoria", "Meetups online e presenciais em capitais brasileiras, com networking, carreira e troca entre mulheres da tecnologia."],
        ["Foco em prática", "Produtos antes de teoria infinita", "Cada etapa empurra a participante a escolher um problema, testar a hipótese e usar as vantagens da Solana, como velocidade e taxas baixas."],
      ],
    },
    journey: {
      label: "A JORNADA SHE IS SOLANA",
      title: "Do primeiro contato com Solana ao projeto que pode ser submetido.",
      items: [
        ["01", "Entender o ecossistema", "Web3, Solana, carteiras, dApps, oportunidades de mercado e o vocabulário que aparece em um hackathon."],
        ["02", "Encontrar uma ideia", "Escolher um problema real, uma usuária inicial e uma hipótese que caiba no tempo da competição."],
        ["03", "Testar antes de codar", "Levar a ideia ao roaster, receber feedback direto e usar Hivemind para ajustar proposta, MVP e distribuição."],
        ["04", "Entrar no hackathon", "Preparar narrativa, MVP, pitch, validação inicial e próximos passos para a submissão na Colosseum."],
      ],
    },
    organizers: {
      label: "QUEM ORGANIZA",
      title: "Carol Labs com apoio da Superteam Brasil.",
      cards: [
        ["Carol Labs", "Cuida do desenho do programa, da curadoria de conteúdo e dos encontros que transformam aula em projeto."],
        ["Superteam Brasil", "Entra com comunidade, recursos de Solana e conexão com builders que já estão criando no Brasil."],
        ["Mentoras e comunidade", "Ajudam nas decisões de produto, mercado, carreira, pitch e execução durante o sprint."],
      ],
      note: "A Superteam Brasil apoia a jornada com divulgação, recursos para participantes e conexão com a comunidade Solana local.",
      link: "Ver marca Superteam Brasil",
    },
    mentorship: {
      label: "PESSOAS E MENTORIA",
      title: "Quem organiza, orienta e abre portas.",
      body: "A jornada combina curadoria da Carol Labs, apoio da Superteam Brasil e mentoria prática para transformar curiosidade em plano de ação.",
      people: [
        {
          name: "Carol Santos · Carol Labs",
          role: "Organização da jornada",
          image: "/images/carol-labs.webp",
          alt: "Retrato de Carol Santos, da Carol Labs",
          bio: "Carol Labs conduz a curadoria da She Is Solana, articula os encontros e mantém a comunidade conectada durante a jornada.",
          links: [{ label: "Instagram da Carol", href: "https://www.instagram.com/carolsantos.labs/" }],
        },
        {
          name: "Ana Westfal",
          role: "Mentora de produto e GTM",
          image: "/images/ana-westfal.webp",
          alt: "Retrato de Ana Westfal",
          bio: "Ana trabalha na interseção de IA, blockchain e growth de produto. Mestre em Negócios Digitais pela USP, passou por Procter & Gamble, MetaMask e Uniswap. Hoje lidera estratégia e crescimento de produto na HOUS3, startup que desenvolve software sob demanda e produtos próprios em cibersegurança, processos agênticos e otimização de KYC.",
          links: [
            { label: "Site", href: "https://anawestfal.xyz" },
            { label: "X", href: "https://x.com/anawestfal" },
            { label: "Instagram", href: "https://www.instagram.com/ana.westfal/" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/ap-westfal/" },
            { label: "HOUS3", href: "https://hous3.com.br" },
          ],
          featuredCta: { label: "Agendar mentoria", href: "https://cal.com/anawestfal/sheissolana" },
        },
      ],
      event: {
        label: "PRÓXIMO ENCONTRO",
        title: "Galera do RJ",
        body: "O próximo encontro da comunidade no Rio de Janeiro já está com inscrição aberta no Luma.",
        cta: "Inscrever no Luma",
        href: "https://luma.com/gyphbsbo",
      },
    },
    hackathon: {
      label: "AGORA: COLOSSEUM",
      title: "Agora: preparação para o Crypto World’s Fair.",
      body: "Na Colosseum, o hackathon funciona como competição de startups: em quatro semanas, o time precisa mostrar produto, narrativa, sinais de demanda e uma submissão clara. A edição ativa é o Crypto World’s Fair, de 14 de setembro a 12 de outubro de 2026.",
      official: "Página oficial da Colosseum",
      date: "14 set → 12 out",
      edition: "Crypto World’s Fair 2026",
      cardText: "Antes de abrir o editor, veja se a ideia tem problema real, público inicial, diferencial e caminho de distribuição.",
    },
    roaster: {
      label: "FERRAMENTA DA JORNADA",
      title: "Use o roaster antes de entrar no hackathon.",
      body: "O roaster pressiona a ideia com KillMyIdea e usa Hivemind para ajustar a proposta, o MVP e o plano de go-to-market para o hackathon.",
      cta: "Abrir o roaster",
    },
    footer: { text: "She Is Solana · Educação, comunidade e Solana", cta: "Testar uma ideia" },
  },
  en: {
    lang: "en",
    homePath: "/en",
    alternatePath: "/",
    alternateLabel: "PT",
    nav: { journey: "Journey", hackathon: "Hackathon", mentoring: "Mentorship", roaster: "Roaster" },
    aria: { home: "She Is Solana home", nav: "Main navigation", program: "Program summary", hackathonDates: "Hackathon dates" },
    hero: {
      kicker: "Free education · community · onchain practice",
      title: "She Is Solana",
      description: "Created in Brazil by Carol Labs with support from Superteam Brazil, She Is Solana brings together free classes, meetups, and mentorship for women who want to understand Web3 and build on Solana.",
      primary: "Test my idea",
      secondary: "See the journey",
    },
    program: {
      label: "She Is Solana Journey",
      year: "2026",
      title: "From first class to a Colosseum pitch.",
      body: "Online and in-person meetups, workshops, and technical mentorship to answer questions, form teams, and turn an idea into a project.",
      tags: ["Carol Labs", "Superteam Brazil", "Solana"],
    },
    about: {
      label: "WHAT IT IS",
      title: "A starting point with classes, people, and practice.",
      cards: [
        ["She Is Solana", "Training and inclusion", "A program that takes participants from basic Web3 vocabulary to a Solana product idea."],
        ["Who it is for", "Builders, creators, and curious people", "For developers, founders, designers, PMs, marketers, and curious people who want to build or join hackathon teams."],
      ],
    },
    features: {
      label: "KEY PROGRAM FEATURES",
      title: "Free classes, builder meetups, and a project on the table.",
      cards: [
        ["Free education", "Introductory and advanced classes", "Classes on Solana, Web3, and how dApps are built, from zero to technical topics."],
        ["Community and connection", "Meetups, networking, and mentorship", "Online and in-person meetups in Brazilian capitals, with networking, career conversations, and exchange among women in tech."],
        ["Practice first", "Products over endless theory", "Each step pushes participants to choose a problem, test the hypothesis, and use Solana’s speed and low fees."],
      ],
    },
    journey: {
      label: "THE SHE IS SOLANA JOURNEY",
      title: "From first contact with Solana to a project ready to submit.",
      items: [
        ["01", "Understand the ecosystem", "Web3, Solana, wallets, dApps, market opportunities, and the vocabulary that shows up in a hackathon."],
        ["02", "Find an idea", "Choose a real problem, an initial user, and a hypothesis that fits the competition timeline."],
        ["03", "Test before coding", "Bring the idea to the roaster, get direct feedback, and use Hivemind to adjust the proposal, MVP, and distribution."],
        ["04", "Enter the hackathon", "Prepare the story, MVP, pitch, early validation, and next steps for the Colosseum submission."],
      ],
    },
    organizers: {
      label: "WHO ORGANIZES IT",
      title: "Carol Labs with support from Superteam Brazil.",
      cards: [
        ["Carol Labs", "Designs the program, curates the content, and hosts the sessions that turn classes into projects."],
        ["Superteam Brazil", "Brings community, Solana resources, and access to builders already creating in Brazil."],
        ["Mentors and community", "Help with product, market, career, pitch, and execution decisions during the sprint."],
      ],
      note: "Superteam Brazil supports the journey with outreach, participant resources, and connections to the local Solana community.",
      link: "See Superteam Brazil brand",
    },
    mentorship: {
      label: "PEOPLE AND MENTORSHIP",
      title: "The people organizing, mentoring, and opening doors.",
      body: "The journey combines Carol Labs curation, Superteam Brazil support, and practical mentorship to turn curiosity into a plan of action.",
      people: [
        {
          name: "Carol Santos · Carol Labs",
          role: "Journey organizer",
          image: "/images/carol-labs.webp",
          alt: "Portrait of Carol Santos from Carol Labs",
          bio: "Carol Labs curates She Is Solana, coordinates the meetups, and keeps the community connected throughout the journey.",
          links: [{ label: "Carol on Instagram", href: "https://www.instagram.com/carolsantos.labs/" }],
        },
        {
          name: "Ana Westfal",
          role: "Product and GTM mentor",
          image: "/images/ana-westfal.webp",
          alt: "Portrait of Ana Westfal",
          bio: "Ana works at the intersection of AI, blockchain, and product growth. She holds a master’s degree in Digital Business from USP and has worked at Procter & Gamble, MetaMask, and Uniswap. She now leads product strategy and growth at HOUS3, a startup building custom software and products in cybersecurity, agentic processes, and KYC optimization.",
          links: [
            { label: "Website", href: "https://anawestfal.xyz" },
            { label: "X", href: "https://x.com/anawestfal" },
            { label: "Instagram", href: "https://www.instagram.com/ana.westfal/" },
            { label: "LinkedIn", href: "https://www.linkedin.com/in/ap-westfal/" },
            { label: "HOUS3", href: "https://hous3.com.br" },
          ],
          featuredCta: { label: "Book mentorship", href: "https://cal.com/anawestfal/sheissolana" },
        },
      ],
      event: {
        label: "NEXT MEETUP",
        title: "Rio de Janeiro group",
        body: "The next community meetup in Rio de Janeiro is open for registration on Luma.",
        cta: "Register on Luma",
        href: "https://luma.com/gyphbsbo",
      },
    },
    hackathon: {
      label: "NOW: COLOSSEUM",
      title: "Now: getting ready for Crypto World’s Fair.",
      body: "At Colosseum, the hackathon works like a startup competition: in four weeks, each team needs to show a product, a story, demand signals, and a clear submission. The active edition is Crypto World’s Fair, from September 14 to October 12, 2026.",
      official: "Official Colosseum page",
      date: "Sep 14 → Oct 12",
      edition: "Crypto World’s Fair 2026",
      cardText: "Before opening the editor, check whether the idea has a real problem, initial audience, differentiation, and distribution path.",
    },
    roaster: {
      label: "JOURNEY TOOL",
      title: "Use the roaster before entering the hackathon.",
      body: "The roaster pressure-tests the idea with KillMyIdea and uses Hivemind to adjust the proposal, MVP, and go-to-market plan for the hackathon.",
      cta: "Open the roaster",
    },
    footer: { text: "She Is Solana · Education, community, and Solana", cta: "Test an idea" },
  },
};

const featureIcons = [GraduationCap, Handshake, Zap];
const aboutIcons = [Hexagon, Users];

export default function SheIsSolanaLanding({ copy }: { copy: LandingCopy }) {
  const roasterPath = copy.lang === "en" ? "/en/roaster" : "/roaster";
  return (
    <main className="sis-shell" lang={copy.lang}>
      <header className="sis-header wrap">
        <Link className="sis-wordmark" href={copy.homePath} aria-label={copy.aria.home}>
          <span className="brand-icon"><Sparkles size={22} /></span>
          She Is <span>Solana</span>
        </Link>
        <nav className="sis-nav" aria-label={copy.aria.nav}>
          <a href="#jornada">{copy.nav.journey}</a>
          <a href="#mentoria">{copy.nav.mentoring}</a>
          <a href="#hackathon">{copy.nav.hackathon}</a>
          <Link href={roasterPath}>{copy.nav.roaster}</Link>
          <Link className="sis-language" href={copy.alternatePath}>{copy.alternateLabel}</Link>
        </nav>
      </header>

      <section className="sis-hero wrap" aria-labelledby="sis-title">
        <div className="sis-hero-copy">
          <p className="sis-kicker"><span /> {copy.hero.kicker}</p>
          <h1 id="sis-title" className="sis-title">{copy.hero.title}</h1>
          <p className="sis-description">{copy.hero.description}</p>
          <div className="sis-actions">
            <Link className="sis-button" href={roasterPath}>{copy.hero.primary} <ArrowRight size={18} /></Link>
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

      <section className="sis-section sis-mentorship wrap" id="mentoria" aria-labelledby="mentoria-title">
        <div className="sis-section-header wide">
          <span className="mono">{copy.mentorship.label}</span>
          <h2 id="mentoria-title">{copy.mentorship.title}</h2>
        </div>
        <p className="sis-section-intro">{copy.mentorship.body}</p>
        <div className="sis-people-grid">
          {copy.mentorship.people.map((person, index) => (
            <article className={`sis-person-card ${index === 0 ? "carol" : "ana"}`} key={person.name}>
              <div className="sis-person-photo">
                <img src={person.image} alt={person.alt} />
              </div>
              <div className="sis-person-copy">
                <span className="sis-card-eyebrow">{person.role}</span>
                <h3>{person.name}</h3>
                <p>{person.bio}</p>
                <div className="sis-person-links">
                  {person.links.map((link) => (
                    <a href={link.href} target="_blank" rel="noreferrer" key={link.href}>{link.label}</a>
                  ))}
                  {person.featuredCta && (
                    <a className="sis-person-cta" href={person.featuredCta.href} target="_blank" rel="noreferrer">
                      {person.featuredCta.label} <ArrowRight size={14} />
                    </a>
                  )}
                </div>
              </div>
            </article>
          ))}
        </div>
        <aside className="sis-next-event">
          <div>
            <span className="mono">{copy.mentorship.event.label}</span>
            <h3>{copy.mentorship.event.title}</h3>
            <p>{copy.mentorship.event.body}</p>
          </div>
          <a className="sis-button secondary" href={copy.mentorship.event.href} target="_blank" rel="noreferrer">
            <CalendarDays size={18} /> {copy.mentorship.event.cta}
          </a>
        </aside>
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
        <Link className="sis-button" href={roasterPath}><Flame size={18} /> {copy.roaster.cta}</Link>
      </section>

      <footer className="sis-footer wrap">
        <span>{copy.footer.text}</span>
        <Link href={roasterPath}>{copy.footer.cta} <ArrowRight size={14} /></Link>
      </footer>
    </main>
  );
}
