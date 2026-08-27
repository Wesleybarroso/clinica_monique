/* Coastal Precision: composição editorial assimétrica, camadas de profundidade e movimento sereno. */
import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowDownRight, ArrowUpRight, Check, Clock3, Facebook, Instagram, Linkedin, Menu, MapPin, MessageCircle, Phone, Sparkles, X } from "lucide-react";
import { toast } from "sonner";
import { AIChatBox } from "@/components/AIChatBox";
import { MapView } from "@/components/Map";
import { clinicAddress, clinicCoordinates, clinicMapLink, directionsLink, uberLink } from "@/lib/location";

const heroImage = "/images/hero-clinic.jpg";
const detailImage = "/images/detail-clinic.jpg";
const spaceImage = "/images/clinic-space.jpg";
const textureImage = "/images/clinic-texture.jpg";
const markImage = "/images/monique-logo-hd.png";
const assistantAvatar = "/images/assistant-avatar.jpg";
const mapImage = "/images/clinic-map-static.jpg";
const galleryImages = [
  { src: "/images/gallery-detail.png", alt: "Registro clínico odontológico fornecido pela clínica", label: "Cuidado em detalhe" },
  { src: "/images/gallery-smile.jpg", alt: "Sorriso registrado em acompanhamento odontológico", label: "Naturalidade" },
  { src: "/images/gallery-team.jpg", alt: "Equipe e paciente em ambiente clínico", label: "Relações que cuidam" },
];

const navItems = [
  ["A clínica", "clinica"],
  ["Especialidades", "especialidades"],
  ["Experiência", "experiencia"],
  ["Contato", "contato"],
];

function Reveal({ children, delay = 0, className = "" }: { children: React.ReactNode; delay?: number; className?: string }) {
  const reduceMotion = useReducedMotion();
  return (
    <motion.div
      className={className}
      initial={reduceMotion ? false : { opacity: 0, y: 28 }}
      whileInView={reduceMotion ? undefined : { opacity: 1, y: 0 }}
      viewport={{ once: true, amount: 0.18 }}
      transition={{ duration: 0.72, delay, ease: [0.23, 1, 0.32, 1] }}
    >
      {children}
    </motion.div>
  );
}

function AppMark({ compact = false }: { compact?: boolean }) {
  return (
    <a className={`brand ${compact ? "brand--compact" : ""}`} href="#top" aria-label="Monique Cascapera, início">
      <img src={markImage} alt="Monique Cascapera — Odontologia Estética" />
    </a>
  );
}

type ChatMessage = { role: "user" | "assistant"; content: string };

function ChatWidget() {
  const [open, setOpen] = useState(false);
  const [messages, setMessages] = useState<ChatMessage[]>([
    {
      role: "assistant",
      content: "Olá! Eu sou a Clara, assistente virtual da clínica. Posso explicar nossos tratamentos e ajudar você a encontrar o próximo passo. Como posso ajudar?",
    },
  ]);
  const [isSending, setIsSending] = useState(false);

  const handleSendMessage = async (content: string) => {
    const nextMessages: ChatMessage[] = [...messages, { role: "user", content }];
    setMessages(nextMessages);
    setIsSending(true);

    try {
      const response = await fetch("/api/chat", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ messages: nextMessages }),
      });
      const payload = (await response.json()) as { content?: string; error?: string };
      if (!response.ok || !payload.content) throw new Error(payload.error || "Assistant unavailable");
      setMessages((current) => [...current, { role: "assistant", content: payload.content! }]);
    } catch {
      setMessages((current) => [
        ...current,
        { role: "assistant", content: "Desculpe, tive uma instabilidade agora. Você pode tentar novamente ou falar diretamente com a equipe pelo formulário de contato." },
      ]);
      toast.error("Não foi possível responder agora", { description: "Tente novamente em instantes." });
    } finally {
      setIsSending(false);
    }
  };

  return (
    <>
      {open && (
        <section className="chat-popover" role="dialog" aria-label="Assistente virtual Clara">
          <header className="chat-header">
            <div className="chat-profile">
              <img src={assistantAvatar} alt="Clara, assistente virtual" />
              <div><strong>Clara</strong><span><i /> Assistente virtual</span></div>
            </div>
            <button className="chat-close" type="button" onClick={() => setOpen(false)} aria-label="Fechar assistente"><X size={18} /></button>
          </header>
          <AIChatBox
            messages={messages}
            onSendMessage={handleSendMessage}
            isLoading={isSending}
            placeholder="Digite sua dúvida..."
            height="420px"
            className="clinic-ai-chat"
            emptyStateMessage="Estou aqui para ajudar você."
            suggestedPrompts={["Quais tratamentos vocês fazem?", "Quero agendar uma avaliação", "Onde fica a clínica?"]}
          />
        </section>
      )}
      <button className={`chat-launcher ${open ? "is-open" : ""}`} type="button" onClick={() => setOpen((current) => !current)} aria-expanded={open} aria-label={open ? "Fechar assistente virtual" : "Abrir assistente virtual"}>
        {open ? <X size={22} /> : <><span className="chat-launcher-avatar"><img src={assistantAvatar} alt="" aria-hidden="true" /></span><span className="chat-launcher-label">Fale com a Clara</span><MessageCircle size={18} /></>}
      </button>
    </>
  );
}

