import { useId, useState } from 'react';

interface ColorPickerProps {
  label: string;
  value: string;
  onChange: (color: string) => void;
}

// ──────────────────── LISTE DES COULEURS SOLO ────────────────────
// Couleurs uniques avec leur nom
const SOLO = [
  // Ultra Dark
  { hex: '#080B14', name: 'Abyssal' },
  { hex: '#0F0A1E', name: 'Void' },
  { hex: '#0A1628', name: 'Deep Sea' },
  { hex: '#0C0A18', name: 'Cosmos' },
  // Gemmes
  { hex: '#1B0045', name: 'Tanzanite' },
  { hex: '#004B40', name: 'Malachite' },
  { hex: '#6A0032', name: 'Rubis' },
  { hex: '#00294D', name: 'Saphir' },
  { hex: '#003828', name: 'Jade' },
  { hex: '#3D001F', name: 'Grenat' },
  // Électrique
  { hex: '#003FFF', name: 'Klein' },
  { hex: '#5500FF', name: 'Plasma' },
  { hex: '#7600BC', name: 'UV' },
  { hex: '#C8000A', name: 'Ferrari' },
  { hex: '#009473', name: 'Viridian' },
  { hex: '#0099CC', name: 'Curaçao' },
  // Éditorial
  { hex: '#1A1A2E', name: 'Minuit' },
  { hex: '#2C2C3E', name: 'Carbone' },
  { hex: '#1E2A20', name: 'Forêt' },
  { hex: '#2A1F2D', name: 'Prune' },
  { hex: '#1C1917', name: 'Asphalte' },
  { hex: '#3B3229', name: 'Truffe' },
  // Luxe
  { hex: '#8B6914', name: 'Or ancien' },
  { hex: '#5C3D1E', name: 'Cognac' },
  { hex: '#704214', name: 'Bronze' },
  { hex: '#4A3728', name: 'Havane' },
];

// ──────────────────── COMBOS DE COULEURS ────────────────────
// Paires de couleurs qui vont bien ensemble
const COMBOS: {
  name: string;
  desc: string;
  primary: string;  // Couleur principale à utiliser
  accent: string;   // Couleur d'accent pour l'aperçu
  vibe: string;     // Style/ambiance suggéré
}[] = [
  { name: 'Onyx & Klein',      primary: '#080B14', accent: '#003FFF', desc: 'Ultra sombre × bleu électrique', vibe: 'Tech / Fintech' },
  { name: 'Forêt & Or',        primary: '#003828', accent: '#8B6914', desc: 'Vert profond × or ancien',        vibe: 'Prestige / Bio' },
  { name: 'Void & UV',         primary: '#0F0A1E', accent: '#7600BC', desc: 'Noir absolu × ultraviolet',       vibe: 'Créatif / Studio' },
  { name: 'Rubis & Carbone',   primary: '#6A0032', accent: '#2C2C3E', desc: 'Bordeaux intense × ardoise',      vibe: 'Luxe / Juridique' },
  { name: 'Saphir & Platine',  primary: '#00294D', accent: '#C8C8D4', desc: 'Bleu marine × argent froid',      vibe: 'Finance / Conseil' },
  { name: 'Plasma & Minuit',   primary: '#5500FF', accent: '#1A1A2E', desc: 'Violet plasma × nuit profonde',   vibe: 'Digital / Agence' },
  { name: 'Jade & Truffe',     primary: '#003828', accent: '#3B3229', desc: 'Jade impérial × brun chaud',      vibe: 'Design / Éditorial' },
  { name: 'Lave & Cosmos',     primary: '#7C1C00', accent: '#0C0A18', desc: 'Rouge lave × noir cosmos',        vibe: 'Art / Cinéma' },
  { name: 'Tanzanite & Or',    primary: '#1B0045', accent: '#8B6914', desc: 'Violet nuit × or oxydé',          vibe: 'Luxe / Stratégie' },
  { name: 'Ferrari & Asphalte',primary: '#C8000A', accent: '#1C1917', desc: 'Rouge vif × asphalte chaud',      vibe: 'Ingénierie / Sport' },
  { name: 'Malachite & Bois',  primary: '#004B40', accent: '#5C3D1E', desc: 'Vert gemme × cognac',             vibe: 'Architecture / Nature' },
  { name: 'Deep Sea & Curaçao',primary: '#0A1628', accent: '#0099CC', desc: 'Abyssal × cyan clair',             vibe: 'Maritime / Science' },
];

