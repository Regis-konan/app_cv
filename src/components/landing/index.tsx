import { useState, useEffect, useRef } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, useInView, AnimatePresence } from 'framer-motion';
import { useCVStore } from '../../store/cvStore';
import type { TemplateId } from '../../types/cv.types';

if (!document.getElementById('lp-fonts')) {
  const l = document.createElement('link');
  l.id = 'lp-fonts'; l.rel = 'stylesheet';
  l.href = 'https://fonts.googleapis.com/css2?family=Fraunces:ital,opsz,wght@0,9..144,300;0,9..144,400;1,9..144,300;1,9..144,400&family=DM+Sans:wght@300;400;500&display=swap';
  document.head.appendChild(l);
}

if (!document.getElementById('lp-reset')) {
  const s = document.createElement('style');
  s.id = 'lp-reset';
  s.textContent = `
    *, *::before, *::after { box-sizing: border-box; }
    html { scroll-behavior: smooth; }
    body { overflow-x: hidden; }

    /* ── BURGER MENU ── */
    .lp-burger { display: none !important; }

    .lp-mobile-menu {
      display: none;
      position: fixed;
      inset: 0;
      z-index: 49;
      background: rgba(248,245,240,0.98);
      backdrop-filter: blur(16px);
      flex-direction: column;
      align-items: center;
      justify-content: center;
      gap: 28px;
    }
    .lp-mobile-menu.open { display: flex !important; }
    .lp-mobile-menu button {
      background: none; border: none; font-size: 24px;
      font-family: 'Fraunces', serif; font-weight: 300;
      color: #1E1E1E; cursor: pointer; letter-spacing: -0.5px;
    }
    .lp-mobile-menu button:hover { color: #B76E6E; }

    /* ── PROCESS STEP : alternance desktop ── */
    .lp-process-step { display: grid; grid-template-columns: 1fr 1fr; }
    .lp-process-num  { display: flex; align-items: center; justify-content: center; padding: 48px 24px; position: relative; overflow: hidden; }
    .lp-process-text { display: flex; flex-direction: column; justify-content: center; padding: clamp(32px,5vw,64px) clamp(20px,5vw,80px); }

    /* ── FAQ SPLIT / ACCORDION ── */
    .lp-faq-split { display: grid; grid-template-columns: 1fr 1fr; min-height: 420px; max-width: 1100px; margin: 0 auto; }
    .lp-faq-answer { padding: 40px 36px; display: flex; flex-direction: column; justify-content: center; position: sticky; top: 80px; align-self: start; }
    .lp-faq-accordion { display: none; }

    @media (max-width: 640px) {
      /* ── Overflow global ── */
      * { max-width: 100%; }
      section, div[id] { overflow-x: hidden; }
      /* Fix CSS grid blowout */
      .lp-bento > * { min-width: 0; min-height: 0; }

      /* ── Hero : supprime le vide vertical ── */
      #hero { min-height: auto !important; align-items: flex-start !important; }

      /* ── Nav ── */
      .lp-burger { display: flex !important; }
      .lp-nav-links { display: none !important; }
      .lp-nav-cta { display: none !important; }

      /* ── Hero ── */
      .lp-hero-grid { grid-template-columns: 1fr !important; }
      .lp-hero-right { display: none !important; }
      .lp-hero-pad { padding-top: 96px !important; padding-bottom: 48px !important; min-height: 100svh !important; padding-left: 20px !important; padding-right: 20px !important; }
      .lp-hero-h1 { font-size: clamp(32px, 9vw, 44px) !important; letter-spacing: -1.5px !important; }
      .lp-hero-sub { font-size: 14px !important; max-width: 100% !important; }
      .lp-hero-cta { flex-direction: column !important; }
      .lp-hero-cta button { width: 100% !important; padding: 15px 20px !important; font-size: 14px !important; justify-content: center !important; }

      /* ── Templates : masque grille, affiche carousel ── */
      .lp-tpl-desktop { display: none !important; }
      .lp-tpl-carousel {
        display: flex !important;
        overflow-x: scroll;
        scroll-snap-type: x mandatory;
        -webkit-overflow-scrolling: touch;
        gap: 14px;
        padding: 4px 20px 24px;
        scrollbar-width: none;
        margin: 0 -20px;
      }
      .lp-tpl-carousel::-webkit-scrollbar { display: none; }
      .lp-tpl-carousel-card {
        flex: 0 0 62vw !important;
        scroll-snap-align: start;
        margin-top: 0 !important;
      }
      .lp-tpl-dots { display: flex !important; }
      .lp-tpl-header { flex-direction: column !important; }
      .lp-tpl-header p { text-align: left !important; }

      /* ── Processus : masque desktop, affiche stepper ── */
      .lp-process-desktop { display: none !important; }
      .lp-process-mobile { display: flex !important; }
      /* Empêche le numéro géant de déborder */
      .lp-process-mobile > div:nth-child(2) > div { overflow: hidden !important; }

      /* ── En détail : bento mobile 2 colonnes ── */
      #details { padding: 52px 16px 64px !important; }
      #details .lp-bento {
        grid-template-columns: 1fr 1fr !important;
        gap: 10px !important;
      }
      /* Carte 1 (dark) — pleine largeur */
      #details .lp-bento .lp-bento-c1 {
        grid-column: 1 / 3 !important;
        padding: 28px 22px 24px !important;
        min-height: auto !important;
      }
      #details .lp-bento .lp-bento-c1 p:first-of-type { font-size: 15px !important; }
      #details .lp-bento .lp-bento-c1 p:last-of-type { font-size: 12.5px !important; }
      /* Cartes 2 + 3 — côte à côte */
      #details .lp-bento .lp-bento-c2 {
        grid-column: 1 / 2 !important;
        padding: 22px 16px 20px !important;
      }
      #details .lp-bento .lp-bento-c3 {
        grid-column: 2 / 3 !important;
        padding: 22px 16px 20px !important;
      }
      #details .lp-bento .lp-bento-c2 span:first-child,
      #details .lp-bento .lp-bento-c3 > div:first-child { font-size: 28px !important; }
      #details .lp-bento .lp-bento-c2 p,
      #details .lp-bento .lp-bento-c3 p { font-size: 12px !important; line-height: 1.5 !important; }
      /* Masquer description courte sur cartes petites pour éviter surcharge */
      #details .lp-bento .lp-bento-c2 p:last-of-type,
      #details .lp-bento .lp-bento-c3 p:last-of-type { display: none !important; }
      /* Carte 4 (terra PDF) — pleine largeur */
      #details .lp-bento .lp-bento-c4 {
        grid-column: 1 / 3 !important;
        padding: 26px 22px 24px !important;
        min-height: auto !important;
      }
      #details .lp-bento .lp-bento-c4 p:first-of-type { font-size: 16px !important; }
      #details .lp-bento .lp-bento-c4 p:last-of-type { font-size: 12.5px !important; }
      /* Carte 5 (templates) — pleine largeur */
      #details .lp-bento .lp-bento-c5 {
        grid-column: 1 / 3 !important;
        padding: 22px 18px !important;
        flex-direction: column !important;
        align-items: flex-start !important;
        gap: 16px !important;
      }
      #details .lp-bento .lp-bento-c5 p:first-of-type { font-size: 15px !important; }
      /* Dots templates plus petits */
      #details .lp-bento .lp-bento-c5 > div:last-child > div { width: 22px !important; height: 22px !important; }

      /* ── FAQ : masque split, affiche bulles ── */
      .lp-faq-split { display: none !important; }
      .lp-faq-bubbles { display: flex !important; }

      /* ── CTA ── */
      .lp-cta-mobile { display: flex !important; }
      .lp-cta-desktop { display: none !important; }

      /* ── Footer ── */
      .lp-footer-inner { flex-direction: column !important; gap: 16px !important; text-align: center !important; }
      .lp-footer-inner > div { justify-content: center !important; }

      /* ── Sections avec bords arrondis ── */
      .lp-rounded-wrapper { padding: 0 10px !important; }
      #processus { border-radius: 20px !important; }
    }

    @media (min-width: 641px) and (max-width: 900px) {
      .lp-hero-grid { grid-template-columns: 1fr !important; }
      .lp-hero-right { display: none !important; }
      .lp-tpl-grid { grid-template-columns: repeat(3, 1fr) !important; }
      .lp-tpl-grid > div { margin-top: 0 !important; }
    }
  `;
  document.head.appendChild(s);
}

const C = {
  bg:     '#F8F5F0',
  white:  '#FFFFFF',
  sand:   '#E8D5C5',
  terra:  '#B76E6E',
  dark:   '#1E1E1E',
  gray:   '#8B8B8B',
  border: 'rgba(232,213,197,0.45)',
};

