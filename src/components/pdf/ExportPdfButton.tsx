import { useState, useMemo, useRef, useEffect } from 'react';
import { createPortal } from 'react-dom'; // AJOUTÉ
import { Download, Loader2, AlertCircle, FileText, CheckCircle2 } from 'lucide-react';
import { useCVStore } from '../../store/cvStore';
import TemplateBusiness  from '../templates/TemplateBusiness';
import TemplateHealth    from '../templates/TemplateHealth';
import TemplateIndustry  from '../templates/TemplateIndustry';
import TemplateMarketing from '../templates/TemplateMarketing';
import TemplateStudent   from '../templates/TemplateStudent';
import TemplateTech      from '../templates/TemplateTech';
import type { CVData }   from '../../types/cv.types';
import './ExportPdfButton.css';

const PDF_SERVER_URL = import.meta.env.VITE_PDF_SERVER_URL ?? 'http://192.168.100.69:3001';

const LOADING_MESSAGES = [
  'Mise en page de ton CV…',
  'Chargement des polices…',
  'Application des couleurs…',
  'Rendu des sections…',
  'Optimisation du PDF…',
  'Finalisation en cours…',
  'Presque prêt…',
];

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

/* ── Overlay de chargement (Portalisé) ── */
function LoadingOverlay({ progress, message }: { progress: number; message: string }) {
  // On utilise createPortal pour injecter le loader directement dans le <body>
  return createPortal(
    <div className="pdf-overlay">
      <div className="pdf-overlay-card">
        <div className="pdf-overlay-icon">
          <FileText size={32} strokeWidth={1.5} />
          <div className="pdf-overlay-spinner" />
        </div>
        <h3 className="pdf-overlay-title">Génération de votre CV</h3>
        <p className="pdf-overlay-message">{message}</p>
        
        <div className="pdf-overlay-track">
          <div className="pdf-overlay-fill" style={{ width: `${progress}%` }} />
        </div>
        
        <div className="pdf-overlay-footer">
          <span className="pdf-engine-tag">Engine v3.0</span>
          <span className="pdf-overlay-pct">{Math.round(progress)}%</span>
        </div>
      </div>
    </div>,
    document.body // C'est ici que la magie opère
  );
}

/* ── Toasts (Portalisés aussi pour être visibles partout) ── */
function SuccessToast() {
  return createPortal(
    <div className="pdf-toast pdf-toast--success">
      <CheckCircle2 size={16} />
      <span>PDF téléchargé avec succès !</span>
    </div>,
    document.body
  );
}

function ErrorToast({ onRetry }: { onRetry: () => void }) {
  return createPortal(
    <div className="pdf-toast pdf-toast--error">
      <AlertCircle size={16} />
      <span>Échec de la génération</span>
      <button onClick={onRetry}>Réessayer</button>
    </div>,
    document.body
  );
}

interface Props {
  className?: string;
  label?: string;
  compact?: boolean;
}

type Status = 'idle' | 'loading' | 'success' | 'error';