// ──────────────────── COMPOSANT SWATCH (CERCLE COULEUR) ────────────────────
// Affiche un petit cercle de couleur cliquable
function Swatch({ color, name, isActive, onClick }: {
  color: string; name: string; isActive: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      title={`${name}  ${color}`}
      aria-label={name}
      style={{
        width: 28, height: 28, borderRadius: '50%',
        background: color, cursor: 'pointer', flexShrink: 0,
        border: isActive ? '2.5px solid white' : '1.5px solid rgba(0,0,0,0.1)',
        boxShadow: isActive
          ? `0 0 0 2px ${color}, 0 4px 14px rgba(0,0,0,0.3)`
          : '0 1px 4px rgba(0,0,0,0.18)',
        transition: 'transform 0.12s',
      }}
      // Effet au survol
      onMouseEnter={e => { e.currentTarget.style.transform = 'scale(1.2)'; }}
      onMouseLeave={e => { e.currentTarget.style.transform = 'scale(1)'; }}
    />
  );
}

// ──────────────────── COMPOSANT COMBO CARD ────────────────────
// Affiche une carte pour chaque combo de couleurs
function ComboCard({ combo, isActive, onClick }: {
  combo: typeof COMBOS[0]; isActive: boolean; onClick: () => void;
}) {
  return (
    <button
      onClick={onClick}
      style={{
        display: 'flex', alignItems: 'center', gap: 10,
        padding: '9px 12px', borderRadius: 10, cursor: 'pointer',
        border: isActive ? `1.5px solid ${combo.primary}` : '1.5px solid #ebebeb',
        background: isActive ? `${combo.primary}08` : 'white',
        boxShadow: isActive ? `0 2px 12px ${combo.primary}22` : '0 1px 4px rgba(0,0,0,0.06)',
        transition: 'all 0.15s', width: '100%', textAlign: 'left',
      }}
      // Effet au survol
      onMouseEnter={e => { e.currentTarget.style.boxShadow = `0 4px 16px ${combo.primary}30`; }}
      onMouseLeave={e => { e.currentTarget.style.boxShadow = isActive ? `0 2px 12px ${combo.primary}22` : '0 1px 4px rgba(0,0,0,0.06)'; }}
    >
      {/* Aperçu des deux couleurs côte à côte */}
      <div style={{ display: 'flex', flexShrink: 0, position: 'relative', width: 42, height: 28 }}>
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: combo.primary, border: '2px solid white', position: 'absolute', left: 0, zIndex: 2, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
        <div style={{ width: 28, height: 28, borderRadius: '50%', background: combo.accent, border: '2px solid white', position: 'absolute', left: 14, zIndex: 1, boxShadow: '0 1px 4px rgba(0,0,0,0.2)' }} />
      </div>
      
      {/* Infos du combo */}
      <div style={{ flex: 1, minWidth: 0 }}>
        <div style={{ fontSize: 12, fontWeight: 700, color: '#111', lineHeight: 1.2 }}>{combo.name}</div>
        <div style={{ fontSize: 10, color: '#888', marginTop: 1, lineHeight: 1.3 }}>{combo.desc}</div>
      </div>
      
      {/* Tag de style */}
      <div style={{
        fontSize: 9, fontWeight: 600, color: combo.primary,
        background: `${combo.primary}12`, padding: '2px 7px', borderRadius: 20,
        whiteSpace: 'nowrap', flexShrink: 0,
      }}>
        {combo.vibe}
      </div>
    </button>
  );
}