/* ─── NAV ─────────────────────────────────────────────── */
function Navigation() {
  const navigate = useNavigate();
  const [scrolled, setScrolled]             = useState(false);
  const [scrollProgress, setScrollProgress] = useState(0);
  const [active, setActive]                 = useState('hero');
  const [menuOpen, setMenuOpen]             = useState(false);
const lastY      = useRef(0);
const headerRef  = useRef<HTMLElement>(null);
const menuOpenRef = useRef(false);

  useEffect(() => {
    const header = headerRef.current;
    if (!header) return;

    let rafId = 0;
    let prevY = window.scrollY || 0;

    // rAF polling — contourne le freeze des scroll events iOS pendant l'inertie
    const tick = () => {
       if (menuOpenRef.current) {          // ← ajoute ça
    rafId = requestAnimationFrame(tick);
    return;
   }
      const scrollY = window.scrollY || document.documentElement.scrollTop;
      const docH    = document.documentElement.scrollHeight - window.innerHeight;

      setScrollProgress(docH > 0 ? Math.min(scrollY / docH, 1) : 0);
      setScrolled(scrollY > 30);

      // DOM direct — synchrone, aucun re-render React
      if (scrollY < 50) {
        header.style.top = '14px';
        header.style.pointerEvents = 'auto';
      } else if (scrollY > prevY + 10) {
        header.style.top = '-100px';
        header.style.pointerEvents = 'none';
      } else if (scrollY < prevY - 5) {
        header.style.top = '14px';
        header.style.pointerEvents = 'auto';
      }

      if (scrollY !== prevY) {
        lastY.current = scrollY;
        prevY = scrollY;
      }

      for (const id of ['hero','modeles','processus','details','faq']) {
        const el = document.getElementById(id);
        if (el) {
          const r = el.getBoundingClientRect();
          if (r.top <= 80 && r.bottom >= 80) { setActive(id); break; }
        }
      }

      rafId = requestAnimationFrame(tick);
    };

    rafId = requestAnimationFrame(tick);
    return () => cancelAnimationFrame(rafId);
  }, []);

  // Quand le menu s'ouvre/ferme, cache/montre via DOM aussi
useEffect(() => {
  menuOpenRef.current = menuOpen;  // ← ajoute cette ligne
  const header = headerRef.current;
  if (!header) return;
  if (menuOpen) {
    header.style.top = '-100px';
    header.style.pointerEvents = 'none';
  } else {
    header.style.top = '14px';
    header.style.pointerEvents = 'auto';
  }
}, [menuOpen]);

  const scrollTo = (id: string) => {
    document.getElementById(id)?.scrollIntoView({ behavior: 'smooth' });
    setMenuOpen(false);
  };

  const items = [
    { id: 'modeles',   label: 'Modèles' },
    { id: 'processus', label: 'Processus' },
    { id: 'details',   label: 'En détail' },
    { id: 'faq',       label: 'FAQ' },
  ];

  return (
    <>
      {/* Menu plein écran mobile */}
      <AnimatePresence>
        {menuOpen && (
          <motion.div
            initial={{ opacity: 0, y: -8 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -8 }}
            transition={{ duration: 0.25, ease: [0.22, 1, 0.36, 1] }}
            style={{
              position: 'fixed', inset: 0, zIndex: 49,
              background: 'rgba(248,245,240,0.97)',
              backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
              display: 'flex', flexDirection: 'column',
              alignItems: 'center', justifyContent: 'center', gap: 8,
            }}
          >
            {/* Bouton fermer — X cerclé, haut droite */}
            <motion.button
              initial={{ opacity: 0, rotate: -45, scale: 0.8 }}
              animate={{ opacity: 1, rotate: 0, scale: 1 }}
              transition={{ duration: 0.3, delay: 0.1 }}
              onClick={() => setMenuOpen(false)}
              style={{
                position: 'absolute', top: 20, right: 20,
                width: 44, height: 44, borderRadius: '50%',
                background: C.terra, border: 'none',
                display: 'flex', alignItems: 'center', justifyContent: 'center',
                cursor: 'pointer', flexShrink: 0,
              }}
              aria-label="Fermer"
            >
              {/* SVG croix propre */}
              <svg width="14" height="14" viewBox="0 0 14 14" fill="none">
                <line x1="1" y1="1" x2="13" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
                <line x1="13" y1="1" x2="1" y2="13" stroke="white" strokeWidth="2" strokeLinecap="round"/>
              </svg>
            </motion.button>

            {/* Logo en haut à gauche */}
            <div style={{ position: 'absolute', top: 28, left: 24, fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: 16, color: C.dark }}>
              zodeTon<em style={{ fontStyle: 'italic', color: C.terra }}>CV</em>
            </div>

            {/* Liens de navigation */}
            {items.map(({ id, label }, i) => (
              <motion.button
                key={id}
                initial={{ opacity: 0, y: 16 }}
                animate={{ opacity: 1, y: 0 }}
                transition={{ duration: 0.3, delay: 0.08 + i * 0.06 }}
                onClick={() => scrollTo(id)}
                style={{
                  background: 'none', border: 'none',
                  fontSize: 28, fontFamily: 'Fraunces, serif', fontWeight: 300,
                  color: C.dark, cursor: 'pointer', letterSpacing: '-0.5px',
                  padding: '8px 0', lineHeight: 1,
                }}
                onMouseEnter={e => (e.currentTarget.style.color = C.terra)}
                onMouseLeave={e => (e.currentTarget.style.color = C.dark)}
              >{label}</motion.button>
            ))}

            {/* CTA */}
            <motion.button
              initial={{ opacity: 0, y: 16 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ duration: 0.3, delay: 0.35 }}
              whileTap={{ scale: 0.96 }}
              onClick={() => { navigate('/app'); setMenuOpen(false); }}
              style={{
                marginTop: 24, padding: '15px 48px',
                borderRadius: 12, background: C.terra,
                border: 'none', color: 'white',
                fontSize: 15, fontWeight: 500,
                cursor: 'pointer', fontFamily: "'DM Sans', sans-serif",
              }}
            >Créer mon CV →</motion.button>
          </motion.div>
        )}
      </AnimatePresence>

      <header
        ref={headerRef}
        style={{
          position: 'fixed',
          top: 14,
          left: 0, right: 0, zIndex: 50,
          display: 'flex', justifyContent: 'center',
          pointerEvents: 'auto',
          padding: '0 16px',
          transition: 'top 0.32s cubic-bezier(0.22,1,0.36,1)',
          WebkitTransition: 'top 0.32s cubic-bezier(0.22,1,0.36,1)',
          transform: 'translateZ(0)',
          WebkitTransform: 'translateZ(0)',
        }}
      >
        <div style={{
          pointerEvents: 'auto',
          display: 'flex', alignItems: 'center', gap: 20,
          padding: scrolled ? '7px 12px 7px 18px' : '9px 14px 9px 20px',
          borderRadius: 60,
          background: scrolled ? 'rgba(255,255,255,0.98)' : 'rgba(255,255,255,0.88)',
          backdropFilter: 'blur(20px)', WebkitBackdropFilter: 'blur(20px)',
          border: `1px solid ${scrolled ? 'rgba(183,110,110,0.22)' : C.border}`,
          boxShadow: scrolled
            ? '0 8px 36px rgba(0,0,0,0.12), 0 2px 8px rgba(183,110,110,0.08)'
            : '0 2px 10px rgba(0,0,0,0.03)',
          transition: 'all 0.35s ease',
          maxWidth: scrolled ? 620 : 680, width: '100%',
          position: 'relative', overflow: 'hidden',
        }}>
          {/* Barre de progression — fond du pill */}
          <div style={{
            position: 'absolute', bottom: 0, left: 0,
            height: 2, borderRadius: '0 0 60px 60px',
            width: `${scrollProgress * 100}%`,
            background: `linear-gradient(90deg, ${C.terra}, rgba(183,110,110,0.4))`,
            transition: 'width 0.1s linear',
            pointerEvents: 'none',
          }} />
          <a href="#" onClick={e => { e.preventDefault(); scrollTo('hero'); }} style={{ textDecoration: 'none', fontFamily: 'Fraunces, serif', fontWeight: 400, fontSize: 15, color: C.dark, letterSpacing: '-0.3px', whiteSpace: 'nowrap', flexShrink: 0 }}>
            zodeTon<em style={{ fontStyle: 'italic', color: C.terra }}>CV</em>
          </a>

          <nav className="lp-nav-links" style={{ display: 'flex', gap: 20, flex: 1, justifyContent: 'center' }}>
            {items.map(({ id, label }) => (
              <button key={id}
                onClick={() => scrollTo(id)}
                style={{ background: 'none', border: 'none', padding: '2px 0', fontSize: 13, fontWeight: active === id ? 500 : 400, color: active === id ? C.terra : C.gray, cursor: 'pointer', transition: 'color .18s', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}
                onMouseEnter={e => (e.currentTarget.style.color = C.terra)}
                onMouseLeave={e => (e.currentTarget.style.color = active === id ? C.terra : C.gray)}
              >{label}</button>
            ))}
          </nav>

          {/* Desktop CTA */}
          <motion.button
            className="lp-nav-cta"
            whileHover={{ scale: 1.03 }} whileTap={{ scale: 0.97 }}
            onClick={() => navigate('/app')}
            style={{ padding: '8px 18px', borderRadius: 30, background: C.terra, border: 'none', color: 'white', fontSize: 13, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap', flexShrink: 0, marginLeft: 'auto' }}
          >Créer</motion.button>

          {/* Burger mobile */}
          <button
            className="lp-burger"
            onClick={() => setMenuOpen(true)}
            style={{ background: 'none', border: 'none', cursor: 'pointer', padding: '4px 6px', display: 'flex', flexDirection: 'column', gap: 5, marginLeft: 'auto', flexShrink: 0 }}
            aria-label="Menu"
          >
            <span style={{ display: 'block', width: 22, height: 2, borderRadius: 2, background: C.dark, transition: 'all .2s' }} />
            <span style={{ display: 'block', width: 16, height: 2, borderRadius: 2, background: C.dark, transition: 'all .2s' }} />
            <span style={{ display: 'block', width: 22, height: 2, borderRadius: 2, background: C.dark, transition: 'all .2s' }} />
          </button>
        </div>
      </header>
    </>
  );
}

/* ─── HERO ────────────────────────────────────────────── */
function HeroSection() {
  const navigate = useNavigate();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  return (
    <section id="hero" ref={ref} style={{ minHeight: '100svh', background: C.bg, display: 'flex', alignItems: 'center', position: 'relative', overflow: 'hidden' }}>
      {/* Blobs décoratifs */}
      <div style={{ position: 'absolute', top: '-10%', right: '-5%', width: 500, height: 500, borderRadius: '50%', background: C.sand, opacity: 0.22, filter: 'blur(90px)', pointerEvents: 'none', zIndex: 0 }} />
      <div style={{ position: 'absolute', bottom: '-5%', left: '-8%', width: 380, height: 380, borderRadius: '50%', background: C.terra, opacity: 0.08, filter: 'blur(80px)', pointerEvents: 'none', zIndex: 0 }} />

      <div className="lp-hero-pad lp-hero-grid" style={{ maxWidth: 1180, margin: '0 auto', width: '100%', padding: '80px max(20px, 4vw) 60px', display: 'grid', gridTemplateColumns: '1fr 1fr', alignItems: 'center', gap: 48, position: 'relative', zIndex: 1 }}>
        <div>
          {['Votre parcours,', 'en toute simplicité.'].map((line, i) => (
            <div key={i} style={{ overflow: 'hidden' }}>
              <motion.h1
                className="lp-hero-h1"
                initial={{ y: '105%' }}
                animate={inView ? { y: 0 } : {}}
                transition={{ duration: 0.75, delay: 0.08 + i * 0.12, ease: [0.22, 1, 0.36, 1] }}
                style={{ margin: 0, fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(36px, 4.8vw, 64px)', lineHeight: 1.06, letterSpacing: '-2px', color: i === 1 ? C.terra : C.dark, fontStyle: i === 1 ? 'italic' : 'normal', marginBottom: i === 0 ? 4 : 28 }}
              >{line}</motion.h1>
            </div>
          ))}

          <motion.p
            className="lp-hero-sub"
            initial={{ opacity: 0, y: 12 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.6, delay: 0.35 }}
            style={{ fontSize: 15, lineHeight: 1.8, color: C.gray, maxWidth: 400, marginBottom: 36, fontFamily: "'DM Sans', sans-serif", fontWeight: 300 }}
          >
            Six templates soigneusement conçus pour mettre en valeur votre profil.
            Remplissez, personnalisez, exportez en PDF — sans compte, sans frais cachés.
          </motion.p>

          <motion.div
            className="lp-hero-cta"
            initial={{ opacity: 0, y: 10 }}
            animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.48 }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap', marginBottom: 36 }}
          >
            <motion.button
              whileHover={{ y: -2, boxShadow: '0 12px 30px rgba(183,110,110,0.26)' }} whileTap={{ scale: 0.97 }}
              onClick={() => navigate('/app')}
              style={{ padding: '13px 32px', background: C.terra, border: 'none', borderRadius: 10, color: 'white', fontSize: 14, fontWeight: 500, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}
            >Créer mon CV</motion.button>
            <motion.button
              whileHover={{ y: -2, borderColor: 'rgba(183,110,110,0.4)' }} whileTap={{ scale: 0.97 }}
              onClick={() => document.getElementById('modeles')?.scrollIntoView({ behavior: 'smooth' })}
              style={{ padding: '13px 22px', background: 'transparent', border: `1.5px solid ${C.border}`, borderRadius: 10, color: C.dark, fontSize: 14, cursor: 'pointer', transition: 'all 0.2s', fontFamily: "'DM Sans', sans-serif" }}
            >Voir les modèles ↓</motion.button>
          </motion.div>

          {/* Badges honnêtes */}
          <motion.div
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.62 }}
            style={{ display: 'flex', gap: 10, flexWrap: 'wrap' }}
          >
            {['100 % gratuit', 'Sans inscription', 'Export PDF inclus', 'Compatible ATS'].map((badge) => (
              <span key={badge} style={{ display: 'inline-flex', alignItems: 'center', gap: 5, padding: '5px 12px', borderRadius: 20, border: `1px solid ${C.border}`, background: C.white, fontSize: 11.5, color: C.gray, fontFamily: "'DM Sans', sans-serif" }}>
                <span style={{ color: C.terra, fontSize: 10 }}>✓</span> {badge}
              </span>
            ))}
          </motion.div>
        </div>

        {/* Vitrine templates — droite hero */}
        <div className="lp-hero-right" style={{ position: 'relative', height: 520, display: 'flex', alignItems: 'center', justifyContent: 'center' }}>

          {/* Halo de fond */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 1.2, delay: 0.2 }}
            style={{ position: 'absolute', width: '75%', height: '85%', borderRadius: 32, background: `linear-gradient(135deg, ${C.sand}55, ${C.terra}18)`, filter: 'blur(2px)' }}
          />

          {/* Template principal — centré, grand */}
          <motion.div
            initial={{ opacity: 0, y: 40, scale: 0.92 }} animate={inView ? { opacity: 1, y: 0, scale: 1 } : {}}
            transition={{ duration: 0.85, delay: 0.3, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', width: '46%', left: '20%', top: '6%', borderRadius: 14, overflow: 'hidden', boxShadow: '0 28px 64px rgba(0,0,0,0.14), 0 0 0 1px rgba(0,0,0,0.05)', zIndex: 3 }}
          >
            <MiniCV id="business" color="#C9A959" />
          </motion.div>

          {/* Template gauche — légèrement en retrait */}
          <motion.div
            initial={{ opacity: 0, x: -32, rotate: -2 }} animate={inView ? { opacity: 1, x: 0, rotate: -5 } : {}}
            transition={{ duration: 0.9, delay: 0.45, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', width: '35%', left: '3%', top: '18%', borderRadius: 12, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.10)', zIndex: 2, transformOrigin: 'bottom right' }}
          >
            <MiniCV id="tech" color="#58A6FF" />
          </motion.div>

          {/* Template droit — légèrement en retrait */}
          <motion.div
            initial={{ opacity: 0, x: 32, rotate: 2 }} animate={inView ? { opacity: 1, x: 0, rotate: 6 } : {}}
            transition={{ duration: 0.9, delay: 0.5, ease: [0.22, 1, 0.36, 1] }}
            style={{ position: 'absolute', width: '34%', right: '2%', top: '12%', borderRadius: 12, overflow: 'hidden', boxShadow: '0 16px 40px rgba(0,0,0,0.10)', zIndex: 2, transformOrigin: 'bottom left' }}
          >
            <MiniCV id="health" color="#52B788" />
          </motion.div>

          {/* Badge "6 templates" */}
          <motion.div
            initial={{ opacity: 0, y: 12 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.85 }}
            style={{ position: 'absolute', bottom: '10%', left: '12%', background: 'white', borderRadius: 12, padding: '10px 16px', boxShadow: '0 8px 28px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 10, zIndex: 4, fontFamily: "'DM Sans', sans-serif" }}
          >
            {/* 6 mini dots colorés */}
            <div style={{ display: 'flex', gap: 4 }}>
              {['#4A90E2','#58A6FF','#C9A959','#52B788','#9C6644','#E63946'].map(c => (
                <div key={c} style={{ width: 8, height: 8, borderRadius: '50%', background: c }} />
              ))}
            </div>
            <span style={{ fontSize: 12, fontWeight: 500, color: C.dark }}>6 templates</span>
          </motion.div>

          {/* Badge ATS */}
          <motion.div
            initial={{ opacity: 0, y: -10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.95 }}
            style={{ position: 'absolute', top: '5%', right: '5%', background: 'white', borderRadius: 10, padding: '9px 14px', boxShadow: '0 8px 28px rgba(0,0,0,0.09), 0 0 0 1px rgba(0,0,0,0.04)', display: 'flex', alignItems: 'center', gap: 8, zIndex: 4, fontFamily: "'DM Sans', sans-serif" }}
          >
            <div style={{ width: 8, height: 8, borderRadius: '50%', background: '#52B788', flexShrink: 0 }} />
            <span style={{ fontSize: 12, fontWeight: 500, color: C.dark }}>Optimisé ATS</span>
          </motion.div>

          {/* Badge PDF */}
          <motion.div
            initial={{ opacity: 0, scale: 0.8 }} animate={inView ? { opacity: 1, scale: 1 } : {}}
            transition={{ duration: 0.45, delay: 1.05 }}
            style={{ position: 'absolute', bottom: '18%', right: '4%', background: C.terra, borderRadius: 10, padding: '9px 14px', boxShadow: '0 8px 24px rgba(183,110,110,0.3)', display: 'flex', alignItems: 'center', gap: 8, zIndex: 4, fontFamily: "'DM Sans', sans-serif" }}
          >
            <svg width="14" height="14" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.5" strokeLinecap="round" strokeLinejoin="round">
              <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
            </svg>
            <span style={{ fontSize: 12, fontWeight: 500, color: 'white' }}>Export PDF</span>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ─── MINI CV SVG ─────────────────────────────────────── */
function MiniCV({ id = 'student', color = '#B76E6E' }: { id?: TemplateId; color?: string }) {
  if (id === 'student') return (
    /* Nouveau design : header coloré pleine largeur + corps 2col + aside droit */
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      {/* Fond page */}
      <rect width="130" height="168" rx="7" fill="#FAFAF8"/>

      {/* ── HEADER coloré ── */}
      <rect width="130" height="46" rx="7" fill={color}/>
      <rect y="25" width="130" height="21" fill={color}/>

      {/* DotGrid — points blancs */}
      {[0,1,2,3,4,5,6,7].map(xi => [0,1,2].map(yi => (
        <circle key={`${xi}${yi}`} cx={5+xi*18} cy={5+yi*14} r="0.8" fill="white" fillOpacity="0.13"/>
      )))}

      {/* CornerArc TL */}
      <path d="M 0 38 A 38 38 0 0 1 38 0" fill="none" stroke="white" strokeWidth="0.8" opacity="0.22"/>
      <path d="M 0 25 A 25 25 0 0 1 25 0" fill="none" stroke="white" strokeWidth="0.8" opacity="0.14"/>
      {/* CornerArc BR */}
      <path d="M 130 8 A 38 38 0 0 1 92 46" fill="none" stroke="white" strokeWidth="0.8" opacity="0.22"/>
      <path d="M 130 21 A 25 25 0 0 1 105 46" fill="none" stroke="white" strokeWidth="0.8" opacity="0.14"/>

      {/* Photo — double cercle */}
      <circle cx="22" cy="23" r="13" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.65)" strokeWidth="1.2"/>
      <circle cx="22" cy="23" r="13" fill="none" stroke="rgba(255,255,255,0.3)" strokeWidth="2.5" strokeDasharray="3 2"/>
      <circle cx="22" cy="19" r="6" fill="rgba(255,255,255,0.4)"/>
      <ellipse cx="22" cy="29" rx="8" ry="5" fill="rgba(255,255,255,0.25)"/>

      {/* Nom + titre dans le header */}
      <rect x="40" y="10" width="44" height="5" rx="2" fill="rgba(255,255,255,0.9)"/>
      <rect x="40" y="18" width="28" height="3" rx="1.5" fill="rgba(255,255,255,0.55)"/>
      <rect x="40" y="25" width="52" height="2" rx="1" fill="rgba(255,255,255,0.3)"/>
      <rect x="40" y="30" width="38" height="2" rx="1" fill="rgba(255,255,255,0.25)"/>
      <rect x="40" y="36" width="44" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>

      {/* ── CORPS : main gauche + aside droit ── */}
      {/* Aside droit (fond blanc, largeur ~30) */}
      <rect x="100" y="46" width="30" height="122" fill="white"/>
      {/* Triangles décoratifs dans aside */}
      <polygon points="100,46 116,46 100,62" fill={color} fillOpacity="0.1"/>
      <polygon points="130,150 130,168 114,168" fill={color} fillOpacity="0.08"/>

      {/* Skills dans aside */}
      <rect x="103" y="52" width="22" height="2.5" rx="1" fill={color} fillOpacity="0.7"/>
      {[59,66,73,80,87].map((y,i) => (
        <rect key={y} x="103" y={y} width={[22,18,20,16,20][i]} height="4.5" rx="2.2"
          fill="white" stroke={color} strokeWidth="0.5" strokeOpacity={[1,0.5,1,0.5,1][i]}
          fillOpacity={[0,1,0,1,0][i] * 0.12 + 0.02}/>
      ))}
      {/* OrnDivider losange */}
      <rect x="103" y="97" width="22" height="0.5" fill={color} fillOpacity="0.2"/>
      <polygon points="114,94 117,97 114,100 111,97" fill={color} fillOpacity="0.45"/>
      <rect x="103" y="97" width="22" height="0.5" fill={color} fillOpacity="0.2"/>

      {/* Langues dans aside — barre fine */}
      <rect x="103" y="104" width="22" height="2.5" rx="1" fill={color} fillOpacity="0.7"/>
      {[111,119,127].map(y => (
        <g key={y}>
          <rect x="103" y={y} width="22" height="2" rx="1" fill="#eee"/>
          <rect x="103" y={y} width={[16,10,20][Math.floor((y-111)/8)]} height="2" rx="1" fill={color} fillOpacity="0.5"/>
        </g>
      ))}

      {/* Main gauche — sections */}
      <rect x="6" y="51" width="30" height="3" rx="1.5" fill={color} fillOpacity="0.8"/>
      <rect x="6" y="57" width="90" height="2" rx="1" fill="#e0e0e0"/>
      <rect x="6" y="61" width="80" height="2" rx="1" fill="#e0e0e0"/>
      <rect x="6" y="65" width="86" height="2" rx="1" fill="#e0e0e0"/>

      {/* Expériences — timeline losange */}
      <rect x="6" y="72" width="26" height="3" rx="1.5" fill={color} fillOpacity="0.8"/>
      {[79,93,107].map(y => (
        <g key={y}>
          <polygon points={`12,${y+3} 15,${y} 18,${y+3} 15,${y+6}`} fill={color}/>
          <rect x="21" y={y} width="50" height="3.5" rx="1.5" fill="#222" fillOpacity="0.7"/>
          <rect x="21" y={y+6} width="70" height="2" rx="1" fill="#e8e8e8"/>
          <rect x="21" y={y+10} width="60" height="2" rx="1" fill="#e8e8e8"/>
        </g>
      ))}

      {/* Formation — timeline cercle creux */}
      <rect x="6" y="122" width="24" height="3" rx="1.5" fill={color} fillOpacity="0.8"/>
      {[129,143].map(y => (
        <g key={y}>
          <circle cx="14" cy={y+3} r="3" fill="none" stroke={color} strokeWidth="1.2"/>
          <rect x="21" y={y} width="44" height="3.5" rx="1.5" fill="#222" fillOpacity="0.65"/>
          <rect x="21" y={y+6} width="60" height="2" rx="1" fill="#e8e8e8"/>
        </g>
      ))}
    </svg>
  );
  if (id === 'tech') return (
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="130" height="168" rx="7" fill="#F8F9FA"/>
      <rect width="130" height="46" rx="7" fill="#0D1117"/>
      <rect x="0" y="20" width="130" height="26" fill="#0D1117"/>
      {[0,1,2,3,4,5].map(x => [0,1,2].map(y => (
        <circle key={`${x}${y}`} cx={7+x*22} cy={7+y*14} r="0.7" fill={color} opacity="0.3"/>
      )))}
      <polygon points="19,5 33,12 33,30 19,37 5,30 5,12" fill={color} opacity="0.25"/>
      <polygon points="19,5 33,12 33,30 19,37 5,30 5,12" fill="none" stroke={color} strokeWidth="1.2"/>
      <circle cx="19" cy="21" r="7" fill="rgba(255,255,255,0.15)"/>
      <rect x="40" y="10" width="46" height="6" rx="2" fill="rgba(255,255,255,0.9)"/>
      <rect x="40" y="20" width="22" height="3" rx="1.5" fill={color} opacity="0.8"/>
      <rect x="40" y="27" width="34" height="2.5" rx="1" fill="rgba(255,255,255,0.3)"/>
      <rect x="94" y="10" width="28" height="2" rx="1" fill="rgba(255,255,255,0.25)"/>
      <rect x="94" y="16" width="22" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>
      <rect x="94" y="22" width="26" height="2" rx="1" fill="rgba(255,255,255,0.2)"/>
      <rect width="130" height="2" y="44" fill={color}/>
      {[52,79,106].map(y => (
        <g key={y}>
          <rect x="5" y={y} width="76" height="22" rx="3" fill="white" stroke="#eee" strokeWidth="0.5"/>
          <rect x="5" y={y} width="3" height="22" rx="1.5" fill={color}/>
          <rect x="12" y={y+4} width="40" height="4" rx="2" fill="#111" opacity="0.8"/>
          <rect x="12" y={y+11} width="26" height="3" rx="1.5" fill={color} opacity="0.65"/>
          <rect x="12" y={y+17} width="54" height="2.5" rx="1" fill="#e0e0e0"/>
        </g>
      ))}
      <rect x="86" y="46" width="44" height="122" rx="7" fill="#161B22"/>
      <rect x="86" y="46" width="7" height="122" fill="#161B22"/>
      <rect x="90" y="52" width="30" height="2.5" rx="1" fill={color} opacity="0.6"/>
      {[58,64,70,76,82,88,94,100].map((y,i) => (
        <rect key={y} x="90" y={y} width={[30,24,28,22,30,26,20,28][i]} height="4" rx="1.5"
          fill={color} opacity="0.12" stroke={color} strokeWidth="0.5" strokeOpacity="0.45"/>
      ))}
      <rect x="90" y="112" width="30" height="2.5" rx="1" fill={color} opacity="0.6"/>
      {[119,127,135].map((y,i) => (
        <rect key={y} x="90" y={y} width={[34,28,32][i]} height="3" rx="1.5" fill="rgba(255,255,255,0.08)"/>
      ))}
    </svg>
  );
  if (id === 'business') return (
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="130" height="168" rx="7" fill="white"/>
      <rect x="88" width="42" height="168" rx="7" fill="#1C1C1C"/>
      <rect x="88" width="7" height="168" fill="#1C1C1C"/>
      <rect x="96" y="10" width="26" height="36" fill={color} opacity="0.2"/>
      <polygon points="114,10 122,10 122,18" fill={color} opacity="0.9"/>
      <circle cx="109" cy="28" r="10" fill={color} opacity="0.2"/>
      <circle cx="109" cy="24" r="5" fill="rgba(255,255,255,0.28)"/>
      <rect x="93" y="54" width="28" height="3.5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
      <rect x="95" y="60" width="22" height="2.5" rx="1" fill={color} opacity="0.7"/>
      {[70,77,84,91].map((y,i) => (
        <rect key={y} x="93" y={y} width={[28,22,26,18][i]} height="2.5" rx="1" fill="rgba(255,255,255,0.18)"/>
      ))}
      {[102,108,114,120,126,132].map((y,i) => (
        <rect key={y} x="93" y={y} width={[26,20,24,16,22,18][i]} height="4.5" rx="2"
          fill="rgba(255,255,255,0.06)" stroke={color} strokeWidth="0.4" strokeOpacity="0.45"/>
      ))}
      <rect x="8" y="9" width="12" height="2.5" rx="1" fill="#ddd"/>
      <rect x="8" y="15" width="60" height="8" rx="2" fill="#1a1a1a"/>
      <rect x="8" y="26" width="54" height="7" rx="2" fill={color} opacity="0.85"/>
      <rect x="8" y="36" width="34" height="2.5" rx="1" fill={color} opacity="0.35"/>
      <rect x="8" y="43" width="70" height="1" fill={color} opacity="0.25"/>
      <rect x="8" y="49" width="36" height="2.5" rx="1" fill="#111" opacity="0.7"/>
      <rect x="8" y="53" width="70" height="0.5" fill={color} opacity="0.22"/>
      {[57,62,67].map((y,i) => (
        <rect key={y} x="8" y={y} width={[68,60,64][i]} height="2.5" rx="1" fill="#eee"/>
      ))}
      <rect x="8" y="76" width="42" height="2.5" rx="1" fill="#111" opacity="0.7"/>
      <rect x="8" y="80" width="70" height="0.5" fill={color} opacity="0.22"/>
      {[85,99,113].map(y => (
        <g key={y}>
          <rect x="8" y={y} width="12" height="8" rx="1.5" fill="#f5f5f5"/>
          <circle cx="24" cy={y+4} r="3" fill={color} opacity="0.8"/>
          <rect x="29" y={y} width="46" height="3.5" rx="1.5" fill="#111" opacity="0.65"/>
          <rect x="29" y={y+6} width="36" height="2.5" rx="1" fill="#ddd"/>
        </g>
      ))}
    </svg>
  );
  if (id === 'health') return (
    /* Nouveau design : aside gauche hexagones + barre colorée + main droite typographique */
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="130" height="168" rx="7" fill="white"/>

      {/* ── ASIDE GAUCHE — fond #FAFAFA, hexagones ── */}
      <rect width="46" height="168" rx="7" fill="#FAFAFA"/>
      <rect width="7" height="168" fill="#FAFAFA"/>

      {/* Hexagones nid d'abeille (simplifiés en losanges pour le mini) */}
      {[0,1,2,3,4,5].map(xi => [0,1,2,3,4,5,6].map(yi => (
        <polygon key={`${xi}${yi}`}
          points={`${4+xi*8},${3+yi*12+((xi%2)*6)} ${7+xi*8},${1+yi*12+((xi%2)*6)} ${10+xi*8},${3+yi*12+((xi%2)*6)} ${10+xi*8},${7+yi*12+((xi%2)*6)} ${7+xi*8},${9+yi*12+((xi%2)*6)} ${4+xi*8},${7+yi*12+((xi%2)*6)}`}
          fill="none" stroke={color} strokeWidth="0.4" opacity="0.18"/>
      )))}

      {/* Barre fine colorée bord droit aside */}
      <rect x="43" y="0" width="3" height="168" fill={color} fillOpacity="0.7"/>

      {/* Photo carrée clip-path coin coupé */}
      <rect x="7" y="8" width="28" height="28" rx="2" fill={color} fillOpacity="0.18"/>
      <rect x="8" y="9" width="26" height="26" fill="rgba(255,255,255,0.35)"/>
      {/* Ombre décalée */}
      <rect x="10" y="38" width="26" height="2" rx="1" fill={color} fillOpacity="0.12"/>

      {/* Nom + titre dans aside */}
      <rect x="5" y="42" width="36" height="3.5" rx="1.5" fill="#222" fillOpacity="0.75"/>
      <rect x="7" y="48" width="28" height="2.5" rx="1" fill={color} fillOpacity="0.6"/>

      {/* Contacts aside */}
      {[55,62,69,76].map((y,i) => (
        <g key={y}>
          <rect x="5" y={y} width="5" height="5" rx="1" fill={color} fillOpacity={0.7}/>
          <rect x="12" y={y+1} width={[28,22,26,20][i]} height="2.5" rx="1" fill="#bbb"/>
        </g>
      ))}

      {/* Skills — alternance fond coloré / transparent */}
      <rect x="5" y="86" width="32" height="2.5" rx="1" fill={color} fillOpacity="0.7"/>
      {[92,98,104,110,116,122].map((y,i) => (
        <rect key={y} x="5" y={y} width="34" height="5" rx="1.5"
          fill={i%2===0 ? color : 'white'} fillOpacity={i%2===0 ? 0.12 : 0.5}
          stroke={color} strokeWidth="0.4" strokeOpacity="0.4"/>
      ))}

      {/* ── MAIN DROITE ── */}
      <rect x="46" y="0" width="84" height="168" fill="white"/>

      {/* Header typographique — grande initiale watermark */}
      <text x="118" y="36" fontFamily="serif" fontSize="38" fill={color} fillOpacity="0.07" textAnchor="end">A</text>
      <rect x="52" y="8" width="11" height="2" rx="1" fill="#aaa" fillOpacity="0.6"/>
      <rect x="52" y="13" width="54" height="6" rx="2" fill={color} fillOpacity="0.85"/>
      <rect x="52" y="22" width="38" height="3.5" rx="1.5" fill="#222" fillOpacity="0.8"/>
      <rect x="52" y="28" width="58" height="1" fill={color} fillOpacity="0.25"/>
      <rect x="52" y="32" width="30" height="2.5" rx="1" fill="#bbb"/>

      {/* Section profil */}
      <rect x="52" y="42" width="22" height="3" rx="1.5" fill={color} fillOpacity="0.8"/>
      <rect x="52" y="48" width="72" height="2" rx="1" fill="#e8e8e8"/>
      <rect x="52" y="52" width="64" height="2" rx="1" fill="#e8e8e8"/>
      <rect x="52" y="56" width="70" height="2" rx="1" fill="#e8e8e8"/>

      {/* Section formation — cercles creux */}
      <rect x="52" y="64" width="26" height="3" rx="1.5" fill={color} fillOpacity="0.8"/>
      {[71,84].map(y => (
        <g key={y}>
          <circle cx="56" cy={y+3} r="3" fill="none" stroke={color} strokeWidth="1.2"/>
          <rect x="63" y={y} width="46" height="3.5" rx="1.5" fill="#222" fillOpacity="0.65"/>
          <rect x="63" y={y+6} width="52" height="2" rx="1" fill="#e8e8e8"/>
        </g>
      ))}

      {/* Section expériences — ronds pleins */}
      <rect x="52" y="98" width="30" height="3" rx="1.5" fill={color} fillOpacity="0.8"/>
      {[105,119,133].map(y => (
        <g key={y}>
          <circle cx="56" cy={y+3} r="3" fill={color}/>
          <rect x="63" y={y} width="52" height="3.5" rx="1.5" fill="#222" fillOpacity="0.65"/>
          <rect x="63" y={y+6} width="58" height="2" rx="1" fill="#e8e8e8"/>
          <rect x="63" y={y+10} width="46" height="2" rx="1" fill="#e8e8e8"/>
        </g>
      ))}
    </svg>
  );
  if (id === 'industry') return (
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="130" height="168" rx="7" fill="#FAFAFA"/>
      <rect width="42" height="168" rx="7" fill="#1A1A1A"/>
      <rect x="7" width="35" height="168" fill="#1A1A1A"/>
      <rect width="42" height="52" fill="#2a2a2a"/>
      <rect x="0" width="7" height="52" fill="#2a2a2a"/>
      <circle cx="21" cy="26" r="15" fill={color} opacity="0.22"/>
      <circle cx="21" cy="21" r="8" fill="rgba(255,255,255,0.28)"/>
      <ellipse cx="21" cy="32" rx="10" ry="6" fill="rgba(255,255,255,0.14)"/>
      <rect width="42" height="2.5" y="50" fill={color}/>
      <rect x="5" y="57" width="32" height="4" rx="2" fill="rgba(255,255,255,0.78)"/>
      <rect x="8" y="64" width="26" height="2.5" rx="1" fill={color} opacity="0.65"/>
      {[73,80,87].map((y,i) => (
        <g key={y}>
          <circle cx="9" cy={y+1.5} r="2" fill={color} opacity="0.55"/>
          <rect x="14" y={y} width={[24,20,26][i]} height="2.5" rx="1" fill="rgba(255,255,255,0.18)"/>
        </g>
      ))}
      <rect x="5" y="102" width="32" height="3" rx="1.5" fill="rgba(255,255,255,0.14)"/>
      <rect x="5" y="109" width="26" height="2.5" rx="1" fill={color} opacity="0.38"/>
      <rect x="5" y="119" width="30" height="3" rx="1.5" fill="rgba(255,255,255,0.1)"/>
      <rect x="42" y="0" width="88" height="26" fill="white"/>
      <rect x="50" y="6" width="50" height="6" rx="2" fill="#111"/>
      <rect x="50" y="15" width="30" height="3" rx="1.5" fill="#aaa"/>
      <rect x="42" y="26" width="88" height="3" fill={color}/>
      <rect x="48" y="34" width="74" height="11" rx="2" fill="white" stroke="#eee" strokeWidth="0.5"/>
      <rect x="48" y="34" width="4" height="11" rx="2" fill={color}/>
      <rect x="56" y="37" width="56" height="2.5" rx="1" fill="#e0e0e0"/>
      <rect x="56" y="42" width="46" height="2.5" rx="1" fill="#e0e0e0"/>
      <rect x="48" y="51" width="24" height="3" rx="1.5" fill={color} opacity="0.7"/>
      <rect x="72" y="57" width="1.5" height="80" fill={color} opacity="0.18"/>
      {[59,78,97,116].map(y => (
        <g key={y}>
          <rect x="48" y={y} width="18" height="13" rx="2" fill="#f0f0f0"/>
          <rect x="50" y={y+3} width="12" height="2" rx="1" fill="#bbb"/>
          <rect x="50" y={y+7} width="10" height="2" rx="1" fill="#ccc"/>
          <circle cx="73" cy={y+6} r="3.5" fill={color}/>
          <rect x="78" y={y} width="38" height="13" rx="2" fill="white" stroke="#eee" strokeWidth="0.5"/>
          <rect x="81" y={y+3} width="28" height="2.5" rx="1" fill="#333" opacity="0.7"/>
          <rect x="81" y={y+7} width="20" height="2" rx="1" fill={color} opacity="0.55"/>
        </g>
      ))}
    </svg>
  );
  if (id === 'marketing') return (
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="130" height="168" rx="7" fill="#FAF8F5"/>
      <rect width="130" height="44" rx="7" fill="#1A1A1A"/>
      <rect x="0" y="20" width="130" height="24" fill="#1A1A1A"/>
      <circle cx="17" cy="22" r="13" fill={color} opacity="0.22" stroke={color} strokeWidth="1.5"/>
      <circle cx="17" cy="18" r="7" fill="rgba(255,255,255,0.28)"/>
      <ellipse cx="17" cy="27" rx="8" ry="5" fill="rgba(255,255,255,0.18)"/>
      <rect x="36" y="9" width="14" height="2" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="36" y="14" width="44" height="7" rx="2" fill="rgba(255,255,255,0.85)"/>
      <rect x="36" y="24" width="32" height="3" rx="1.5" fill={color} opacity="0.8"/>
      <rect x="92" y="10" width="28" height="2" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="92" y="15" width="22" height="2" rx="1" fill="rgba(255,255,255,0.18)"/>
      <rect x="92" y="20" width="26" height="2" rx="1" fill="rgba(255,255,255,0.18)"/>
      <rect width="130" height="3" y="44" fill={color}/>
      <rect x="6" y="52" width="3.5" height="13" rx="1.75" fill={color}/>
      <rect x="13" y="53" width="108" height="2.5" rx="1" fill="#bbb"/>
      <rect x="13" y="58" width="94" height="2.5" rx="1" fill="#bbb"/>
      <rect x="13" y="63" width="102" height="2.5" rx="1" fill="#bbb"/>
      <rect x="6" y="72" width="24" height="2.5" rx="1" fill={color} opacity="0.8"/>
      <rect x="6" y="75" width="118" height="0.5" fill={color} opacity="0.18"/>
      {[79,95,111].map(y => (
        <g key={y}>
          <rect x="6" y={y} width="17" height="11" rx="1.5" fill="#f0ebe3"/>
          <rect x="7" y={y+2} width="13" height="2" rx="1" fill="#bbb"/>
          <rect x="7" y={y+6} width="10" height="2" rx="1" fill={color} opacity="0.45"/>
          <rect x="27" y={y} width="42" height="4" rx="2" fill="#111" opacity="0.65"/>
          <rect x="27" y={y+6} width="88" height="2.5" rx="1" fill="#ddd"/>
          <rect x="6" y={y+13} width="118" height="0.5" fill="#ede8e2"/>
        </g>
      ))}
      {[0,1,2].map(col => (
        <g key={col}>
          <rect x={6+col*42} y="130" width="28" height="2.5" rx="1" fill={color} opacity="0.7"/>
          {[136,142,148,154,160].map((y,i) => (
            <rect key={y} x={6+col*42} y={y} width={[26,20,24,18,22][i]} height="4.5" rx="2.2"
              fill="white" stroke="#ddd" strokeWidth="0.5"/>
          ))}
        </g>
      ))}
    </svg>
  );
  return null;
}

/* ─── TEMPLATES — grille décalée desktop / carousel mobile ── */
function TemplatesSection() {
  const navigate = useNavigate();
  const { initWithTemplate } = useCVStore();
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });
  const [activeCard, setActiveCard] = useState(0);
  const carouselRef = useRef<HTMLDivElement>(null);

  const templates: Array<{ id: TemplateId; name: string; desc: string; color: string }> = [
    { id: 'student',   name: 'Étudiant',  desc: 'Header coloré, 2 colonnes',  color: '#4A90E2' },
    { id: 'tech',      name: 'Tech',      desc: 'Header dark, hexagone',      color: '#58A6FF' },
    { id: 'business',  name: 'Business',  desc: 'Sidebar droite, prestige',   color: '#C9A959' },
    { id: 'health',    name: 'Santé',     desc: 'Sidebar gauche, hexagones',  color: '#52B788' },
    { id: 'industry',  name: 'Industrie', desc: 'Timeline cards, robuste',    color: '#9C6644' },
    { id: 'marketing', name: 'Marketing', desc: 'Magazine, full-width',       color: '#E63946' },
  ];

  const offsets = [0, 32, 8, 40, 0, 24];

  // Détecte la carte active dans le carousel
  const handleCarouselScroll = () => {
    if (!carouselRef.current) return;
    const el = carouselRef.current;
    const cardW = el.scrollWidth / templates.length;
    setActiveCard(Math.round(el.scrollLeft / cardW));
  };

  return (
    <section id="modeles" ref={ref} style={{ padding: '72px 24px 100px', background: C.white, overflow: 'hidden' }}>
      <div style={{ maxWidth: 1140, margin: '0 auto' }}>

        {/* Header */}
        <div className="lp-tpl-header" style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-end', marginBottom: 48, flexWrap: 'wrap', gap: 16 }}>
          <motion.h2
            initial={{ opacity: 0, x: -16 }} animate={inView ? { opacity: 1, x: 0 } : {}}
            transition={{ duration: 0.55 }}
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(24px, 3.2vw, 42px)', color: C.dark, letterSpacing: '-1px', lineHeight: 1.05 }}
          >
            Six façons de<br/><em style={{ fontStyle: 'italic', color: C.terra }}>vous présenter</em>.
          </motion.h2>
          <motion.p
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            style={{ fontSize: 13, color: C.gray, fontFamily: "'DM Sans', sans-serif", maxWidth: 200, textAlign: 'right', lineHeight: 1.6, paddingBottom: 6 }}
          >
            Touchez un modèle<br/>pour l'ouvrir dans l'éditeur.
          </motion.p>
        </div>

        {/* ── DESKTOP : grille décalée ── */}
        <div className="lp-tpl-desktop" style={{ display: 'grid', gridTemplateColumns: 'repeat(6, 1fr)', gap: 16, alignItems: 'start' }}>
          {templates.map(({ id, name, desc, color }, i) => (
            <motion.div key={id}
              initial={{ opacity: 0, y: 30 }} animate={inView ? { opacity: 1, y: 0 } : {}}
              transition={{ duration: 0.55, delay: i * 0.07 }}
              style={{ marginTop: offsets[i] }}
            >
              <div onClick={() => { initWithTemplate(id); navigate('/app'); }} style={{ cursor: 'pointer' }}>
                <motion.div
                  whileHover={{ y: -6, boxShadow: `0 20px 48px ${color}22` }}
                  transition={{ type: 'spring', stiffness: 300 }}
                  style={{ borderRadius: 10, overflow: 'hidden', marginBottom: 10, border: `1.5px solid ${C.border}`, boxShadow: '0 2px 12px rgba(0,0,0,0.04)', background: 'white', transition: 'border-color .2s' }}
                  onMouseEnter={e => ((e.currentTarget as HTMLDivElement).style.borderColor = color)}
                  onMouseLeave={e => ((e.currentTarget as HTMLDivElement).style.borderColor = C.border)}
                >
                  <MiniCV id={id} color={color} />
                </motion.div>
                <div style={{ display: 'flex', alignItems: 'center', gap: 6, marginBottom: 3 }}>
                  <div style={{ width: 6, height: 6, borderRadius: '50%', background: color, flexShrink: 0 }} />
                  <p style={{ fontSize: 12, fontWeight: 500, color: C.dark, fontFamily: "'DM Sans', sans-serif" }}>{name}</p>
                </div>
                <p style={{ fontSize: 10.5, color: C.gray, fontFamily: "'DM Sans', sans-serif", paddingLeft: 12 }}>{desc}</p>
              </div>
            </motion.div>
          ))}
        </div>

        {/* ── MOBILE : carousel horizontal scroll-snap ── */}
        <div ref={carouselRef} className="lp-tpl-carousel" onScroll={handleCarouselScroll}
          style={{ display: 'none' /* overridden by CSS on mobile */ }}
        >
          {templates.map(({ id, name, desc, color }) => (
            <div key={id} className="lp-tpl-carousel-card"
              onClick={() => { initWithTemplate(id); navigate('/app'); }}
              style={{ cursor: 'pointer' }}
            >
              {/* Card avec gros fond coloré */}
              <div style={{
                borderRadius: 16, overflow: 'hidden', marginBottom: 12,
                border: `2px solid ${color}22`,
                boxShadow: `0 8px 32px ${color}18`,
                background: `linear-gradient(160deg, ${color}08, white 40%)`,
                position: 'relative',
              }}>
                {/* Badge secteur */}
                <div style={{
                  position: 'absolute', top: 10, right: 10, zIndex: 2,
                  background: color, borderRadius: 20,
                  padding: '3px 10px', fontSize: 10, color: 'white',
                  fontFamily: "'DM Sans', sans-serif", fontWeight: 500,
                }}>{name}</div>
                <MiniCV id={id} color={color} />
              </div>
              <div style={{ display: 'flex', alignItems: 'center', justifyContent: 'space-between', paddingRight: 4 }}>
                <div>
                  <p style={{ fontSize: 13, fontWeight: 500, color: C.dark, fontFamily: "'DM Sans', sans-serif", marginBottom: 2 }}>{name}</p>
                  <p style={{ fontSize: 11, color: C.gray, fontFamily: "'DM Sans', sans-serif" }}>{desc}</p>
                </div>
                <span style={{ fontSize: 18, color: color, flexShrink: 0 }}>→</span>
              </div>
            </div>
          ))}
        </div>

        {/* Indicateur de dots — mobile only */}
        <div style={{ display: 'none', justifyContent: 'center', gap: 6, marginTop: 16 }} className="lp-tpl-dots">
          {templates.map((_, i) => (
            <div key={i} style={{
              width: i === activeCard ? 20 : 6, height: 6,
              borderRadius: 3,
              background: i === activeCard ? C.terra : C.border,
              transition: 'all 0.3s ease',
            }} />
          ))}
        </div>

      </div>
    </section>
  );
}

/* ─── PROCESSUS — desktop alternance / mobile tap-stepper ─ */
function ProcessSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-80px' });
  const [mobileStep, setMobileStep] = useState(0);

  const steps = [
    { n: '01', title: 'Choisissez', desc: 'Parcourez les 6 templates et sélectionnez celui qui correspond à votre profil et votre secteur.' },
    { n: '02', title: 'Remplissez', desc: 'Ajoutez vos expériences, compétences et formation via un formulaire guidé, section par section.' },
    { n: '03', title: 'Exportez',   desc: 'Téléchargez votre CV en PDF haute résolution, prêt à envoyer aux recruteurs, sans filigrane.' },
  ];

  return (
    <div className="lp-rounded-wrapper" style={{ padding: '0 16px', background: C.white }}>
    <section id="processus" ref={ref} style={{ background: C.dark, overflow: 'hidden', position: 'relative', borderRadius: 24 }}>

      {/* ── DESKTOP : layout alternance ── */}
      <div className="lp-process-desktop">
        <div style={{ maxWidth: 1100, margin: '0 auto', padding: '64px 24px 0' }}>
          <motion.div
            initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.55 }}
            style={{ display: 'flex', alignItems: 'baseline', gap: 20 }}
          >
            <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(22px, 3vw, 36px)', color: 'white', letterSpacing: '-1px', lineHeight: 1 }}>
              Simple par <em style={{ fontStyle: 'italic', color: C.terra }}>conception</em>.
            </h2>
            <div style={{ height: 1, flex: 1, background: 'rgba(255,255,255,0.08)', marginBottom: 4 }} />
            <span style={{ fontSize: 11, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>3 étapes</span>
          </motion.div>
        </div>

        {steps.map((step, i) => (
          <motion.div key={step.n}
            initial={{ opacity: 0 }} animate={inView ? { opacity: 1 } : {}}
            transition={{ duration: 0.6, delay: 0.1 + i * 0.14 }}
            style={{ display: 'grid', gridTemplateColumns: '1fr 1fr', borderBottom: `1px solid rgba(255,255,255,0.06)` }}
            className="lp-process-step"
          >
            <div className="lp-process-num" style={{
              order: i % 2 === 0 ? 0 : 1, display: 'flex', alignItems: 'center', justifyContent: 'center',
              padding: '48px 24px', position: 'relative', overflow: 'hidden',
              borderRight: i % 2 === 0 ? `1px solid rgba(255,255,255,0.06)` : 'none',
              borderLeft: i % 2 !== 0 ? `1px solid rgba(255,255,255,0.06)` : 'none',
            }}>
              <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(100px, 16vw, 180px)', color: 'rgba(255,255,255,0.03)', lineHeight: 1, letterSpacing: '-6px', userSelect: 'none', position: 'absolute' }}>{step.n}</span>
              <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(20px, 2.8vw, 32px)', color: C.terra, letterSpacing: '-0.5px', position: 'relative', zIndex: 1 }}>{step.n}</span>
            </div>
            <div className="lp-process-text" style={{ order: i % 2 === 0 ? 1 : 0, display: 'flex', flexDirection: 'column', justifyContent: 'center', padding: 'clamp(36px, 5vw, 64px) clamp(24px, 5vw, 80px)' }}>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(28px, 3.8vw, 48px)', color: 'white', letterSpacing: '-1.5px', marginBottom: 16, lineHeight: 1.05 }}>{step.title}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.8, color: 'rgba(255,255,255,0.4)', fontFamily: "'DM Sans', sans-serif", maxWidth: 340 }}>{step.desc}</p>
            </div>
          </motion.div>
        ))}
        <div style={{ height: 48 }} />
      </div>

      {/* ── MOBILE : stepper tap-to-advance ── */}
      <div className="lp-process-mobile" style={{ display: 'none', flexDirection: 'column', padding: '40px 0 0' }}>

        {/* Pills de progression */}
        <div style={{ display: 'flex', gap: 8, padding: '0 24px', marginBottom: 40 }}>
          {steps.map((_s, i) => (
            <button key={i} onClick={() => setMobileStep(i)} style={{
              flex: i === mobileStep ? 2 : 1, height: 4, borderRadius: 2,
              background: i === mobileStep ? C.terra : 'rgba(255,255,255,0.15)',
              border: 'none', cursor: 'pointer',
              transition: 'all 0.4s ease',
            }} />
          ))}
        </div>

        {/* Étape active */}
        <AnimatePresence mode="wait">
          <motion.div
            key={mobileStep}
            initial={{ opacity: 0, x: 24 }}
            animate={{ opacity: 1, x: 0 }}
            exit={{ opacity: 0, x: -24 }}
            transition={{ duration: 0.3 }}
            style={{ padding: '0 24px', flex: 1, minHeight: 260 }}
          >
            {/* Numéro géant en fond — clippé */}
            <div style={{ position: 'relative', overflow: 'hidden' }}>
              <span style={{
                fontFamily: 'Fraunces, serif', fontWeight: 300,
                fontSize: 'clamp(80px, 28vw, 120px)',
                color: 'rgba(255,255,255,0.04)',
                lineHeight: 1, letterSpacing: '-4px', userSelect: 'none',
                position: 'absolute', top: -16, right: -8,
                maxWidth: '50%', overflow: 'hidden',
              }}>{steps[mobileStep].n}</span>
              <p style={{ fontSize: 11, color: C.terra, fontFamily: "'DM Sans', sans-serif", letterSpacing: '2px', textTransform: 'uppercase', marginBottom: 16, position: 'relative' }}>
                Étape {steps[mobileStep].n}
              </p>
              <h3 style={{
                fontFamily: 'Fraunces, serif', fontWeight: 300,
                fontSize: 'clamp(36px, 11vw, 52px)',
                color: 'white', letterSpacing: '-2px', lineHeight: 1, marginBottom: 20,
                position: 'relative',
              }}>{steps[mobileStep].title}</h3>
              <p style={{ fontSize: 15, lineHeight: 1.75, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", position: 'relative' }}>
                {steps[mobileStep].desc}
              </p>
            </div>
          </motion.div>
        </AnimatePresence>

        {/* Bouton suivant / terminer */}
        <div style={{ padding: '32px 24px 40px', display: 'flex', justifyContent: 'space-between', alignItems: 'center', borderTop: '1px solid rgba(255,255,255,0.06)', marginTop: 24 }}>
          <span style={{ fontSize: 12, color: 'rgba(255,255,255,0.25)', fontFamily: "'DM Sans', sans-serif" }}>
            {mobileStep + 1} / {steps.length}
          </span>
          {mobileStep < steps.length - 1 ? (
            <button onClick={() => setMobileStep(s => s + 1)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: 'rgba(255,255,255,0.08)', border: '1px solid rgba(255,255,255,0.12)',
              borderRadius: 24, padding: '10px 20px', color: 'white',
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            }}>
              Étape suivante <span style={{ color: C.terra }}>→</span>
            </button>
          ) : (
            <button onClick={() => setMobileStep(0)} style={{
              display: 'flex', alignItems: 'center', gap: 8,
              background: C.terra, border: 'none',
              borderRadius: 24, padding: '10px 20px', color: 'white',
              fontSize: 13, fontFamily: "'DM Sans', sans-serif", cursor: 'pointer',
            }}>
              Recommencer ↺
            </button>
          )}
        </div>
      </div>

    </section>
    </div>
  );
}

/* ─── EN DÉTAIL — bento grid ──────────────────────────── */
function DetailsSection() {
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true, margin: '-60px' });

  return (
    <section id="details" ref={ref} style={{ background: C.white, padding: '80px 20px 100px', overflow: 'hidden' }}>
      <div style={{ maxWidth: 1100, margin: '0 auto', overflow: 'hidden' }}>

        {/* Header */}
        <motion.div
          initial={{ opacity: 0, y: 16 }} animate={inView ? { opacity: 1, y: 0 } : {}}
          transition={{ duration: 0.55 }}
          style={{ marginBottom: 48 }}
        >
          <p style={{ fontSize: 11, letterSpacing: '2px', textTransform: 'uppercase', color: C.terra, fontFamily: "'DM Sans', sans-serif", marginBottom: 14, opacity: 0.85 }}>— Ce qu'il faut savoir</p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(24px, 3.2vw, 42px)', color: C.dark, letterSpacing: '-1px', lineHeight: 1.08 }}>
            L'outil, <em style={{ fontStyle: 'italic', color: C.terra }}>sans détour</em>.
          </h2>
        </motion.div>

        {/* Bento grid */}
        <div className="lp-bento" style={{ display: 'grid', gridTemplateColumns: 'repeat(3, 1fr)', gridTemplateRows: 'auto auto auto', gap: 12, minWidth: 0 }}>

          {/* 1 — Confidentialité (grand, dark) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.05 }}
            className="lp-bento-c1"
            style={{ gridColumn: '1 / 3', borderRadius: 20, background: C.dark, padding: '40px 40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 220, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', top: -30, right: -30, width: 140, height: 140, borderRadius: '50%', background: 'rgba(183,110,110,0.08)' }} />
            <span style={{ fontSize: 36, lineHeight: 1, marginBottom: 20, display: 'block' }}>🔒</span>
            <div>
              <div style={{ display: 'flex', alignItems: 'center', gap: 12, marginBottom: 12 }}>
                <p style={{ fontSize: 18, fontWeight: 500, color: 'white', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.2 }}>Zéro donnée collectée.</p>
                <span style={{ padding: '3px 10px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.15)', fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", whiteSpace: 'nowrap' }}>Local uniquement</span>
              </div>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.45)', lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif", maxWidth: 400 }}>Tout se passe dans votre navigateur. Aucun serveur ne reçoit vos informations. Quand vous fermez l'onglet, il ne reste rien.</p>
            </div>
          </motion.div>

          {/* 2 — Gratuit (petit, terra clair) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.1 }}
            className="lp-bento-c2"
            style={{ gridColumn: '3 / 4', borderRadius: 20, background: `rgba(183,110,110,0.07)`, border: `1.5px solid rgba(183,110,110,0.15)`, padding: '36px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <span style={{ fontSize: 36, lineHeight: 1, display: 'block', marginBottom: 16 }}>◎</span>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500, color: C.dark, fontFamily: "'DM Sans', sans-serif", marginBottom: 10, lineHeight: 1.3 }}>Sans compte,<br/>sans carte.</p>
              <p style={{ fontSize: 12.5, color: C.gray, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>Utilisable immédiatement, sans rien payer.</p>
            </div>
            <span style={{ display: 'inline-block', marginTop: 20, padding: '5px 14px', borderRadius: 20, background: C.terra, fontSize: 11, color: 'white', fontFamily: "'DM Sans', sans-serif", fontWeight: 500, alignSelf: 'flex-start' }}>100 % gratuit</span>
          </motion.div>

          {/* 3 — ATS (petit, sable) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.15 }}
            className="lp-bento-c3"
            style={{ gridColumn: '1 / 2', borderRadius: 20, background: C.sand, padding: '36px 28px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between' }}
          >
            <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(183,110,110,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center', marginBottom: 20 }}>
              <svg width="22" height="22" viewBox="0 0 24 24" fill="none" stroke={C.terra} strokeWidth="2" strokeLinecap="round"><polyline points="20 6 9 17 4 12"/></svg>
            </div>
            <div>
              <p style={{ fontSize: 16, fontWeight: 500, color: C.dark, fontFamily: "'DM Sans', sans-serif", marginBottom: 10, lineHeight: 1.3 }}>Structuré pour<br/>les ATS.</p>
              <p style={{ fontSize: 12, color: '#7a6a5a', lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif" }}>Hiérarchie et ordre de lecture soignés pour les logiciels de tri.</p>
            </div>
            <span style={{ display: 'inline-block', marginTop: 20, padding: '4px 12px', borderRadius: 20, border: `1px solid rgba(183,110,110,0.3)`, fontSize: 10.5, color: C.terra, fontFamily: "'DM Sans', sans-serif", alignSelf: 'flex-start' }}>ATS-ready</span>
          </motion.div>

          {/* 4 — PDF (grand, terra) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.2 }}
            className="lp-bento-c4"
            style={{ gridColumn: '2 / 4', borderRadius: 20, background: C.terra, padding: '40px 40px 36px', display: 'flex', flexDirection: 'column', justifyContent: 'space-between', minHeight: 200, position: 'relative', overflow: 'hidden' }}
          >
            <div style={{ position: 'absolute', bottom: -40, left: -20, width: 160, height: 160, borderRadius: '50%', background: 'rgba(255,255,255,0.06)' }} />
            <div style={{ display: 'flex', justifyContent: 'space-between', alignItems: 'flex-start' }}>
              <span style={{ padding: '5px 14px', borderRadius: 20, border: '1px solid rgba(255,255,255,0.3)', fontSize: 11, color: 'rgba(255,255,255,0.8)', fontFamily: "'DM Sans', sans-serif" }}>Prêt à envoyer</span>
              <div style={{ width: 44, height: 44, borderRadius: 12, background: 'rgba(255,255,255,0.15)', display: 'flex', alignItems: 'center', justifyContent: 'center' }}>
                <svg width="20" height="20" viewBox="0 0 24 24" fill="none" stroke="white" strokeWidth="2.2" strokeLinecap="round" strokeLinejoin="round">
                  <path d="M21 15v4a2 2 0 01-2 2H5a2 2 0 01-2-2v-4M7 10l5 5 5-5M12 15V3"/>
                </svg>
              </div>
            </div>
            <div>
              <p style={{ fontSize: 20, fontWeight: 500, color: 'white', fontFamily: "'DM Sans', sans-serif", marginBottom: 10, lineHeight: 1.2 }}>PDF haute résolution.</p>
              <p style={{ fontSize: 13, color: 'rgba(255,255,255,0.65)', lineHeight: 1.75, fontFamily: "'DM Sans', sans-serif", maxWidth: 360 }}>Polices intégrées, mise en page respectée, impression sans dégradation. Compatible avec tous les lecteurs PDF.</p>
            </div>
          </motion.div>

          {/* 5 — Templates (pleine largeur, bg doux) */}
          <motion.div
            initial={{ opacity: 0, y: 20 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.5, delay: 0.25 }}
            className="lp-bento-c5"
            style={{ gridColumn: '1 / 4', borderRadius: 20, background: C.bg, border: `1.5px solid ${C.border}`, padding: '36px 40px', display: 'flex', alignItems: 'center', justifyContent: 'space-between', gap: 32, flexWrap: 'wrap' }}
          >
            <div>
              <p style={{ fontSize: 17, fontWeight: 500, color: C.dark, fontFamily: "'DM Sans', sans-serif", marginBottom: 8, lineHeight: 1.3 }}>Six modèles, six univers.</p>
              <p style={{ fontSize: 13, color: C.gray, lineHeight: 1.7, fontFamily: "'DM Sans', sans-serif", maxWidth: 440 }}>Chaque template est conçu pour un secteur précis — médical, tech, industrie, commerce, marketing, études.</p>
            </div>
            {/* Dots colorés des 6 templates */}
            <div style={{ display: 'flex', gap: 8, alignItems: 'center', flexShrink: 0 }}>
              {[
                { c: '#4A90E2', l: 'Étudiant' }, { c: '#58A6FF', l: 'Tech' }, { c: '#C9A959', l: 'Business' },
                { c: '#52B788', l: 'Santé' }, { c: '#9C6644', l: 'Industrie' }, { c: '#E63946', l: 'Marketing' },
              ].map(({ c, l }) => (
                <div key={l} title={l} style={{ width: 28, height: 28, borderRadius: '50%', background: c, opacity: 0.85, flexShrink: 0 }} />
              ))}
              <span style={{ fontSize: 11, color: C.gray, fontFamily: "'DM Sans', sans-serif", marginLeft: 8, whiteSpace: 'nowrap' }}>6 modèles</span>
            </div>
          </motion.div>

        </div>
      </div>
    </section>
  );
}

/* ─── FAQ ─────────────────────────────────────────────── */
function FAQSection() {
  const [open, setOpen] = useState<number>(0);
  const [mobileOpen, setMobileOpen] = useState<number | null>(null);
  const ref = useRef<HTMLElement>(null);
  const inView = useInView(ref, { once: true });

  const faqs = [
    { q: "Est-ce vraiment gratuit ?",                   a: "Oui, 100 % gratuit. Pas de carte bancaire, pas de compte requis. Vous créez votre CV et l'exportez sans rien payer." },
    { q: "Puis-je exporter mon CV en PDF ?",            a: "Oui. Le bouton d'export génère un PDF directement depuis votre navigateur. Tous les templates sont conçus pour produire un rendu propre à l'impression." },
    { q: "Mes données sont-elles sécurisées ?",         a: "L'outil ne stocke aucune donnée. Tout est traité localement dans votre navigateur. Rien n'est envoyé à un serveur." },
    { q: "Combien de temps faut-il ?",                  a: "En remplissant le formulaire étape par étape, comptez 5 à 15 minutes pour un CV complet selon la richesse de votre parcours." },
    { q: "Les templates sont-ils compatibles ATS ?",    a: "Oui, les structures utilisées sont conçues pour être lisibles par les logiciels ATS courants. L'ordre de lecture et la hiérarchie des blocs sont soignés." },
    { q: "Puis-je modifier après export ?",             a: "Tant que vous gardez l'onglet ouvert, vos données sont conservées. Vous pouvez relancer un export après correction. Il n'y a pas de sauvegarde automatique entre sessions." },
  ];

  return (
    <section id="faq" ref={ref} style={{ background: C.white }}>
      {/* Bandeau titre pleine largeur */}
      <div style={{ borderBottom: `1px solid ${C.border}`, borderTop: `1px solid ${C.border}`, padding: '20px 24px' }}>
        <div style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center' }}>
          <motion.h2
            initial={{ opacity: 0, y: 10 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.45 }}
            style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(18px, 2.5vw, 28px)', color: C.dark, letterSpacing: '-0.8px' }}
          >
            Questions <em style={{ fontStyle: 'italic', color: C.terra }}>fréquentes</em>.
          </motion.h2>
          <span style={{ fontSize: 11, color: C.gray, fontFamily: "'DM Sans', sans-serif" }}>{faqs.length} questions</span>
        </div>
      </div>

      {/* Desktop — Split panel */}
      <div className="lp-faq-split">
        {/* Colonne gauche — liste de questions */}
        <div style={{ borderRight: `1px solid ${C.border}` }}>
          {faqs.map((faq, i) => (
            <motion.button
              key={i}
              initial={{ opacity: 0, x: -12 }} animate={inView ? { opacity: 1, x: 0 } : {}}
              transition={{ duration: 0.4, delay: i * 0.06 }}
              onClick={() => setOpen(i)}
              style={{
                width: '100%', padding: '20px 24px',
                display: 'flex', justifyContent: 'space-between', alignItems: 'center',
                background: open === i ? C.bg : 'transparent',
                border: 'none', borderBottom: `1px solid ${C.border}`,
                cursor: 'pointer', textAlign: 'left', gap: 12,
                transition: 'background 0.2s',
              }}
            >
              <span style={{ fontSize: 13, fontWeight: open === i ? 500 : 400, color: open === i ? C.dark : C.gray, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4, transition: 'color 0.2s' }}>{faq.q}</span>
              <motion.span animate={{ x: open === i ? 4 : 0, opacity: open === i ? 1 : 0.3 }} transition={{ duration: 0.2 }} style={{ color: C.terra, fontSize: 14, flexShrink: 0 }}>→</motion.span>
            </motion.button>
          ))}
        </div>

        {/* Colonne droite — réponse active */}
        <div className="lp-faq-answer">
          <AnimatePresence mode="wait">
            <motion.div key={open} initial={{ opacity: 0, y: 12 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }} transition={{ duration: 0.28 }}>
              <p style={{ fontSize: 10, letterSpacing: '2px', textTransform: 'uppercase', color: C.terra, fontFamily: "'DM Sans', sans-serif", marginBottom: 16, opacity: 0.7 }}>
                {String(open + 1).padStart(2, '0')} / {String(faqs.length).padStart(2, '0')}
              </p>
              <h3 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(18px, 2.2vw, 26px)', color: C.dark, letterSpacing: '-0.5px', marginBottom: 20, lineHeight: 1.25 }}>{faqs[open].q}</h3>
              <p style={{ fontSize: 14, lineHeight: 1.85, color: C.gray, fontFamily: "'DM Sans', sans-serif" }}>{faqs[open].a}</p>
            </motion.div>
          </AnimatePresence>
        </div>
      </div>

      {/* Mobile — Bulles style messagerie */}
      <div className="lp-faq-bubbles" style={{ display: 'none', flexDirection: 'column', padding: '0 20px 36px', gap: 10 }}>
        {faqs.map((faq, i) => (
          <motion.div key={i}
            initial={{ opacity: 0, y: 8 }} animate={inView ? { opacity: 1, y: 0 } : {}}
            transition={{ duration: 0.3, delay: i * 0.06 }}
          >
            {/* Question — bulle droite (utilisateur) */}
            <div style={{ display: 'flex', justifyContent: 'flex-end', marginBottom: 6 }}>
              <button onClick={() => setMobileOpen(mobileOpen === i ? null : i)} style={{
                maxWidth: '82%', padding: '12px 16px',
                background: mobileOpen === i ? C.terra : C.dark,
                borderRadius: '18px 18px 4px 18px',
                textAlign: 'left', border: 'none', cursor: 'pointer',
                transition: 'background 0.2s',
              }}>
                <span style={{ fontSize: 13, color: 'white', fontFamily: "'DM Sans', sans-serif", lineHeight: 1.4, fontWeight: mobileOpen === i ? 500 : 400 }}>{faq.q}</span>
              </button>
            </div>
            {/* Réponse — bulle gauche (assistant) */}
            <AnimatePresence>
              {mobileOpen === i && (
                <motion.div
                  initial={{ opacity: 0, height: 0, scale: 0.95 }}
                  animate={{ opacity: 1, height: 'auto', scale: 1 }}
                  exit={{ opacity: 0, height: 0, scale: 0.95 }}
                  transition={{ duration: 0.25 }}
                  style={{ overflow: 'hidden', transformOrigin: 'top left' }}
                >
                  <div style={{ display: 'flex', justifyContent: 'flex-start', marginTop: 4, marginBottom: 4 }}>
                    <div style={{ maxWidth: '82%', padding: '12px 16px', background: C.white, borderRadius: '18px 18px 18px 4px', border: `1px solid ${C.border}` }}>
                      <p style={{ fontSize: 13, color: C.gray, fontFamily: "'DM Sans', sans-serif", lineHeight: 1.7, margin: 0 }}>{faq.a}</p>
                    </div>
                  </div>
                </motion.div>
              )}
            </AnimatePresence>
          </motion.div>
        ))}
      </div>

    </section>
  );
}

/* ─── CTA FINAL ───────────────────────────────────────── */
function CTASection() {
  const navigate = useNavigate();
  return (
    <section style={{ background: C.terra, overflow: 'hidden', position: 'relative' }}>

      {/* ── DESKTOP ── */}
      <div className="lp-cta-desktop" style={{
        maxWidth: 1100, margin: '0 auto',
        display: 'grid', gridTemplateColumns: '1fr auto',
        alignItems: 'center', gap: 40,
        padding: 'clamp(48px, 7vw, 88px) 24px',
      }}>
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.55 }}>
          <p style={{ fontSize: 11, letterSpacing: '2.5px', textTransform: 'uppercase', color: 'rgba(255,255,255,0.55)', fontFamily: "'DM Sans', sans-serif", marginBottom: 16 }}>Prêt à commencer</p>
          <h2 style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(28px, 5vw, 58px)', color: 'white', letterSpacing: '-2px', lineHeight: 1.0 }}>
            Créez votre CV.<br/><em style={{ opacity: 0.55, fontStyle: 'italic' }}>Maintenant.</em>
          </h2>
          <div style={{ display: 'flex', gap: 10, marginTop: 24, flexWrap: 'wrap' }}>
            {['Gratuit', 'Sans inscription', 'Export PDF'].map(t => (
              <span key={t} style={{ fontSize: 11, color: 'rgba(255,255,255,0.6)', fontFamily: "'DM Sans', sans-serif", borderLeft: '1px solid rgba(255,255,255,0.25)', paddingLeft: 10 }}>{t}</span>
            ))}
          </div>
        </motion.div>
        <motion.div initial={{ opacity: 0, scale: 0.92 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.15 }} style={{ flexShrink: 0 }}>
          <motion.button whileHover={{ scale: 1.04 }} whileTap={{ scale: 0.96 }} onClick={() => navigate('/app')}
            style={{ display: 'flex', alignItems: 'center', gap: 10, padding: '18px 32px', background: 'white', border: 'none', borderRadius: 10, color: C.terra, fontSize: 14, fontWeight: 500, cursor: 'pointer', fontFamily: "'DM Sans', sans-serif", boxShadow: '0 6px 24px rgba(0,0,0,0.1)', whiteSpace: 'nowrap' }}>
            Créer mon CV <span style={{ fontSize: 18 }}>→</span>
          </motion.button>
        </motion.div>
      </div>

      {/* ── MOBILE : plein écran typographique ── */}
      <div className="lp-cta-mobile" style={{ display: 'none', flexDirection: 'column', justifyContent: 'space-between', minHeight: '70svh', padding: '48px 24px 40px' }}>
        {/* Haut — mini badge */}
        <motion.div initial={{ opacity: 0, y: -10 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.4 }}>
          <span style={{ fontSize: 10, color: 'rgba(255,255,255,0.5)', fontFamily: "'DM Sans', sans-serif", letterSpacing: '3px', textTransform: 'uppercase' }}>zodeTonCV</span>
        </motion.div>

        {/* Centre — typo géante */}
        <motion.div initial={{ opacity: 0, scale: 0.9 }} whileInView={{ opacity: 1, scale: 1 }} viewport={{ once: true }} transition={{ duration: 0.6, delay: 0.1 }}>
          <h2 style={{
            fontFamily: 'Fraunces, serif', fontWeight: 300,
            fontSize: 'clamp(52px, 15vw, 80px)',
            color: 'white', letterSpacing: '-3px', lineHeight: 0.95,
            marginBottom: 0,
          }}>
            Créez<br/>votre<br/><em style={{ opacity: 0.45, fontStyle: 'italic' }}>CV.</em>
          </h2>
        </motion.div>

        {/* Bas — infos + bouton */}
        <motion.div initial={{ opacity: 0, y: 20 }} whileInView={{ opacity: 1, y: 0 }} viewport={{ once: true }} transition={{ duration: 0.5, delay: 0.25 }}>
          <div style={{ display: 'flex', gap: 16, marginBottom: 24, flexWrap: 'wrap' }}>
            {['Gratuit', 'Sans compte', 'PDF inclus'].map(t => (
              <span key={t} style={{ fontSize: 11, color: 'rgba(255,255,255,0.55)', fontFamily: "'DM Sans', sans-serif" }}>— {t}</span>
            ))}
          </div>
          <motion.button
            whileTap={{ scale: 0.96 }}
            onClick={() => navigate('/app')}
            style={{
              width: '100%', padding: '18px 24px',
              background: 'white', border: 'none',
              borderRadius: 14, color: C.terra,
              fontSize: 16, fontWeight: 500, cursor: 'pointer',
              fontFamily: "'DM Sans', sans-serif",
              display: 'flex', alignItems: 'center', justifyContent: 'center', gap: 12,
            }}
          >
            Créer mon CV <span style={{ fontSize: 20 }}>→</span>
          </motion.button>
        </motion.div>
      </div>

      {/* Texte décoratif fond */}
      <div style={{ position: 'absolute', bottom: -10, right: 24, fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 'clamp(60px, 14vw, 140px)', color: 'rgba(255,255,255,0.05)', letterSpacing: '-4px', lineHeight: 1, userSelect: 'none', pointerEvents: 'none', whiteSpace: 'nowrap' }}>CV</div>
    </section>
  );
}