export default function ExportPdfButton({
  className = '',
  label = 'Télécharger PDF',
  compact = false,
}: Props) {
  const { cvData } = useCVStore();
  const [status, setStatus]     = useState<Status>('idle');
  const [progress, setProgress] = useState(0);
  const [msgIdx, setMsgIdx]     = useState(0);
  const hiddenRef   = useRef<HTMLDivElement>(null);
  const progressRef = useRef<ReturnType<typeof setInterval> | null>(null);
  const msgRef      = useRef<ReturnType<typeof setInterval> | null>(null);

  const fileName = useMemo(() => {
    const first = cvData.personal.firstName?.trim() || 'CV';
    const last  = cvData.personal.lastName?.trim()  || '';
    return `CV_${first}_${last}_${cvData.design.template}.pdf`
      .replace(/\s+/g, '_')
      .replace(/[^a-zA-Z0-9_.-]/g, '');
  }, [cvData.personal.firstName, cvData.personal.lastName, cvData.design.template]);

  useEffect(() => {
    if (status !== 'loading') {
      if (progressRef.current) clearInterval(progressRef.current);
      if (msgRef.current)      clearInterval(msgRef.current);
    }
    if (status === 'success' || status === 'error') {
      const t = setTimeout(() => setStatus('idle'), 4000);
      return () => clearTimeout(t);
    }
  }, [status]);

  const startAnimations = () => {
    setProgress(0);
    setMsgIdx(0);
    progressRef.current = setInterval(() => {
      setProgress(prev => {
        if (prev >= 85) { clearInterval(progressRef.current!); return prev; }
        const step = prev < 40 ? 4 : prev < 70 ? 2 : 0.5;
        return Math.min(85, prev + step);
      });
    }, 150);
    msgRef.current = setInterval(() => {
      setMsgIdx(i => (i + 1) % LOADING_MESSAGES.length);
    }, 2000);
  };

  const finishProgress = () => {
    if (progressRef.current) clearInterval(progressRef.current);
    let p = 85;
    const finish = setInterval(() => {
      p = Math.min(100, p + 5);
      setProgress(p);
      if (p >= 100) clearInterval(finish);
    }, 40);
  };

  const handleDownload = async () => {
    if (status === 'loading') return;
    if (!hiddenRef.current) return;
    setStatus('loading');
    startAnimations();

    try {
      const cvHtml = hiddenRef.current.innerHTML;

      // Capture optimisée des styles
      const allStyles = Array.from(document.styleSheets)
        .flatMap(sheet => {
          try { return Array.from(sheet.cssRules).map(r => r.cssText); }
          catch { return []; }
        })
        .join('\n');

      const externalLinks = Array.from(
        document.querySelectorAll<HTMLLinkElement>('link[rel="stylesheet"]')
      ).map(l => `<link rel="stylesheet" href="${l.href}" />`).join('\n');

      const fullHtml = `<!DOCTYPE html>
<html lang="fr">
<head>
  <meta charset="UTF-8" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0" />
  ${externalLinks}
  <style>
    ${allStyles}
    * { -webkit-print-color-adjust: exact !important; print-color-adjust: exact !important; }
    html, body { margin: 0; padding: 0; background: white; }
    .cv-export-root { width: 210mm; min-height: 297mm; display: block; margin: 0; padding: 0; }
  </style>
</head>
<body>
  <div class="cv-export-root">${cvHtml}</div>
</body>
</html>`;

      const response = await fetch(`${PDF_SERVER_URL}/generate-pdf`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ html: fullHtml, filename: fileName }),
      });

      if (!response.ok) throw new Error(`Erreur: ${response.status}`);

      finishProgress();

      const blob = await response.blob();
      const url  = URL.createObjectURL(blob);
      const a    = document.createElement('a');
      a.href     = url;
      a.download = fileName;
      document.body.appendChild(a); // Nécessaire sur certains navigateurs mobiles
      a.click();
      document.body.removeChild(a);
      URL.revokeObjectURL(url);

      setTimeout(() => setStatus('success'), 600);

    } catch (err) {
      console.error('Erreur export PDF:', err);
      setStatus('error');
    }
  };

  return (
    <>
      <div
        ref={hiddenRef}
        style={{ position: 'absolute', left: '-9999px', top: 0,
                 width: '794px', pointerEvents: 'none', zIndex: -1 }}
        aria-hidden="true"
      >
        <TemplateRenderer cv={cvData} />
      </div>

      {status === 'loading' && (
        <LoadingOverlay progress={progress} message={LOADING_MESSAGES[msgIdx]} />
      )}

      {status === 'success' && <SuccessToast />}
      {status === 'error'   && <ErrorToast onRetry={() => { setStatus('idle'); handleDownload(); }} />}

      <button
        className={`btn-export ${compact ? 'compact' : ''} ${className}`}
        onClick={handleDownload}
        disabled={status === 'loading'}
      >
        {status === 'loading'
          ? <Loader2 size={compact ? 14 : 16} className="spin" />
          : <Download size={compact ? 14 : 16} />
        }
        <span className="btn-export-label">{label}</span>
      </button>
    </>
  );
}