export default function Home() {
  const [menuOpen, setMenuOpen] = useState(false);
  const [scrolled, setScrolled] = useState(false);
  const [submitted, setSubmitted] = useState(false);
  const { scrollYProgress } = useScroll();
  const reduceMotion = useReducedMotion();
  const heroX = useTransform(scrollYProgress, [0, 0.5], [0, reduceMotion ? 0 : -110]);
  const heroY = useTransform(scrollYProgress, [0, 0.45], [0, reduceMotion ? 0 : 70]);
  const sideX = useTransform(scrollYProgress, [0, 0.7], [0, reduceMotion ? 0 : -42]);

  useEffect(() => {
    const onScroll = () => setScrolled(window.scrollY > 24);
    window.addEventListener("scroll", onScroll, { passive: true });
    onScroll();
    return () => window.removeEventListener("scroll", onScroll);
  }, []);

  const handleSubmit = (event: React.FormEvent<HTMLFormElement>) => {
    event.preventDefault();
    setSubmitted(true);
    toast.success("Recebemos seu contato", { description: "Nossa equipe retorna em breve para combinar o melhor horário." });
  };

  return (
    <div id="top" className="site-shell">
      <motion.div className="scroll-progress" style={{ scaleX: scrollYProgress }} aria-hidden="true" />
      <header className={`site-header ${scrolled ? "is-scrolled" : ""}`}>
        <div className="header-inner">
          <AppMark compact />
          <nav className={`main-nav ${menuOpen ? "is-open" : ""}`} aria-label="Navegação principal">
            {navItems.map(([label, href]) => <a key={href} href={`#${href}`} onClick={() => setMenuOpen(false)}>{label}</a>)}
            <a className="nav-cta" href="#contato" onClick={() => setMenuOpen(false)}>Agendar conversa <ArrowUpRight size={15} /></a>
          </nav>
          <button className="menu-toggle" aria-label={menuOpen ? "Fechar menu" : "Abrir menu"} onClick={() => setMenuOpen(!menuOpen)}>{menuOpen ? <X /> : <Menu />}</button>
        </div>
      </header>

      <main>
        <section className="hero-section" aria-labelledby="hero-title">
          <div className="hero-texture" style={{ backgroundImage: `url(${textureImage})` }} aria-hidden="true" />
          <div className="hero-orbit orbit-one" aria-hidden="true" />
          <div className="hero-orbit orbit-two" aria-hidden="true" />
          <div className="hero-grid container">
            <Reveal className="hero-copy">
              <p className="eyebrow"><span /> Cuidado humanizado, olhar preciso</p>
              <h1 id="hero-title">Precisão para cuidar.<br /><em>Tempo para você.</em></h1>
              <p className="hero-lede">Odontologia humanizada e estética do sorriso no Tatuapé, com tecnologia, escuta atenta e escolhas que respeitam a sua individualidade.</p>
              <div className="hero-actions">
                <a className="button button--primary" href="#contato">Encontrar meu horário <ArrowUpRight size={18} /></a>
                <a className="text-link" href="#experiencia">Conhecer a clínica <ArrowDownRight size={15} aria-hidden="true" /></a>
              </div>
              <div className="hero-proof"><div className="proof-line" /><span>CRO-SP 96616<br />Tatuapé · São Paulo</span></div>
            </Reveal>
            <motion.div className="hero-visual" style={{ x: heroX, y: heroY }}>
              <div className="hero-image-wrap"><img src={heroImage} alt="Paciente sorrindo em uma clínica odontológica iluminada" /></div>
              <div className="hero-note"><Sparkles size={16} /><span>Leveza em cada<br /><strong>detalhe</strong></span></div>
              <div className="hero-stamp"><span>H</span><small>desde<br />2012</small></div>
            </motion.div>
          </div>
          <div className="hero-bottom container"><span>01 — 04</span><div className="hero-scroll-line"><i /></div><span>deslize para explorar</span></div>
        </section>

        <section id="clinica" className="intro-section container section-pad">
          <Reveal className="section-kicker"><span>01</span><span className="kicker-rule" /><span>A clínica</span></Reveal>
          <div className="intro-grid">
            <Reveal className="intro-title"><h2>Um cuidado que<br /><em>começa antes</em><br />do consultório.</h2></Reveal>
            <Reveal delay={0.1} className="intro-body"><p>Na Horizonte, o tratamento é uma conversa contínua. A gente entende sua rotina, explica cada escolha e constrói um plano que faça sentido para a sua vida.</p><a className="text-link" href="#experiencia">Nossa maneira de cuidar <ArrowDownRight size={15} aria-hidden="true" /></a></Reveal>
          </div>
          <motion.div className="side-label" style={{ x: sideX }}>HORIZONTE / CUIDADO CONTEMPORÂNEO</motion.div>
        </section>

        <section id="especialidades" className="specialties-section section-pad">
          <div className="container">
            <Reveal className="section-heading"><div><p className="eyebrow"><span /> O que fazemos</p><h2>Precisão técnica.<br /><em>Olhar humano.</em></h2></div><p className="heading-aside">Tratamentos pensados para acompanhar você com clareza, conforto e resultados que fazem parte da sua história.</p></Reveal>
            <div className="specialty-list">
              {[["01", "Clínica geral", "Prevenção, saúde e acompanhamento para o seu sorriso permanecer bem."], ["02", "Estética dental", "Pequenas mudanças, planejadas com cuidado, para revelar a sua melhor versão."], ["03", "Implantes", "Tecnologia e precisão para devolver função, segurança e naturalidade."], ["04", "Ortodontia", "Movimento planejado para alinhar seu sorriso com o seu tempo de vida."]].map(([number, title, text], index) => (
                <Reveal key={number} delay={index * 0.06} className="specialty-row"><span className="specialty-number">{number}</span><h3>{title}</h3><p>{text}</p><ArrowUpRight className="specialty-arrow" size={20} /></Reveal>
              ))}
            </div>
          </div>
        </section>

        <section id="experiencia" className="experience-section container section-pad">
          <Reveal className="experience-image"><img src={detailImage} alt="Instrumentos odontológicos organizados com precisão" /><div className="image-caption">Detalhes que fazem diferença <ArrowUpRight size={15} aria-hidden="true" /></div></Reveal>
          <Reveal delay={0.12} className="experience-copy"><p className="eyebrow"><span /> A experiência Horizonte</p><h2>Você não precisa<br />ter pressa para<br /><em>se sentir bem.</em></h2><p>Da primeira mensagem ao retorno para casa, cada ponto de contato foi desenhado para ser simples, acolhedor e transparente.</p><div className="experience-stats"><div><strong>12</strong><span>anos de<br />experiência</span></div><div><strong>1:1</strong><span>plano feito<br />para você</span></div></div></Reveal>
        </section>

        <section className="space-section">
          <motion.div className="space-image" style={{ x: heroX }}><img src={spaceImage} alt="Sala de espera contemporânea e acolhedora" /></motion.div>
          <div className="space-overlay container"><Reveal><p className="eyebrow eyebrow--light"><span /> Um espaço para respirar</p><h2>Conforto também<br /><em>é parte do cuidado.</em></h2><a className="button button--light" href="#contato">Conhecer de perto <ArrowUpRight size={18} /></a></Reveal></div>
        </section>

        <section className="gallery-section section-pad" aria-labelledby="gallery-title">
          <div className="container"><Reveal className="gallery-heading"><div><p className="eyebrow"><span /> Registros da clínica</p><h2 id="gallery-title">Cuidado que<br /><em>se reconhece.</em></h2></div><p>Uma seleção de imagens fornecidas pela clínica para mostrar pessoas, detalhes e momentos que fazem parte do atendimento.</p></Reveal><div className="gallery-grid">{galleryImages.map((image, index) => <Reveal key={image.src} delay={index * 0.08} className={`gallery-card gallery-card--${index + 1}`}><img src={image.src} alt={image.alt} /><span>{image.label} <ArrowUpRight className="gallery-arrow" size={17} aria-hidden="true" /></span></Reveal>)}</div></div>
        </section>

        <section id="contato" className="contact-section section-pad">
          <div className="container contact-grid">
            <Reveal className="contact-copy"><p className="eyebrow"><span /> Vamos conversar</p><h2>Conte o que<br /><em>você precisa.</em></h2><p>A gente cuida do próximo passo com calma. Preencha o formulário e nossa equipe entra em contato para encontrar um horário possível para você.</p><div className="contact-details"><a href="tel:+551130000000"><Phone size={17} /> (11) 99999-9999</a><span><Clock3 size={17} /> Seg–Sex, 8h–18h</span><span><MapPin size={17} /> Tatuapé / Vila Gomes Cardim, São Paulo</span></div></Reveal>
            <Reveal delay={0.12} className="contact-card"><div className="card-topline"><span>Primeiro contato</span><span>01 / 02</span></div>{submitted ? <div className="success-state"><div className="success-icon"><Check /></div><h3>Mensagem recebida.</h3><p>Em breve, nossa equipe vai falar com você para continuar a conversa.</p><button className="text-link" onClick={() => setSubmitted(false)}>Enviar outra mensagem <ArrowDownRight size={15} aria-hidden="true" /></button></div> : <form onSubmit={handleSubmit}><label>Seu nome<input required name="name" placeholder="Como podemos chamar você?" /></label><label>Seu melhor contato<input required name="contact" placeholder="E-mail ou telefone" /></label><label>Como podemos ajudar? <textarea required name="message" placeholder="Conte um pouco sobre o que você procura..." rows={3} /></label><button className="button button--primary button--wide" type="submit">Enviar mensagem <ArrowUpRight size={18} /></button><small>Seus dados são usados apenas para este contato.</small></form>}</Reveal>
          </div>
        </section>
      </main>

      <ChatWidget />
      <footer className="site-footer">
        <div className="container footer-location">
          <div className="footer-location-copy">
            <p className="eyebrow eyebrow--light"><span /> Onde estamos</p>
            <h2>Seu cuidado,<br /><em>mais perto.</em></h2>
            <p className="footer-address"><MapPin size={18} /> <span>{clinicAddress}</span></p>
            <p className="footer-location-note">Atendimento no Tatuapé, em Vila Gomes Cardim. Abra a rota pelo Google Maps ou peça um Uber direto para o endereço da clínica.</p>
            <div className="location-actions">
              <a className="button button--light" href={directionsLink} target="_blank" rel="noreferrer"><MapPin size={17} /> Como chegar <ArrowUpRight size={17} /></a>
              <a className="button button--uber" href={uberLink} target="_blank" rel="noreferrer"><span className="uber-mark">U</span> Abrir no Uber <ArrowUpRight size={17} /></a>
            </div>
            <a className="location-text-link" href={clinicMapLink} target="_blank" rel="noreferrer">Ver local completo no Google Maps <ArrowUpRight size={15} /></a>
          </div>
          <div className="footer-map-wrap">
            <div className="footer-map-fallback" style={{ backgroundImage: `url(${mapImage})` }} aria-hidden="true" />
            <MapView
              className="footer-map footer-map--interactive"
              initialCenter={clinicCoordinates}
              initialZoom={16}
              onMapReady={(map) => {
                if (window.google?.maps?.marker?.AdvancedMarkerElement) {
                  new window.google.maps.marker.AdvancedMarkerElement({
                    map,
                    position: clinicCoordinates,
                    title: "Dra. Monique Cascapera — Tatuapé",
                  });
                }
              }}
            />
            <div className="map-label"><MapPin size={15} /> Dra. Monique Cascapera <span>Tatuapé · SP</span></div>
          </div>
        </div>
        <div className="container footer-inner"><AppMark /><p>Odontologia humanizada,<br />precisa e próxima.</p><div className="footer-social"><span>Siga a clínica</span><div><a href="https://www.instagram.com/dramoniquecascapera" target="_blank" rel="noreferrer" aria-label="Instagram da Dra. Monique Cascapera"><Instagram size={17} /></a><a href="https://www.facebook.com/dramoniquecascapera" target="_blank" rel="noreferrer" aria-label="Facebook da Dra. Monique Cascapera"><Facebook size={17} /></a><a href="https://www.linkedin.com/in/dramoniquecascapera" target="_blank" rel="noreferrer" aria-label="LinkedIn da Dra. Monique Cascapera"><Linkedin size={17} /></a></div></div><div className="footer-meta"><span>© 2026 Dra. Monique Cascapera</span><a href="#top">Voltar ao topo <ArrowUpRight size={14} aria-hidden="true" /></a></div></div></footer>
    </div>
  );
}
