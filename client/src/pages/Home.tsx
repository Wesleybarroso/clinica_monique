/* Coastal Precision: composição editorial assimétrica, camadas de profundidade e movimento sereno. */
import { useEffect, useState } from "react";
import { motion, useReducedMotion, useScroll, useTransform } from "framer-motion";
import { ArrowUpRight, Check, Clock3, Menu, MapPin, Phone, Sparkles, X } from "lucide-react";
import { toast } from "sonner";

const heroImage = "/manus-storage/AHRPTWnU3u5EoX5o0bG1VWGwz0WLAucR1EKgwdle0FKS9Q0TRG2U52VQvVi8RIw09y_2i5gD9w6ZIy1nzM8uHSaUae5bdMidjro8W8Oyt_8-rZyZN8yQUDqdIgsPkVXJfv2b0U6EBUKZw1440-h1440-k-no_17f77245.jpg";
const detailImage = "/manus-storage/AHRPTWlTFlEJIJMmfhM5ynbU0e2itdAFOw1_ItuSDCsZjkPWlHHX6mIOdvNEh1IXrrbpTghEPf8xuqtDeb4H24BKURGKw1DZZBPk9NVaI4cmbGsuEAKzP4uxcZb-WbhJsjxTlUf68KYT0Qw2048-h2048-k-no_c0fe82a7.png";
const spaceImage = "/manus-storage/clinic-space_7a07c87e.jpg";
const textureImage = "/manus-storage/clinic-texture_03c9bc52.png";
const markImage = "/manus-storage/clinic-mark_9438e71f.png";
const galleryImages = [
  { src: "/manus-storage/AHRPTWmBWuxJIydhLhJuxjlOjgXmWlReJTvUnwFSfn0gOngNZrPBH5MQ5lnpqdEI0JyJdUxV8QzAHPxhkLahV5bq6mvn_O1eY3Z2Czw9qgBZMcxVVM0o8nseyKHf0aeFqZoxtxIpUOCKw904-h904-k-no_1e4fd976.png", alt: "Registro clínico odontológico fornecido pela clínica", label: "Cuidado em detalhe" },
  { src: "/manus-storage/AHRPTWnO4e_tFqgzVxZICgH1t6-XI0EYFCa9KlpBvu_h45m4PDcW-g8frWXH-I8viYfscfDimEQJLJxAbG42ruiSvI06hZQOYxaQEETKEAT4HykXAnm6bf2ZO1P18EPcpXFSREU1Ultqw1818-h1818-k-no-Copia(2)_d8bd95e5.jpg", alt: "Sorriso registrado em acompanhamento odontológico", label: "Naturalidade" },
  { src: "/manus-storage/AHRPTWmS1wck727IB2E0YkePFwIqd9vuj37es6ZakWzip5CZ0_OJzVyQNPc65fnpwaPsLFjxApG4UviBySbChE1OaB3DzKPr7pJnp2dje23W3MUdqHgNTzNCiks0YXUQwLJJC2MrrWzRUQw1818-h1818-k-no-Copia(2)_81930604.png", alt: "Equipe e paciente em ambiente clínico", label: "Relações que cuidam" },
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
    <a className={`brand ${compact ? "brand--compact" : ""}`} href="#top" aria-label="Dra. Monique Cascapera, início">
      <img src={markImage} alt="" aria-hidden="true" />
      <span><strong>dra. monique</strong><small>odontologia humanizada</small></span>
    </a>
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
                <a className="text-link" href="#experiencia">Conhecer a clínica <span>↘</span></a>
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
            <Reveal delay={0.1} className="intro-body"><p>Na Horizonte, o tratamento é uma conversa contínua. A gente entende sua rotina, explica cada escolha e constrói um plano que faça sentido para a sua vida.</p><a className="text-link" href="#experiencia">Nossa maneira de cuidar <span>↘</span></a></Reveal>
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
          <Reveal className="experience-image"><img src={detailImage} alt="Instrumentos odontológicos organizados com precisão" /><div className="image-caption">Detalhes que fazem diferença <span>↗</span></div></Reveal>
          <Reveal delay={0.12} className="experience-copy"><p className="eyebrow"><span /> A experiência Horizonte</p><h2>Você não precisa<br />ter pressa para<br /><em>se sentir bem.</em></h2><p>Da primeira mensagem ao retorno para casa, cada ponto de contato foi desenhado para ser simples, acolhedor e transparente.</p><div className="experience-stats"><div><strong>12</strong><span>anos de<br />experiência</span></div><div><strong>1:1</strong><span>plano feito<br />para você</span></div></div></Reveal>
        </section>

        <section className="space-section">
          <motion.div className="space-image" style={{ x: heroX }}><img src={spaceImage} alt="Sala de espera contemporânea e acolhedora" /></motion.div>
          <div className="space-overlay container"><Reveal><p className="eyebrow eyebrow--light"><span /> Um espaço para respirar</p><h2>Conforto também<br /><em>é parte do cuidado.</em></h2><a className="button button--light" href="#contato">Conhecer de perto <ArrowUpRight size={18} /></a></Reveal></div>
        </section>

        <section className="gallery-section section-pad" aria-labelledby="gallery-title">
          <div className="container"><Reveal className="gallery-heading"><div><p className="eyebrow"><span /> Registros da clínica</p><h2 id="gallery-title">Cuidado que<br /><em>se reconhece.</em></h2></div><p>Uma seleção de imagens fornecidas pela clínica para mostrar pessoas, detalhes e momentos que fazem parte do atendimento.</p></Reveal><div className="gallery-grid">{galleryImages.map((image, index) => <Reveal key={image.src} delay={index * 0.08} className={`gallery-card gallery-card--${index + 1}`}><img src={image.src} alt={image.alt} /><span>{image.label} <b>↗</b></span></Reveal>)}</div></div>
        </section>

        <section id="contato" className="contact-section section-pad">
          <div className="container contact-grid">
            <Reveal className="contact-copy"><p className="eyebrow"><span /> Vamos conversar</p><h2>Conte o que<br /><em>você precisa.</em></h2><p>A gente cuida do próximo passo com calma. Preencha o formulário e nossa equipe entra em contato para encontrar um horário possível para você.</p><div className="contact-details"><a href="tel:+551130000000"><Phone size={17} /> (11) 99999-9999</a><span><Clock3 size={17} /> Seg–Sex, 8h–18h</span><span><MapPin size={17} /> Tatuapé / Vila Gomes Cardim, São Paulo</span></div></Reveal>
            <Reveal delay={0.12} className="contact-card"><div className="card-topline"><span>Primeiro contato</span><span>01 / 02</span></div>{submitted ? <div className="success-state"><div className="success-icon"><Check /></div><h3>Mensagem recebida.</h3><p>Em breve, nossa equipe vai falar com você para continuar a conversa.</p><button className="text-link" onClick={() => setSubmitted(false)}>Enviar outra mensagem <span>↘</span></button></div> : <form onSubmit={handleSubmit}><label>Seu nome<input required name="name" placeholder="Como podemos chamar você?" /></label><label>Seu melhor contato<input required name="contact" placeholder="E-mail ou telefone" /></label><label>Como podemos ajudar? <textarea required name="message" placeholder="Conte um pouco sobre o que você procura..." rows={3} /></label><button className="button button--primary button--wide" type="submit">Enviar mensagem <ArrowUpRight size={18} /></button><small>Seus dados são usados apenas para este contato.</small></form>}</Reveal>
          </div>
        </section>
      </main>

      <footer className="site-footer"><div className="container footer-inner"><AppMark /><p>Odontologia humanizada,<br />precisa e próxima.</p><div className="footer-meta"><span>© 2026 Dra. Monique Cascapera</span><a href="#top">Voltar ao topo ↑</a></div></div></footer>
    </div>
  );
}
