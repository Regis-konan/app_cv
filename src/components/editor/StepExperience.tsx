import { useState } from 'react';
import { Plus, Pencil, Trash2, Briefcase } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore } from '../../store/cvStore';
import type { Experience } from '../../types/cv.types';

function fmt(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  const M = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
  return `${M[+m - 1]} ${y}`;
}

// function empty(): Experience {
//   return {
//     id: crypto.randomUUID(),
//     company: '', position: '', location: '',
//     startDate: '', endDate: '', current: false, description: '',
//   };
// }
function empty(): Experience {
  return {
    id: Math.random().toString(36).slice(2),
    company: '', position: '', location: '',
    startDate: '', endDate: '', current: false, description: '',
  };
}

/* ── Scrolle vers le haut du panneau .ed-panel-body ──
   C'est ce conteneur qui a overflow-y: auto, pas la page entière */
function scrollPanelToTop() {
  setTimeout(() => {
    const panel = document.querySelector('.ed-panel-body');
    if (panel) panel.scrollTop = 0;
  }, 80);
}

/* ── Card ── */
function ExpCard({ exp, onEdit, onDelete }: {
  exp: Experience; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <motion.div
      layout
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      exit={{ opacity: 0, y: -8 }}
      className="item-card"
    >
      <div className="item-card-bar" />
      <div className="item-card-body">
        <div className="item-card-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="item-card-title" style={{ overflow: 'hidden', textOverflow: 'ellipsis', whiteSpace: 'nowrap' }}>
              {exp.position || '—'}
            </p>
            <p className="item-card-sub">
              {exp.company}
              {exp.location && <span style={{ color: 'var(--muted)' }}> · {exp.location}</span>}
            </p>
            <p className="item-card-date" style={{ marginTop: 4 }}>
              {fmt(exp.startDate)} — {exp.current ? "Aujourd'hui" : fmt(exp.endDate)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button className="icon-btn" onClick={onEdit} title="Modifier"><Pencil size={11} /></button>
            <button className="icon-btn icon-btn--danger" onClick={onDelete} title="Supprimer"><Trash2 size={11} /></button>
          </div>
        </div>
        {exp.description && (
          <p className="item-card-desc" style={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
            {exp.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Formulaire ── */
function ExpForm({ initial, onSave, onCancel }: {
  initial: Experience; onSave: (e: Experience) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<Experience>(initial);
  const set = (k: keyof Experience, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));
  const valid = form.position.trim() && form.company.trim() && form.startDate;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label" htmlFor="exp-position">Poste <span className="required">*</span></label>
          <input id="exp-position" className="form-input" value={form.position}
            onChange={e => set('position', e.target.value)}
            placeholder="Chef de projet, Développeur..." autoFocus />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="exp-company">Entreprise <span className="required">*</span></label>
          <input id="exp-company" className="form-input" value={form.company}
            onChange={e => set('company', e.target.value)}
            placeholder="Google, CHU de Lyon, Freelance..." />
        </div>
      </div>

      <div className="form-field">
        <label className="form-label" htmlFor="exp-location">Lieu</label>
        <input id="exp-location" className="form-input" value={form.location}
          onChange={e => set('location', e.target.value)}
          placeholder="Paris · Télétravail · France" />
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label" htmlFor="exp-start">Début <span className="required">*</span></label>
          <input id="exp-start" type="month" className="form-input" value={form.startDate}
            onChange={e => set('startDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="exp-end">Fin</label>
          <input id="exp-end" type="month" className="form-input" value={form.endDate}
            disabled={form.current} style={{ opacity: form.current ? 0.3 : 1 }}
            onChange={e => set('endDate', e.target.value)} />
        </div>
      </div>

      <label className="form-check">
        <input type="checkbox" checked={form.current} onChange={e => {
          set('current', e.target.checked);
          if (e.target.checked) set('endDate', '');
        }} />
        <span>Poste actuel — je travaille encore ici</span>
      </label>

      <div className="form-field">
        <label className="form-label" htmlFor="exp-desc">Description des missions</label>
        <textarea id="exp-desc" className="form-textarea" rows={4} value={form.description}
          onChange={e => set('description', e.target.value)}
          placeholder="Décrivez vos principales missions..." />
        <p className="form-helper">Astuce : chiffrez vos résultats (+30% de CA, équipe de 8 personnes...)</p>
      </div>

      <div style={{ display: 'flex', gap: 8, paddingTop: 4 }}>
        <button onClick={onCancel} style={{
          padding: '9px 16px', background: 'var(--card)', border: '1px solid var(--border-md)',
          borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 600, color: 'var(--ash)', cursor: 'pointer',
        }}>Annuler</button>
        <button disabled={!valid} onClick={() => { if (valid) onSave(form); }} style={{
          flex: 1, padding: '9px 0', background: 'var(--acid)', color: '#000',
          borderRadius: 'var(--r-md)', fontSize: 13, fontWeight: 700,
          cursor: valid ? 'pointer' : 'not-allowed', opacity: valid ? 1 : 0.35, border: 'none',
        }}>Enregistrer</button>
      </div>
    </div>
  );
}

/* ── Principal ── */
export default function StepExperience() {
  const { cvData, addExperience, updateExperience, removeExperience } = useCVStore();
  const [editing, setEditing] = useState<string | null>(null);

  const openForm = (id: string) => {
    setEditing(id);
    scrollPanelToTop(); // Scrolle le .ed-panel-body vers le haut sur mobile
  };

  const handleSave = (exp: Experience) => {
    if (editing === 'new') addExperience(exp);
    else updateExperience(exp.id, exp);
    setEditing(null);
    scrollPanelToTop();
  };

  const editingExp = editing === 'new'
    ? empty()
    : cvData.experiences.find(e => e.id === editing);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AnimatePresence mode="wait">

        {!editing ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="list-header">
              <p className="list-count">
                {cvData.experiences.length === 0
                  ? 'Du plus récent au plus ancien.'
                  : `${cvData.experiences.length} expérience${cvData.experiences.length > 1 ? 's' : ''}`}
              </p>
              <button className="btn-add" onClick={() => openForm('new')}>
                <Plus size={13} strokeWidth={2.5} /> Ajouter
              </button>
            </div>

            {cvData.experiences.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><Briefcase size={20} strokeWidth={1.5} /></div>
                <p className="empty-title">Aucune expérience</p>
                <p className="empty-sub">Commencez par votre poste le plus récent</p>
                <button className="btn-add" onClick={() => openForm('new')}>
                  <Plus size={13} /> Ajouter une expérience
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <AnimatePresence>
                  {cvData.experiences.map(exp => (
                    <ExpCard key={exp.id} exp={exp}
                      onEdit={() => openForm(exp.id)}
                      onDelete={() => removeExperience(exp.id)} />
                  ))}
                </AnimatePresence>
              </div>
            )}
          </motion.div>

        ) : (
          <motion.div key="form"
            initial={{ opacity: 0, y: 10 }}
            animate={{ opacity: 1, y: 0 }}
            exit={{ opacity: 0, y: -10 }}
          >
            <p className="form-sub-head">
              {editing === 'new' ? 'Nouvelle expérience' : "Modifier l'expérience"}
            </p>
            {editingExp && (
              <ExpForm initial={editingExp} onSave={handleSave} onCancel={() => {
                setEditing(null);
                scrollPanelToTop();
              }} />
            )}
          </motion.div>
        )}

      </AnimatePresence>
    </div>
  );
}