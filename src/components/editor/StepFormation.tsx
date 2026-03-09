import { useState } from 'react';
import { Plus, Pencil, Trash2, GraduationCap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore } from '../../store/cvStore';
import type { Formation } from '../../types/cv.types';

const DEGREES = [
  'Baccalauréat', 'CAP / BEP', 'BTS / DUT', 'Licence', 'Bachelor',
  'Master', 'MBA', 'Doctorat', 'Certificat', 'Formation professionnelle', 'Autre',
];

function fmt(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  const M = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
  return `${M[+m - 1]} ${y}`;
}

function empty(): Formation {
  return {
    id:Math.random().toString(36).slice(2),
    school: '', degree: '', field: '',
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
function FormCard({ f, onEdit, onDelete }: {
  f: Formation; onEdit: () => void; onDelete: () => void;
}) {
  return (
    <motion.div layout
      initial={{ opacity: 0, y: 8 }} animate={{ opacity: 1, y: 0 }} exit={{ opacity: 0, y: -8 }}
      className="item-card"
    >
      <div className="item-card-bar item-card-bar--green" />
      <div className="item-card-body">
        <div className="item-card-header">
          <div style={{ flex: 1, minWidth: 0 }}>
            <p className="item-card-title">{f.degree}{f.field ? ` · ${f.field}` : ''}</p>
            <p className="item-card-sub">{f.school || '—'}</p>
            <p className="item-card-date" style={{ marginTop: 4 }}>
              {fmt(f.startDate)}{f.startDate && ' — '}{f.current ? 'En cours' : fmt(f.endDate)}
            </p>
          </div>
          <div style={{ display: 'flex', gap: 4, flexShrink: 0 }}>
            <button className="icon-btn" onClick={onEdit} title="Modifier"><Pencil size={11} /></button>
            <button className="icon-btn icon-btn--danger" onClick={onDelete} title="Supprimer"><Trash2 size={11} /></button>
          </div>
        </div>
        {f.description && (
          <p className="item-card-desc" style={{ overflow: 'hidden', display: '-webkit-box', WebkitBoxOrient: 'vertical', WebkitLineClamp: 2 }}>
            {f.description}
          </p>
        )}
      </div>
    </motion.div>
  );
}

/* ── Formulaire ── */
function FormForm({ initial, onSave, onCancel }: {
  initial: Formation; onSave: (f: Formation) => void; onCancel: () => void;
}) {
  const [form, setForm] = useState<Formation>(initial);
  const set = (k: keyof Formation, v: string | boolean) =>
    setForm(f => ({ ...f, [k]: v }));
  const valid = form.school.trim() && form.degree.trim() && form.startDate;

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 14 }}>
      <div className="form-field">
        <label className="form-label" htmlFor="fo-school">Établissement <span className="required">*</span></label>
        <input id="fo-school" className="form-input" value={form.school}
          onChange={e => set('school', e.target.value)}
          placeholder="HEC Paris, Université Lyon 1, École 42..." autoFocus />
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label" htmlFor="fo-degree">Diplôme <span className="required">*</span></label>
          <select id="fo-degree" className="form-select" value={form.degree}
            onChange={e => set('degree', e.target.value)}>
            <option value="">Sélectionner...</option>
            {DEGREES.map(d => <option key={d} value={d}>{d}</option>)}
          </select>
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="fo-field">Spécialité / Filière</label>
          <input id="fo-field" className="form-input" value={form.field}
            onChange={e => set('field', e.target.value)}
            placeholder="Marketing Digital, Génie Civil..." />
        </div>
      </div>

      <div className="form-grid-2">
        <div className="form-field">
          <label className="form-label" htmlFor="fo-start">Début <span className="required">*</span></label>
          <input id="fo-start" type="month" className="form-input" value={form.startDate}
            onChange={e => set('startDate', e.target.value)} />
        </div>
        <div className="form-field">
          <label className="form-label" htmlFor="fo-end">Fin</label>
          <input id="fo-end" type="month" className="form-input" value={form.endDate}
            disabled={form.current} style={{ opacity: form.current ? 0.3 : 1 }}
            onChange={e => set('endDate', e.target.value)} />
        </div>
      </div>

      <label className="form-check">
        <input type="checkbox" checked={form.current} onChange={e => {
          set('current', e.target.checked);
          if (e.target.checked) set('endDate', '');
        }} />
        <span>Formation en cours</span>
      </label>

      <div className="form-field">
        <label className="form-label" htmlFor="fo-desc">
          Description <span style={{ opacity: 0.5, fontWeight: 400 }}>(optionnel)</span>
        </label>
        <p className="form-helper" style={{ marginBottom: 5 }}>
          Mention, spécialisation, projets marquants, note obtenue...
        </p>
        <textarea id="fo-desc" className="form-textarea" rows={3}
          value={form.description ?? ''}
          onChange={e => set('description', e.target.value)}
          placeholder="Mention Bien · Major de promotion..." />
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
export default function StepFormation() {
  const { cvData, addFormation, updateFormation, removeFormation } = useCVStore();
  const [editing, setEditing] = useState<string | null>(null);

  const openForm = (id: string) => {
    setEditing(id);
    scrollPanelToTop(); // Scrolle le .ed-panel-body vers le haut sur mobile
  };

  const handleSave = (f: Formation) => {
    if (editing === 'new') addFormation(f);
    else updateFormation(f.id, f);
    setEditing(null);
    scrollPanelToTop();
  };

  const editingF = editing === 'new'
    ? empty()
    : cvData.formations.find(f => f.id === editing);

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 20 }}>
      <AnimatePresence mode="wait">

        {!editing ? (
          <motion.div key="list" initial={{ opacity: 0 }} animate={{ opacity: 1 }} exit={{ opacity: 0 }}>
            <div className="list-header">
              <p className="list-count">
                {cvData.formations.length === 0
                  ? 'Du plus récent au plus ancien.'
                  : `${cvData.formations.length} formation${cvData.formations.length > 1 ? 's' : ''}`}
              </p>
              <button className="btn-add" onClick={() => openForm('new')}>
                <Plus size={13} strokeWidth={2.5} /> Ajouter
              </button>
            </div>

            {cvData.formations.length === 0 ? (
              <div className="empty-state">
                <div className="empty-icon"><GraduationCap size={20} strokeWidth={1.5} /></div>
                <p className="empty-title">Aucune formation</p>
                <p className="empty-sub">Commencez par le diplôme le plus récent</p>
                <button className="btn-add" onClick={() => openForm('new')}>
                  <Plus size={13} /> Ajouter une formation
                </button>
              </div>
            ) : (
              <div style={{ display: 'flex', flexDirection: 'column', gap: 8 }}>
                <AnimatePresence>
                  {cvData.formations.map(f => (
                    <FormCard key={f.id} f={f}
                      onEdit={() => openForm(f.id)}
                      onDelete={() => removeFormation(f.id)} />
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
              {editing === 'new' ? 'Nouvelle formation' : 'Modifier la formation'}
            </p>
            {editingF && (
              <FormForm initial={editingF} onSave={handleSave} onCancel={() => {
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