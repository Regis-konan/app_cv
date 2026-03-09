import { useState, useRef } from 'react';
import { Plus, X, Globe, Zap } from 'lucide-react';
import { motion, AnimatePresence } from 'framer-motion';
import { useCVStore } from '../../store/cvStore';
import type { Language } from '../../types/cv.types';

const LANG_LEVELS: Language['level'][] = [
  'Débutant', 'Intermédiaire', 'Avancé', 'Courant', 'Natif',
];

const SUGGESTIONS = [
  'Microsoft Office', 'Excel', 'Word', 'PowerPoint',
  'Figma', 'Photoshop', 'Illustrator', 'After Effects',
  'React', 'TypeScript', 'JavaScript', 'Node.js', 'Python',
  'SQL', 'Docker', 'Git', 'AWS', 'Kubernetes',
  'Google Analytics', 'SEO', 'SEA', 'HubSpot', 'Salesforce',
  'Gestion de projet', 'Agile / Scrum', 'Management', 'Communication',
  'Notion', 'Jira', 'Slack', 'Trello', 'AutoCAD',
];

// Générateur d'ID compatible HTTP + HTTPS + iOS + Android
function genId(): string {
  return Math.random().toString(36).slice(2) + Math.random().toString(36).slice(2);
}

export default function StepSkills() {
  const {
    cvData,
    addSkill, removeSkill,
    addLanguage, updateLanguage, removeLanguage,
  } = useCVStore();

  const [newSkill, setNewSkill] = useState('');
  const [showSug, setShowSug] = useState(false);

  const clickingSuggestion = useRef(false);

  const filtered = SUGGESTIONS.filter(s =>
    newSkill.length > 0 &&
    s.toLowerCase().includes(newSkill.toLowerCase()) &&
    !cvData.skills.some(sk => sk.name.toLowerCase() === s.toLowerCase())
  );

  const addByName = (name: string) => {
    const trimmed = name.trim();
    if (!trimmed) return;
    if (cvData.skills.some(s => s.name.toLowerCase() === trimmed.toLowerCase())) return;
    addSkill({ id: genId(), name: trimmed, level: 3 });
    setNewSkill('');
    setShowSug(false);
  };

  const handleBlur = () => {
    if (clickingSuggestion.current) return;
    setShowSug(false);
  };

  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 28 }}>

      {/* ── Compétences ── */}
      <div>
        <p className="form-section-title">Compétences</p>
        <p style={{ fontSize: 11, color: 'var(--ash)', marginBottom: 12, lineHeight: 1.6 }}>
          Affichées en tags sur votre CV. Ajoutez vos outils, logiciels, méthodes, soft skills.
        </p>

        <div style={{ display: 'flex', gap: 8, marginBottom: 14 }}>
          <div className="suggestions-wrap" style={{ flex: 1, position: 'relative' }}>
            <input
              className="form-input"
              value={newSkill}
              onChange={e => { setNewSkill(e.target.value); setShowSug(true); }}
              onFocus={() => setShowSug(true)}
              onBlur={handleBlur}
              onKeyDown={e => {
                if (e.key === 'Enter') { e.preventDefault(); addByName(newSkill); }
              }}
              placeholder="Figma, React, Management..."
            />

            {showSug && filtered.length > 0 && (
              <div className="suggestions-box">
                {filtered.slice(0, 7).map(s => (
                  <button
                    key={s}
                    className="suggestion-item"
                    onMouseDown={() => {
                      clickingSuggestion.current = true;
                      addByName(s);
                      clickingSuggestion.current = false;
                    }}
                    onTouchEnd={e => {
                      e.preventDefault();
                      addByName(s);
                    }}
                  >
                    {s}
                  </button>
                ))}
              </div>
            )}
          </div>

          <button
            disabled={!newSkill.trim()}
            onMouseDown={e => e.preventDefault()}
            onClick={() => addByName(newSkill)}
            className="btn-add"
          >
            <Plus size={13} strokeWidth={2.5} /> Ajouter
          </button>
        </div>

        {cvData.skills.length === 0 ? (
          <div className="empty-state">
            <div className="empty-icon"><Zap size={18} strokeWidth={1.5} /></div>
            <p className="empty-title">Aucune compétence</p>
            <p className="empty-sub">Tapez une compétence et appuyez Entrée</p>
          </div>
        ) : (
          <>
            <div style={{
              display: 'flex', flexWrap: 'wrap', gap: 6, marginBottom: 14,
              padding: '10px 12px', background: 'var(--bg)',
              borderRadius: 'var(--r-md)', border: '1px solid var(--border-sm)',
            }}>
              <span style={{ fontSize: 10, color: 'var(--muted)', width: '100%', marginBottom: 2 }}>
                Aperçu sur le CV :
              </span>
              {cvData.skills.map(s => (
                <span key={s.id} style={{
                  fontSize: 11, color: '#444', background: '#f0f0f0',
                  border: '1px solid #e0e0e0', padding: '3px 10px', borderRadius: 99,
                }}>
                  {s.name}
                </span>
              ))}
            </div>

            <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
              <AnimatePresence>
                {cvData.skills.map(skill => (
                  <motion.div
                    key={skill.id}
                    layout
                    initial={{ opacity: 0, x: -8 }}
                    animate={{ opacity: 1, x: 0 }}
                    exit={{ opacity: 0, x: 8 }}
                    className="skill-row"
                  >
                    <span className="skill-name">{skill.name}</span>
                    <button
                      className="skill-remove"
                      onClick={() => removeSkill(skill.id)}
                      title="Supprimer"
                    >
                      <X size={11} />
                    </button>
                  </motion.div>
                ))}
              </AnimatePresence>
            </div>
          </>
        )}
      </div>

      <div className="form-divider" />

      {/* ── Langues ── */}
      <div>
        <p className="form-section-title">Langues</p>
        <p style={{ fontSize: 11, color: 'var(--ash)', marginBottom: 12, lineHeight: 1.6 }}>
          Affichées avec le niveau sur votre CV.
        </p>

        <div style={{ display: 'flex', flexDirection: 'column', gap: 8, marginBottom: 12 }}>
          <AnimatePresence>
            {cvData.languages.map(lang => (
              <motion.div
                key={lang.id}
                layout
                initial={{ opacity: 0, y: 6 }}
                animate={{ opacity: 1, y: 0 }}
                exit={{ opacity: 0, y: -6 }}
                className="lang-row"
              >
                <input
                  className="form-input"
                  value={lang.name}
                  onChange={e => updateLanguage?.(lang.id, { name: e.target.value })}
                  placeholder="Français, Anglais, Espagnol..."
                />
                <select
                  className="form-select"
                  value={lang.level}
                  onChange={e => updateLanguage?.(lang.id, { level: e.target.value as Language['level'] })}
                >
                  {LANG_LEVELS.map(l => <option key={l} value={l}>{l}</option>)}
                </select>
                <button
                  onClick={() => removeLanguage?.(lang.id)}
                  style={{
                    width: 32, height: 40, display: 'flex', alignItems: 'center',
                    justifyContent: 'center', borderRadius: 8, color: 'var(--muted)',
                    flexShrink: 0, background: 'none', border: 'none',
                    cursor: 'pointer', transition: 'color .15s',
                  }}
                  onMouseEnter={e => (e.currentTarget.style.color = 'var(--danger)')}
                  onMouseLeave={e => (e.currentTarget.style.color = 'var(--muted)')}
                >
                  <X size={14} />
                </button>
              </motion.div>
            ))}
          </AnimatePresence>
        </div>

        <button
          className="btn-add-lang"
          onClick={() => addLanguage?.({
            id: genId(),
            name: '',
            level: 'Intermédiaire',
          })}
        >
          <Globe size={13} /> Ajouter une langue
        </button>
      </div>

    </div>
  );
}