/* ─── FOOTER ──────────────────────────────────────────── */
function Footer() {
  return (
    <footer style={{ padding: '22px 20px', background: C.bg, borderTop: `1px solid ${C.border}` }}>
      <div className="lp-footer-inner" style={{ maxWidth: 1100, margin: '0 auto', display: 'flex', justifyContent: 'space-between', alignItems: 'center', flexWrap: 'wrap', gap: 12 }}>
        <span style={{ fontFamily: 'Fraunces, serif', fontWeight: 300, fontSize: 14, color: C.gray }}>
          zodeTon<em style={{ fontStyle: 'italic', color: C.terra }}>CV</em>
        </span>
        <a href="#faq"
          style={{ fontSize: 12, color: C.gray, textDecoration: 'none', fontFamily: "'DM Sans', sans-serif", transition: 'color .16s' }}
          onMouseEnter={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.dark)}
          onMouseLeave={e => ((e.currentTarget as HTMLAnchorElement).style.color = C.gray)}
        >FAQ</a>
        <span style={{ fontSize: 12, color: C.gray, fontFamily: "'DM Sans', sans-serif" }}>© 2025 zodeTonCV</span>
      </div>
    </footer>
  );
}

/* ─── PAGE ────────────────────────────────────────────── */
export default function Landing() {
  return (
    <div style={{ background: C.white, color: C.dark, fontFamily: "'DM Sans', sans-serif", minHeight: '100vh', overflowX: 'hidden' }}>
      <Navigation />
      <HeroSection />
      <TemplatesSection />
      <ProcessSection />
      <DetailsSection />
      <FAQSection />
      <CTASection />
      <Footer />
    </div>
  );
}