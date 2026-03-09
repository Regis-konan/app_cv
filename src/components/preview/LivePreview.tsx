import { useEffect, useRef, useCallback, useState } from 'react';
import { Eye, X, Maximize2, RotateCcw, ZoomIn, ZoomOut } from 'lucide-react';
import { useCVStore } from '../../store/cvStore';
import TemplateBusiness  from '../templates/TemplateBusiness';
import TemplateHealth    from '../templates/TemplateHealth';
import TemplateIndustry  from '../templates/TemplateIndustry';
import TemplateMarketing from '../templates/TemplateMarketing';
import TemplateStudent   from '../templates/TemplateStudent';
import TemplateTech      from '../templates/TemplateTech';
import type { CVData }   from '../../types/cv.types';
import './LivePreview.css';

function TemplateRenderer({ cv }: { cv: CVData }) {
  switch (cv.design.template) {
    case 'business':  return <TemplateBusiness  cv={cv} />;
    case 'health':    return <TemplateHealth    cv={cv} />;
    case 'industry':  return <TemplateIndustry  cv={cv} />;
    case 'marketing': return <TemplateMarketing cv={cv} />;
    case 'student':   return <TemplateStudent   cv={cv} />;
    case 'tech':      return <TemplateTech      cv={cv} />;
    default:          return <TemplateBusiness  cv={cv} />;
  }
}

const TEMPLATE_LABEL: Record<string, string> = {
  business:  'Business',
  health:    'Santé & Social',
  industry:  'Industrie',
  marketing: 'Marketing',
  student:   'Étudiant',
  tech:      'Tech & Data',
};

const DOC_W = 794;

/* ─── Modal mobile : Rendu natif sans flou ─── */
function MobileModal({ cv, label, onClose }: { cv: CVData; label: string; onClose: () => void }) {
  useEffect(() => {
    document.body.style.overflow = 'hidden';
    return () => { document.body.style.overflow = ''; };
  }, []);

  return (
    <div className="lp-modal-overlay">
      <div className="lp-modal-header">
        <div className="lp-modal-header-left">
          <Eye size={14} />
          <span className="template-badge">{label}</span>
        </div>
        <button className="lp-modal-close" onClick={onClose} aria-label="Fermer">
          <X size={18} />
        </button>
      </div>

      <div className="lp-modal-body">
        <div className="lp-modal-cv-scroll-container">
          <div className="preview-document-native">
            <TemplateRenderer cv={cv} />
          </div>
        </div>
      </div>

      <div className="lp-modal-footer">
        <span className="lp-modal-hint">← Glissez pour naviguer →</span>
        <button className="lp-modal-close-btn" onClick={onClose}>Fermer</button>
      </div>
    </div>
  );
}

export default function LivePreview() {
  const { cvData } = useCVStore();
  const wrapperRef = useRef<HTMLDivElement>(null);
  const [scale, setScale] = useState(0.5);
  const [autoScale, setAutoScale] = useState(0.5);
  const [isAuto, setIsAuto] = useState(true);
  const [isMobile, setIsMobile] = useState(false);
  const [modalOpen, setModalOpen] = useState(false);

  const computeScale = useCallback(() => {
    if (!wrapperRef.current) return null;
    const avail = wrapperRef.current.clientWidth - 32;
    const s = parseFloat(Math.min(Math.max(avail / DOC_W, 0.15), 1).toFixed(4));
    return { s, mobile: window.innerWidth < 768 };
  }, []);

  useEffect(() => {
    const apply = () => {
      const r = computeScale();
      if (!r) return;
      setIsMobile(r.mobile);
      setAutoScale(r.s);
      if (isAuto) setScale(r.s);
    };
    window.addEventListener('resize', apply);
    apply();
    return () => window.removeEventListener('resize', apply);
  }, [computeScale, isAuto]);

  const label = TEMPLATE_LABEL[cvData.design.template] ?? '';

  return (
    <>
      {modalOpen && <MobileModal cv={cvData} label={label} onClose={() => setModalOpen(false)} />}

      <div className="live-preview">
        <div className="preview-toolbar">
          <div className="preview-toolbar-left">
            <Eye size={14} />
            <span>Aperçu</span>
            <span className="template-badge">{label}</span>
          </div>
          <div className="preview-toolbar-right">
            {isMobile ? (
              <button className="lp-fullscreen-btn" onClick={() => setModalOpen(true)}>
                <Maximize2 size={13} /> Plein écran
              </button>
            ) : (
              <>
                <button onClick={() => { setIsAuto(false); setScale(s => Math.max(0.15, s - 0.05)); }} className="zoom-btn"><ZoomOut size={14}/></button>
                <span className="zoom-level">{Math.round(scale * 100)}%</span>
                <button onClick={() => { setIsAuto(false); setScale(s => Math.min(1, s + 0.05)); }} className="zoom-btn"><ZoomIn size={14}/></button>
                <button onClick={() => { setIsAuto(true); setScale(autoScale); }} className="zoom-fit-btn"><RotateCcw size={14}/></button>
              </>
            )}
          </div>
        </div>

        <div className="preview-canvas-wrapper" ref={wrapperRef}>
          {isMobile ? (
            <div className="lp-mobile-placeholder" onClick={() => setModalOpen(true)}>
              <div className="placeholder-card">
                <Maximize2 size={32} />
                <p>Toucher pour prévisualiser le document</p>
              </div>
            </div>
          ) : (
            <div style={{ width: DOC_W * scale, height: 1123 * scale, flexShrink: 0 }}>
              <div style={{ width: DOC_W, height: 1123, transform: `scale(${scale})`, transformOrigin: 'top left', background: 'white', boxShadow: '0 20px 50px rgba(0,0,0,0.1)' }}>
                <TemplateRenderer cv={cvData} />
              </div>
            </div>
          )}
        </div>

        <div className="preview-footer">
          <span>A4 · {DOC_W}px</span>
          <span className="auto-save">Auto</span>
        </div>
      </div>
    </>
  );
}