// ──────────────────── COMPOSANT PRINCIPAL ────────────────────
// Sélecteur de couleur avec onglets Combos/Solo
type Tab = 'combos' | 'solo';

export const ColorPicker = ({ label, value, onChange }: ColorPickerProps) => {
  const uid = useId();  // ID unique pour les champs
  const [tab, setTab] = useState<Tab>('combos');

  // Vérifie si la couleur actuelle est dans nos listes
  const foundSolo = SOLO.find(c => c.hex.toLowerCase() === value.toLowerCase());
  const foundCombo = COMBOS.find(c => c.primary.toLowerCase() === value.toLowerCase());

  // Style des onglets (réutilisé)
  const TAB_STYLE = (active: boolean, color?: string) => ({
    padding: '5px 14px', borderRadius: 20, fontSize: 12, fontWeight: 600,
    cursor: 'pointer', border: 'none',
    background: active ? (color || '#111') : '#f3f4f6',
    color: active ? 'white' : '#666',
    transition: 'all 0.15s',
  });

  return (
    <div>
      {/* Label */}
      <label htmlFor={`ci-${uid}`} className="block text-sm font-medium text-gray-700 mb-2">
        {label}
      </label>

      {/* Ligne d'affichage de la couleur actuelle */}
      <div style={{ display: 'flex', alignItems: 'center', gap: 10, marginBottom: 14, padding: '8px 12px', background: '#f9f9f9', borderRadius: 10, border: '1px solid #ebebeb' }}>
        {/* Aperçu couleur */}
        <div style={{ width: 32, height: 32, borderRadius: 8, background: value, flexShrink: 0, boxShadow: '0 2px 8px rgba(0,0,0,0.18)' }} />
        
        {/* Sélecteur natif */}
        <input
          id={`ci-${uid}`}
          type="color"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ width: 30, height: 30, borderRadius: '50%', border: 'none', padding: 0, cursor: 'pointer', flexShrink: 0, background: 'transparent' }}
        />
        
        {/* Champ texte pour code hex */}
        <input
          type="text"
          value={value}
          onChange={e => onChange(e.target.value)}
          style={{ flex: 1, padding: '5px 8px', borderRadius: 7, border: '1px solid #e5e7eb', fontSize: 12, fontFamily: 'monospace', background: 'white' }}
          placeholder="#080B14"
        />
        
        {/* Nom de la couleur si trouvée */}
        {(foundSolo || foundCombo) && (
          <div style={{ fontSize: 11, fontWeight: 700, color: '#444', whiteSpace: 'nowrap' }}>
            {foundSolo?.name || foundCombo?.name}
          </div>
        )}
      </div>

      {/* Onglets */}
      <div style={{ display: 'flex', gap: 6, marginBottom: 12 }}>
        <button style={TAB_STYLE(tab === 'combos')} onClick={() => setTab('combos')}>
          ✦ Combos rares
        </button>
        <button style={TAB_STYLE(tab === 'solo')} onClick={() => setTab('solo')}>
          Couleurs solo
        </button>
      </div>

      {/* Contenu selon l'onglet sélectionné */}
      
      {/* Onglet Combos */}
      {tab === 'combos' && (
        <div style={{ display: 'flex', flexDirection: 'column', gap: 6 }}>
          {COMBOS.map(combo => (
            <ComboCard
              key={combo.primary}
              combo={combo}
              isActive={value.toLowerCase() === combo.primary.toLowerCase()}
              onClick={() => onChange(combo.primary)}
            />
          ))}
        </div>
      )}

      {/* Onglet Solo */}
      {tab === 'solo' && (
        <div style={{ display: 'flex', flexWrap: 'wrap', gap: 8 }}>
          {SOLO.map(({ hex, name }) => (
            <Swatch
              key={hex}
              color={hex}
              name={name}
              isActive={value.toLowerCase() === hex.toLowerCase()}
              onClick={() => onChange(hex)}
            />
          ))}
        </div>
      )}
    </div>
  );
};