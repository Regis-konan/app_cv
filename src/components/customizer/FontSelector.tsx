import { Check } from 'lucide-react';
import type { FontId } from '../../types/cv.types';

// ──────────────────── LISTE DES POLICES ────────────────────
// Toutes les polices disponibles avec leurs infos
const FONTS: {
  id: FontId;
  label: string;
  family: string;     // Nom de la police pour CSS
  tag: string;        // Style/ambiance
  preview: string;    // Description courte
  weight: number;     // Épaisseur pour l'aperçu "Aa"
}[] = [
  {
    id:      'jakarta',
    label:   'Jakarta',
    family:  'Plus Jakarta Sans, sans-serif',
    tag:     'Moderne',
    preview: 'Net, géométrique, polyvalent',
    weight:  700,
  },
  {
    id:      'fraunces',
    label:   'Fraunces',
    family:  'Fraunces, serif',
    tag:     'Élégant',
    preview: 'Chaleureux, littéraire, unique',
    weight:  600,
  },
  {
    id:      'syne',
    label:   'Syne',
    family:  'Syne, sans-serif',
    tag:     'Éditorial',
    preview: 'Graphique, audacieux, mémorable',
    weight:  800,
  },
  {
    id:      'dm-sans',
    label:   'DM Sans',
    family:  'DM Sans, sans-serif',
    tag:     'Lisible',
    preview: 'Doux, professionnel, clair',
    weight:  400,
  },
];

// ──────────────────── PROPS DU COMPOSANT ────────────────────
interface Props {
  value: FontId;              // Police actuellement sélectionnée
  onChange: (font: FontId) => void;  // Fonction appelée quand on change
  primaryColor?: string;       // Couleur principale pour le style (optionnelle)
}

// ──────────────────── COMPOSANT PRINCIPAL ────────────────────
// Sélecteur de police avec aperçu "Aa" et description
export default function FontSelector({ value, onChange, primaryColor = '#111' }: Props) {
  return (
    <div style={{ display: 'flex', flexDirection: 'column', gap: 7 }}>
      {FONTS.map((f) => {
        const active = value === f.id;  // Vérifie si cette police est sélectionnée
        
        return (
          <button
            key={f.id}
            onClick={() => onChange(f.id)}  // Au clic, on change la police
            style={{
              display: 'flex', alignItems: 'center', gap: 14,
              padding: '11px 14px', borderRadius: 12, cursor: 'pointer',
              // Style différent selon que c'est actif ou non
              border: active ? `1.5px solid ${primaryColor}` : '1.5px solid #ebebeb',
              background: active ? `${primaryColor}08` : 'white',
              boxShadow: active ? `0 2px 12px ${primaryColor}20` : '0 1px 4px rgba(0,0,0,0.05)',
              transition: 'all 0.15s', textAlign: 'left', width: '100%',
            }}
            // Effet au survol (change la couleur de bordure)
            onMouseEnter={e => {
              if (!active) e.currentTarget.style.borderColor = `${primaryColor}44`;
            }}
            onMouseLeave={e => {
              if (!active) e.currentTarget.style.borderColor = '#ebebeb';
            }}
          >
            {/* Grand "Aa" pour voir le style de la police */}
            <div style={{
              width: 52, flexShrink: 0, textAlign: 'center',
              fontSize: 34, lineHeight: 1,
              fontFamily: f.family,        // Utilise la police pour l'aperçu
              fontWeight: f.weight,         // Épaisseur spécifique à la police
              color: active ? primaryColor : '#1a1a1a',
              transition: 'color 0.15s',
              letterSpacing: -0.5,
            }}>
              Aa
            </div>

            {/* Petit séparateur vertical */}
            <div style={{ width: 1, height: 36, background: active ? `${primaryColor}25` : '#ebebeb', flexShrink: 0 }} />

            {/* Infos de la police (nom, tag, description) */}
            <div style={{ flex: 1, minWidth: 0 }}>
              {/* Ligne avec nom + tag */}
              <div style={{ display: 'flex', alignItems: 'center', gap: 7, marginBottom: 3 }}>
                <span style={{
                  fontSize: 13, fontWeight: 700, color: active ? primaryColor : '#111',
                  fontFamily: f.family, transition: 'color 0.15s',
                }}>
                  {f.label}
                </span>
                <span style={{
                  fontSize: 9, fontWeight: 600, letterSpacing: 0.8,
                  padding: '2px 7px', borderRadius: 20,
                  background: active ? `${primaryColor}15` : '#f3f4f6',
                  color: active ? primaryColor : '#888',
                  textTransform: 'uppercase', transition: 'all 0.15s',
                }}>
                  {f.tag}
                </span>
              </div>
              {/* Description */}
              <div style={{ fontSize: 10, color: '#aaa', fontStyle: 'italic' }}>{f.preview}</div>
            </div>

            {/* Coche de sélection */}
            <div style={{
              width: 20, height: 20, borderRadius: '50%', flexShrink: 0,
              display: 'flex', alignItems: 'center', justifyContent: 'center',
              background: active ? primaryColor : '#f0f0f0',
              transition: 'all 0.15s',
            }}>
              <Check
                size={10}
                strokeWidth={3}
                style={{ color: active ? 'white' : '#ccc' }}
              />
            </div>
          </button>
        );
      })}
    </div>
  );
}