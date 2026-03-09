import { useState, useRef, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { motion, AnimatePresence } from 'framer-motion';
import {
  User, Briefcase, GraduationCap, Zap, Palette,
  ChevronLeft, ChevronRight, Check, ArrowLeft,
  Eye, EyeOff,
} from 'lucide-react';
import { useCVStore } from './store/cvStore';
import StepInfos      from './components/editor/StepInfos';
import StepExperience from './components/editor/StepExperience';
import StepFormation  from './components/editor/StepFormation';
import StepSkills     from './components/editor/StepSkills';
import StepDesign     from './components/editor/StepDesign';
import LivePreview    from './components/preview/LivePreview';
import ExportPdfButton from './components/pdf/ExportPdfButton';
import './App.css';

const STEPS = [
  { id: 'infos',      label: 'Infos',       fullLabel: 'Informations', icon: <User          size={16}/>, hint: 'Identité & contact'  },
  { id: 'experience', label: 'Expérience',  fullLabel: 'Expériences',  icon: <Briefcase     size={16}/>, hint: 'Postes & missions'   },
  { id: 'formation',  label: 'Formation',   fullLabel: 'Formation',    icon: <GraduationCap size={16}/>, hint: 'Diplômes & certifs'  },
  { id: 'skills',     label: 'Compétences', fullLabel: 'Compétences',  icon: <Zap           size={16}/>, hint: 'Tech, langues, soft' },
  { id: 'design',     label: 'Design',      fullLabel: 'Mise en page', icon: <Palette       size={16}/>, hint: 'Template & couleurs' },
] as const;

type StepId = typeof STEPS[number]['id'];

function StepContent({ step }: { step: StepId }) {
  switch (step) {
    case 'infos':      return <StepInfos />;
    case 'experience': return <StepExperience />;
    case 'formation':  return <StepFormation />;
    case 'skills':     return <StepSkills />;
    case 'design':     return <StepDesign />;
  }
}

export default function App() {
  const navigate  = useNavigate();
  const { currentStep, setStep, cvData } = useCVStore();
  const [showPreview, setShowPreview] = useState(false);
  const [previewWidth, setPreviewWidth] = useState(480);
  const isDragging = useRef(false);
  const startX = useRef(0);
  const startWidth = useRef(0);
  const tabsRef = useRef<HTMLDivElement>(null);

  const idx    = STEPS.findIndex(s => s.id === currentStep);
  const step   = STEPS[idx];
  const isLast = idx === STEPS.length - 1;
  const pct    = Math.round(((idx + 1) / STEPS.length) * 100);

  const goPrev = () => idx > 0 && setStep(STEPS[idx - 1].id);
  const goNext = () => !isLast && setStep(STEPS[idx + 1].id);

  const name = [cvData.personal.firstName, cvData.personal.lastName]
    .filter(Boolean).join(' ');

  // Scroll l'onglet actif dans la vue
  useEffect(() => {
    if (!tabsRef.current) return;
    const activeTab = tabsRef.current.querySelector('.mob-tab.is-active') as HTMLElement;
    if (activeTab) {
      activeTab.scrollIntoView({ behavior: 'smooth', block: 'nearest', inline: 'center' });
    }
  }, [currentStep]);

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (!isDragging.current) return;
      e.preventDefault();
      const newWidth = startWidth.current + (startX.current - e.clientX);
      setPreviewWidth(Math.min(800, Math.max(320, newWidth)));
    };
    const handleMouseUp = () => {
      isDragging.current = false;
      document.body.style.cursor = 'default';
      document.body.style.userSelect = 'auto';
    };
    document.addEventListener('mousemove', handleMouseMove);
    document.addEventListener('mouseup', handleMouseUp);
    return () => {
      document.removeEventListener('mousemove', handleMouseMove);
      document.removeEventListener('mouseup', handleMouseUp);
    };
  }, []);

  const startResize = (e: React.MouseEvent) => {
    e.preventDefault();
    isDragging.current = true;
    startX.current = e.clientX;
    startWidth.current = previewWidth;
    document.body.style.cursor = 'ew-resize';
    document.body.style.userSelect = 'none';
  };

  return (
    <div className="ed-shell">
      <header className="ed-topbar">
        <button className="ed-back-btn" onClick={() => navigate('/')} title="Retour accueil">
          <ArrowLeft size={15} />
          <span className="ed-back-label">Accueil</span>
        </button>

        <a href="/" className="ed-logo">
          zodeTon<em>CV</em>
        </a>

        <div className="ed-topbar-progress">
          <div className="ed-topbar-track">
            <div className="ed-topbar-fill" style={{ width: `${pct}%` }} />
          </div>
          <span className="ed-topbar-pct">{pct}%</span>
        </div>

        <div className="ed-topbar-actions">
          {/* Bouton aperçu mobile — toujours visible avec label */}
          <button
            className={`ed-preview-toggle mobile-only${showPreview ? ' is-active' : ''}`}
            onClick={() => setShowPreview(v => !v)}
            title={showPreview ? "Masquer l'aperçu" : "Voir l'aperçu"}
          >
            {showPreview ? <EyeOff size={15}/> : <Eye size={15}/>}
            <span className="ed-preview-label">{showPreview ? 'Fermer' : 'Aperçu'}</span>
          </button>

          <ExportPdfButton compact />
        </div>
      </header>

      {/* ── Tabs mobile — visibles sous la topbar ── */}
      <div className="mob-tabs mobile-only" ref={tabsRef}>
        {STEPS.map((s, i) => {
          const isActive = s.id === currentStep;
          const isDone   = i < idx;
          return (
            <button
              key={s.id}
              className={`mob-tab${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
              onClick={() => setStep(s.id)}
            >
              <span className="mob-tab-icon">
                {isDone ? <Check size={10} strokeWidth={3}/> : s.icon}
              </span>
              <span className="mob-tab-label">{s.label}</span>
              {isActive && <span className="mob-tab-pip" />}
            </button>
          );
        })}
      </div>

      <div className="ed-body">
        <aside className="ed-sidebar">
          <nav className="ed-sidebar-nav">
            {STEPS.map((s, i) => {
              const isActive = i === idx;
              const isDone   = i < idx;
              return (
                <button
                  key={s.id}
                  onClick={() => setStep(s.id)}
                  className={`ed-step${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}
                >
                  {isActive && <div className="ed-step-pip" />}
                  <div className={`ed-step-bubble${isActive ? ' is-active' : ''}${isDone ? ' is-done' : ''}`}>
                    {isDone ? <Check size={10} strokeWidth={3} /> : isActive ? s.icon : <span>{i + 1}</span>}
                  </div>
                  <div className="ed-step-text">
                    <span className="ed-step-label">{s.fullLabel}</span>
                    <span className="ed-step-hint">{s.hint}</span>
                  </div>
                </button>
              );
            })}
          </nav>
          <div className="ed-sidebar-progress">
            <div className="ed-sp-top">
              <span>Progression</span>
              <span className="ed-sp-pct">{pct}%</span>
            </div>
            <div className="ed-sp-track">
              <motion.div
                className="ed-sp-fill"
                initial={false}
                animate={{ width: `${pct}%` }}
                transition={{ duration: 0.4, ease: [0.22, 1, 0.36, 1] }}
              />
            </div>
          </div>
        </aside>

        <main className={`ed-panel${showPreview ? ' is-hidden-mobile' : ''}`}>
          <div className="ed-panel-head">
            <div className="ed-panel-head-icon">{step.icon}</div>
            <div>
              <p className="ed-panel-step-num">Étape {idx + 1} / {STEPS.length}</p>
              <h1 className="ed-panel-title">{step.fullLabel}</h1>
            </div>
            {name && <span className="ed-panel-name">{name}</span>}
          </div>

          <div className="ed-panel-body">
            <AnimatePresence mode="wait" initial={false}>
              <motion.div
                key={currentStep}
                initial={{ opacity: 0, y: 10 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -10 }}
                transition={{ duration: 0.2, ease: [0.4, 0, 0.2, 1] }}
              >
                <StepContent step={currentStep} />
              </motion.div>
            </AnimatePresence>
          </div>

          <div className="ed-panel-foot">
            <button onClick={goPrev} disabled={idx === 0} className="ed-btn-nav ed-btn-prev">
              <ChevronLeft size={15} /> <span>Précédent</span>
            </button>
            <div className="ed-dots">
              {STEPS.map((_, i) => (
                <button
                  key={i}
                  onClick={() => setStep(STEPS[i].id)}
                  className={`ed-dot${i === idx ? ' is-active' : ''}${i < idx ? ' is-done' : ''}`}
                />
              ))}
            </div>
            {isLast ? (
              <ExportPdfButton label="Télécharger" />
            ) : (
              <button onClick={goNext} className="ed-btn-nav ed-btn-next">
                <span>Suivant</span> <ChevronRight size={15} />
              </button>
            )}
          </div>
        </main>

        <div className="resize-handle" onMouseDown={startResize} />

        <div
          className={`ed-preview-panel${showPreview ? ' is-visible-mobile' : ''}`}
          style={{ width: previewWidth }}
        >
          <LivePreview />
        </div>
      </div>
    </div>
  );
}