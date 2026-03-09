import { Check } from 'lucide-react';
import { useCVStore } from '../../store/cvStore';
import FontSelector from '../customizer/FontSelector';
import { ColorPicker } from '../customizer/ColorPicker';
import type { TemplateId, SpacingId } from '../../types/cv.types';

const TEMPLATES: { id: TemplateId; label: string; tag: string }[] = [
  { id: 'student',   label: 'Étudiant',  tag: 'Jeune diplômé' },
  { id: 'tech',      label: 'Tech',      tag: 'Informatique'  },
  { id: 'business',  label: 'Business',  tag: 'Direction'     },
  { id: 'health',    label: 'Santé',     tag: 'Social'        },
  { id: 'industry',  label: 'Industrie', tag: 'BTP/Technique' },
  { id: 'marketing', label: 'Marketing', tag: 'Créatif'       },
];

const SPACINGS: { id: SpacingId; label: string; desc: string; bars: number[] }[] = [
  { id: 'compact', label: 'Compact',   desc: 'Plus de contenu visible', bars: [2,2,2,2,2] },
  { id: 'normal',  label: 'Équilibré', desc: 'Recommandé',              bars: [2,0,2,0,2] },
  { id: 'relaxed', label: 'Aéré',      desc: 'Espaces généreux',        bars: [2,0,0,2]   },
];

const DEFAULT_TEMPLATE_COLORS: Record<TemplateId, string> = {
  student:   '#4A90E2',
  tech:      '#58A6FF',
  business:  '#C9A959',
  health:    '#52B788',
  industry:  '#9C6644',
  marketing: '#E63946',
};

/* ─────────────────────────────────────────────────────────────
   MINIATURES SVG — fidèles aux vrais layouts
───────────────────────────────────────────────────────────── */
function TemplateMini({ id, color }: { id: TemplateId; color: string }) {

  /* ── STUDENT : sidebar gauche colorée · photo ronde · main blanche ── */
  if (id === 'student') return (
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      {/* Sidebar colorée */}
      <rect width="42" height="168" fill={color} />
      {/* Photo ronde centrée */}
      <circle cx="21" cy="28" r="14" fill="rgba(255,255,255,0.2)" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
      <circle cx="21" cy="24" r="7" fill="rgba(255,255,255,0.45)"/>
      <ellipse cx="21" cy="35" rx="9" ry="5" fill="rgba(255,255,255,0.3)"/>
      {/* Nom sidebar */}
      <rect x="7" y="50" width="28" height="3.5" rx="1.5" fill="rgba(255,255,255,0.75)"/>
      <rect x="9" y="56" width="24" height="2.5" rx="1"   fill="rgba(255,255,255,0.4)"/>
      <rect x="7" y="65" width="14" height="1.5" rx="1"   fill="rgba(255,255,255,0.25)"/>
      {/* Skills tags pills blancs */}
      {[74,81,88,95,102,109,116].map((y,i) => (
        <rect key={y} x="7" y={y} width={[28,22,26,20,28,24,18][i]} height="5" rx="2.5"
          fill="rgba(255,255,255,0.14)" stroke="rgba(255,255,255,0.28)" strokeWidth="0.5"/>
      ))}
      {/* Main blanche */}
      <rect x="42" width="88" height="168" fill="white"/>
      {/* Header */}
      <rect x="50" y="12" width="56" height="6"   rx="2"   fill="#1a1a1a"/>
      <rect x="50" y="21" width="22" height="2.5" rx="1"   fill={color} opacity="0.7"/>
      <rect x="42" y="28" width="88" height="1"           fill={color} opacity="0.12"/>
      {/* Section titre avec cercle coloré */}
      <circle cx="52" cy="37" r="5" fill={color}/>
      <rect x="62" y="34.5" width="24" height="5" rx="2" fill="#333"/>
      <rect x="50" y="45" width="72" height="2.5" rx="1" fill="#eee"/>
      <rect x="50" y="51" width="60" height="2.5" rx="1" fill="#eee"/>
      <rect x="50" y="57" width="68" height="2.5" rx="1" fill="#eee"/>
      {/* Section 2 */}
      <circle cx="52" cy="69" r="5" fill={color}/>
      <rect x="62" y="66.5" width="30" height="5" rx="2" fill="#333"/>
      {/* Timeline items */}
      {[77,92,107].map(y => (
        <g key={y}>
          <circle cx="54" cy={y+2} r="3" fill={color}/>
          <rect x="60" y={y}   width="52" height="3.5" rx="1.5" fill={color} opacity="0.55"/>
          <rect x="60" y={y+6} width="62" height="2.5" rx="1"   fill="#e8e8e8"/>
          <rect x="60" y={y+11} width="54" height="2.5" rx="1"  fill="#e8e8e8"/>
        </g>
      ))}
    </svg>
  );

  /* ── TECH : header dark full-width · hexagone · 2 colonnes body ── */
  if (id === 'tech') return (
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="130" height="168" fill="#F8F9FA"/>
      {/* Header dark full-width */}
      <rect width="130" height="46" fill="#0D1117"/>
      {/* Grille points déco */}
      {[0,1,2,3,4,5].map(x => [0,1,2].map(y => (
        <circle key={`${x}${y}`} cx={8+x*22} cy={8+y*14} r="0.8" fill={color} opacity="0.3"/>
      )))}
      {/* Photo hexagone */}
      <polygon points="20,5 34,12 34,30 20,37 6,30 6,12" fill={color} opacity="0.25"/>
      <polygon points="20,5 34,12 34,30 20,37 6,30 6,12" fill="none" stroke={color} strokeWidth="1.2"/>
      <circle cx="20" cy="21" r="7" fill="rgba(255,255,255,0.15)"/>
      {/* Nom dans header */}
      <rect x="42" y="10" width="48" height="6"   rx="2"   fill="rgba(255,255,255,0.9)"/>
      <rect x="42" y="20" width="24" height="3"   rx="1.5" fill={color} opacity="0.8"/>
      <rect x="42" y="27" width="36" height="2.5" rx="1"   fill="rgba(255,255,255,0.3)"/>
      {/* Contacts header droite */}
      <rect x="96" y="10" width="28" height="2"   rx="1" fill="rgba(255,255,255,0.25)"/>
      <rect x="96" y="16" width="22" height="2"   rx="1" fill="rgba(255,255,255,0.2)"/>
      <rect x="96" y="22" width="26" height="2"   rx="1" fill="rgba(255,255,255,0.2)"/>
      {/* Barre accent */}
      <rect width="130" height="2" y="44" fill={color}/>
      {/* Colonne gauche — cards expé */}
      {[52,80,108].map(y => (
        <g key={y}>
          <rect x="6" y={y}   width="78" height="22" rx="3" fill="white" stroke="#eee" strokeWidth="0.5"/>
          <rect x="6" y={y}   width="3"  height="22" rx="1.5" fill={color}/>
          <rect x="13" y={y+4}  width="42" height="4"   rx="2" fill="#111" opacity="0.8"/>
          <rect x="13" y={y+11} width="28" height="3"   rx="1.5" fill={color} opacity="0.65"/>
          <rect x="13" y={y+17} width="56" height="2.5" rx="1"   fill="#e0e0e0"/>
        </g>
      ))}
      {/* Colonne droite sombre */}
      <rect x="88" y="46" width="42" height="122" fill="#161B22"/>
      {/* Skills monospace */}
      <rect x="92" y="52" width="30" height="2.5" rx="1" fill={color} opacity="0.6"/>
      {[58,64,70,76,82,88,94,100].map((y,i) => (
        <rect key={y} x="92" y={y} width={[30,24,28,22,30,26,20,28][i]} height="4" rx="1.5"
          fill={color} opacity="0.12" stroke={color} strokeWidth="0.5" strokeOpacity="0.45"/>
      ))}
      {/* Langues */}
      <rect x="92" y="112" width="30" height="2.5" rx="1" fill={color} opacity="0.6"/>
      {[119,127,135].map((y,i) => (
        <rect key={y} x="92" y={y} width={[34,28,32][i]} height="3" rx="1.5" fill="rgba(255,255,255,0.08)"/>
      ))}
    </svg>
  );

  /* ── BUSINESS : main gauche · sidebar DROITE noire · photo carré coin coupé ── */
  if (id === 'business') return (
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="130" height="168" fill="white"/>
      {/* Header nom */}
      <rect x="8" y="9"  width="14" height="2.5" rx="1"   fill="#ddd"/>
      <rect x="8" y="15" width="62" height="8"   rx="2"   fill="#1a1a1a"/>
      <rect x="8" y="26" width="56" height="7"   rx="2"   fill={color} opacity="0.85"/>
      <rect x="8" y="36" width="36" height="2.5" rx="1"   fill={color} opacity="0.35"/>
      <rect x="8" y="43" width="72" height="1"           fill={color} opacity="0.25"/>
      {/* Profil */}
      <rect x="8" y="49" width="38" height="2.5" rx="1" fill="#111" opacity="0.7"/>
      <rect x="8" y="53" width="72" height="0.5"         fill={color} opacity="0.25"/>
      {[57,62,67].map((y,i) => (
        <rect key={y} x="8" y={y} width={[70,62,66][i]} height="2.5" rx="1" fill="#eee"/>
      ))}
      {/* Expériences timeline */}
      <rect x="8" y="76" width="44" height="2.5" rx="1" fill="#111" opacity="0.7"/>
      <rect x="8" y="80" width="72" height="0.5"         fill={color} opacity="0.25"/>
      {[86,100,114].map(y => (
        <g key={y}>
          <rect x="8" y={y}   width="12" height="8" rx="1.5" fill="#f5f5f5"/>
          <circle cx="24" cy={y+4} r="3" fill={color} opacity="0.8"/>
          <rect x="29" y={y}   width="46" height="3.5" rx="1.5" fill="#111" opacity="0.65"/>
          <rect x="29" y={y+6} width="36" height="2.5" rx="1"   fill="#ddd"/>
        </g>
      ))}
      {/* Sidebar DROITE noire */}
      <rect x="88" width="42" height="168" fill="#1C1C1C"/>
      {/* Photo carré coin coupé */}
      <rect x="96" y="10" width="28" height="38" fill={color} opacity="0.2"/>
      <polygon points="116,10 124,10 124,18" fill={color} opacity="0.85"/>
      <circle cx="110" cy="29" r="11" fill={color} opacity="0.22"/>
      <circle cx="110" cy="25" r="6"  fill="rgba(255,255,255,0.28)"/>
      {/* Nom sidebar */}
      <rect x="93" y="55" width="30" height="3.5" rx="1.5" fill="rgba(255,255,255,0.7)"/>
      <rect x="95" y="62" width="24" height="2.5" rx="1"   fill={color} opacity="0.7"/>
      {/* Contact */}
      {[72,79,86,93].map((y,i) => (
        <rect key={y} x="93" y={y} width={[30,24,28,20][i]} height="2.5" rx="1" fill="rgba(255,255,255,0.18)"/>
      ))}
      {/* Skills tags */}
      {[104,110,116,122,128,134].map((y,i) => (
        <rect key={y} x="93" y={y} width={[28,22,26,18,24,20][i]} height="4.5" rx="2"
          fill="rgba(255,255,255,0.06)" stroke={color} strokeWidth="0.4" strokeOpacity="0.4"/>
      ))}
    </svg>
  );

  /* ── HEALTH : header coloré full-width · photo ronde dans header · 2 col body ── */
  if (id === 'health') return (
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="130" height="168" fill="white"/>
      {/* Header coloré */}
      <rect width="130" height="44" fill={color}/>
      {/* Photo ronde dans header */}
      <circle cx="24" cy="22" r="16" fill="rgba(255,255,255,0.18)" stroke="rgba(255,255,255,0.7)" strokeWidth="2"/>
      <circle cx="24" cy="18" r="8"  fill="rgba(255,255,255,0.4)"/>
      <ellipse cx="24" cy="29" rx="10" ry="6" fill="rgba(255,255,255,0.25)"/>
      {/* Nom dans header */}
      <rect x="46" y="10" width="50" height="7"   rx="2"   fill="rgba(255,255,255,0.9)"/>
      <rect x="46" y="21" width="34" height="3"   rx="1.5" fill="rgba(255,255,255,0.55)"/>
      {/* Contacts header droite */}
      <rect x="102" y="10" width="22" height="2" rx="1" fill="rgba(255,255,255,0.38)"/>
      <rect x="102" y="15" width="18" height="2" rx="1" fill="rgba(255,255,255,0.28)"/>
      <rect x="102" y="20" width="22" height="2" rx="1" fill="rgba(255,255,255,0.28)"/>
      {/* Transition */}
      <rect width="130" height="3" y="44" fill={color} opacity="0.28"/>
      {/* Colonne gauche */}
      {/* Section titre avec icône + */}
      {[54,96].map((y,si) => (
        <g key={y}>
          <circle cx="10" cy={y+3}   r="6" fill={color}/>
          <rect x="10" y={y+0.5} width="0.8" height="5" fill="white" transform={`translate(9.6,${y+1})`}/>
          <rect x="20" y={y+1} width={[28,32][si]} height="4.5" rx="2" fill="#222" opacity="0.8"/>
          <rect x="20" y={y+0.5} width="60" height="0.5" fill={color} opacity="0.18"/>
        </g>
      ))}
      {/* Timeline items */}
      {[63,75,105,117].map(y => (
        <g key={y}>
          <rect x="8"  y={y}   width="10" height="2"   rx="1"   fill="#ddd"/>
          <circle cx="22" cy={y+1} r="3" fill={color} opacity="0.7"/>
          <rect x="28" y={y}   width="48" height="3.5" rx="1.5" fill={color} opacity="0.55"/>
          <rect x="28" y={y+6} width="52" height="2.5" rx="1"   fill="#ececec"/>
        </g>
      ))}
      {/* Colonne droite grise */}
      <rect x="86" y="48" width="44" height="120" fill="#F7F9F8"/>
      <rect x="86" y="48" width="1"  height="120" fill="#eee"/>
      {/* Skills tags */}
      <rect x="90" y="56" width="30" height="2.5" rx="1" fill={color} opacity="0.7"/>
      {[63,69,75,81,87,93,99].map((y,i) => (
        <rect key={y} x="90" y={y} width={[26,20,28,22,24,18,26][i]} height="4.5" rx="2.2"
          fill="white" stroke={color} strokeWidth="0.5" strokeOpacity="0.5"/>
      ))}
      {/* Langues */}
      <rect x="90" y="110" width="30" height="2.5" rx="1" fill={color} opacity="0.7"/>
      {[117,125,133].map((y,i) => (
        <rect key={y} x="90" y={y} width={[34,28,32][i]} height="3" rx="1.5" fill="#e0e0e0"/>
      ))}
    </svg>
  );

  /* ── INDUSTRY : sidebar sombre gauche · photo pleine largeur · timeline cards ── */
  if (id === 'industry') return (
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="130" height="168" fill="#FAFAFA"/>
      {/* Sidebar sombre */}
      <rect width="42" height="168" fill="#1A1A1A"/>
      {/* Photo pleine largeur sidebar */}
      <rect width="42" height="52" fill="#2a2a2a"/>
      <circle cx="21" cy="26" r="15" fill={color} opacity="0.22"/>
      <circle cx="21" cy="21" r="8"  fill="rgba(255,255,255,0.28)"/>
      <ellipse cx="21" cy="32" rx="10" ry="6" fill="rgba(255,255,255,0.14)"/>
      {/* Trait coloré bas photo */}
      <rect width="42" height="2.5" y="50" fill={color}/>
      {/* Nom */}
      <rect x="5" y="57"  width="32" height="4"   rx="2"   fill="rgba(255,255,255,0.78)"/>
      <rect x="8" y="64"  width="26" height="2.5" rx="1"   fill={color} opacity="0.65"/>
      {/* Contact */}
      {[73,80,87].map((y,i) => (
        <g key={y}>
          <circle cx="9" cy={y+1.5} r="2" fill={color} opacity="0.55"/>
          <rect x="14" y={y} width={[24,20,26][i]} height="2.5" rx="1" fill="rgba(255,255,255,0.18)"/>
        </g>
      ))}
      {/* Formation sidebar */}
      <rect x="5" y="102" width="32" height="3"   rx="1.5" fill="rgba(255,255,255,0.14)"/>
      <rect x="5" y="108" width="26" height="2.5" rx="1"   fill={color} opacity="0.38)"/>
      <rect x="5" y="118" width="30" height="3"   rx="1.5" fill="rgba(255,255,255,0.1)"/>
      {/* Main */}
      <rect x="42" y="0"  width="88" height="26" fill="white"/>
      <rect x="50" y="6"  width="50" height="6"  rx="2" fill="#111"/>
      <rect x="50" y="15" width="30" height="3"  rx="1.5" fill="#aaa"/>
      <rect x="42" y="26" width="88" height="3"  fill={color}/>
      {/* Profil carte */}
      <rect x="48" y="34" width="74" height="12" rx="2" fill="white" stroke="#eee" strokeWidth="0.5"/>
      <rect x="48" y="34" width="4"  height="12" rx="2" fill={color}/>
      <rect x="56" y="37" width="58" height="2.5" rx="1" fill="#e0e0e0"/>
      <rect x="56" y="42" width="48" height="2.5" rx="1" fill="#e0e0e0"/>
      {/* Timeline */}
      <rect x="48" y="52" width="26" height="3" rx="1.5" fill={color} opacity="0.7"/>
      <rect x="72" y="58" width="1.5" height="84" fill={color} opacity="0.18"/>
      {[60,80,100,120].map(y => (
        <g key={y}>
          <rect x="48" y={y}   width="18" height="14" rx="2" fill="#f0f0f0"/>
          <rect x="50" y={y+3} width="14" height="2"  rx="1" fill="#bbb"/>
          <rect x="50" y={y+8} width="10" height="2"  rx="1" fill="#ccc"/>
          <circle cx="73" cy={y+7} r="3.5" fill={color}/>
          <rect x="79" y={y}   width="38" height="14" rx="2" fill="white" stroke="#eee" strokeWidth="0.5"/>
          <rect x="82" y={y+3} width="28" height="2.5" rx="1" fill="#333" opacity="0.7"/>
          <rect x="82" y={y+8} width="22" height="2"  rx="1" fill={color} opacity="0.55"/>
        </g>
      ))}
    </svg>
  );

  /* ── MARKETING : full-width · header sombre · profil quote · 3 colonnes bas ── */
  if (id === 'marketing') return (
    <svg viewBox="0 0 130 168" style={{ width:'100%', height:'100%', display:'block' }}>
      <rect width="130" height="168" fill="#FAF8F5"/>
      {/* Header sombre */}
      <rect width="130" height="44" fill="#1A1A1A"/>
      {/* Initiale watermark */}
      <text x="100" y="50" fontSize="54" fontWeight="900" fill="rgba(255,255,255,0.04)" fontFamily="serif">M</text>
      {/* Photo ronde */}
      <circle cx="18" cy="22" r="14" fill={color} opacity="0.22" stroke={color} strokeWidth="1.5"/>
      <circle cx="18" cy="18" r="7"  fill="rgba(255,255,255,0.28)"/>
      <ellipse cx="18" cy="28" rx="9" ry="5" fill="rgba(255,255,255,0.18)"/>
      {/* Nom */}
      <rect x="38" y="9"  width="16" height="2"   rx="1"   fill="rgba(255,255,255,0.22)"/>
      <rect x="38" y="14" width="46" height="7"   rx="2"   fill="rgba(255,255,255,0.85)"/>
      <rect x="38" y="24" width="34" height="3"   rx="1.5" fill={color} opacity="0.8"/>
      {/* Contacts droite */}
      <rect x="96" y="10" width="28" height="2" rx="1" fill="rgba(255,255,255,0.22)"/>
      <rect x="96" y="15" width="22" height="2" rx="1" fill="rgba(255,255,255,0.18)"/>
      <rect x="96" y="20" width="26" height="2" rx="1" fill="rgba(255,255,255,0.18)"/>
      <rect x="96" y="25" width="18" height="2" rx="1" fill="rgba(255,255,255,0.14)"/>
      {/* Bande colorée */}
      <rect width="130" height="3" y="44" fill={color}/>
      {/* Profil quote */}
      <rect x="6" y="52" width="3.5" height="14" rx="1.75" fill={color}/>
      <rect x="13" y="53" width="110" height="2.5" rx="1" fill="#bbb"/>
      <rect x="13" y="58" width="96"  height="2.5" rx="1" fill="#bbb"/>
      <rect x="13" y="63" width="104" height="2.5" rx="1" fill="#bbb"/>
      {/* Titre expé */}
      <rect x="6" y="73" width="26" height="2.5" rx="1" fill={color} opacity="0.8"/>
      <rect x="6" y="76" width="118" height="0.5"        fill={color} opacity="0.18"/>
      {/* Expériences full-width */}
      {[80,97,114].map(y => (
        <g key={y}>
          <rect x="6"  y={y}    width="18" height="11" rx="1.5" fill="#f0ebe3"/>
          <rect x="8"  y={y+2}  width="14" height="2"  rx="1"   fill="#bbb"/>
          <rect x="8"  y={y+6}  width="10" height="2"  rx="1"   fill={color} opacity="0.45"/>
          <rect x="28" y={y}    width="44" height="4"  rx="2"   fill="#111" opacity="0.65"/>
          <rect x="28" y={y+6}  width="90" height="2.5" rx="1"  fill="#ddd"/>
          <rect x="6"  y={y+13} width="118" height="0.5"        fill="#ede8e2"/>
        </g>
      ))}
      {/* 3 colonnes bas */}
      {[0,1,2].map(col => (
        <g key={col}>
          <rect x={6+col*42} y="131" width="30" height="2.5" rx="1" fill={color} opacity="0.7"/>
          {[137,143,149,155,161].map((y,i) => (
            <rect key={y} x={6+col*42} y={y} width={[28,22,26,20,24][i]} height="4.5" rx="2.2"
              fill="white" stroke="#ddd" strokeWidth="0.5"/>
          ))}
        </g>
      ))}
    </svg>
  );

  return null;
}

/* ─────────────────────────────────────────────────────────────
   COMPOSANT PRINCIPAL
───────────────────────────────────────────────────────────── */
export default function StepDesign() {
  const { cvData, updateDesign, initWithTemplate } = useCVStore();
  const { design } = cvData;

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* ── Templates ── */}
      <div>
        <p className="form-section-title">Template</p>
        <div className="template-grid">
          {TEMPLATES.map(t => {
            const active = design.template === t.id;
            const previewColor = active ? design.primaryColor : DEFAULT_TEMPLATE_COLORS[t.id];
            return (
              <button
                key={t.id}
                className={`template-card${active ? ' active' : ''}`}
                onClick={() => initWithTemplate(t.id)}
              >
                <div className="template-preview">
                  <TemplateMini id={t.id} color={previewColor} />
                </div>
                <div className="template-info">
                  <div>
                    <span className="template-name">{t.label}</span>
                    <span
                      className="template-tag"
                      style={{
                        background: active ? 'rgba(183,110,110,0.15)' : 'rgba(0,0,0,0.04)',
                        color:      active ? '#B76E6E' : '#8B8B8B',
                        marginLeft: 6,
                      }}
                    >{t.tag}</span>
                  </div>
                  {active && (
                    <div className="template-check">
                      <Check size={9} strokeWidth={3} color="#000" />
                    </div>
                  )}
                </div>
              </button>
            );
          })}
        </div>
      </div>

      <div className="form-divider" />

      {/* ── Couleur principale — ColorPicker custom ── */}
      <div>
        <ColorPicker
          label="Couleur principale"
          value={design.primaryColor}
          onChange={primary => updateDesign({ primaryColor: primary })}
        />
      </div>

      <div className="form-divider" />

      {/* ── Police ── */}
      <div>
        <p className="form-section-title">Police de caractères</p>
        <FontSelector
          value={design.font}
          onChange={font => updateDesign({ font })}
          primaryColor={design.primaryColor}
        />
      </div>

      <div className="form-divider" />

      {/* ── Espacement ── */}
      <div>
        <p className="form-section-title">Espacement</p>
        <div className="spacing-options">
          {SPACINGS.map(s => {
            const active = design.spacing === s.id;
            return (
              <button
                key={s.id}
                className={`spacing-option${active ? ' active' : ''}`}
                onClick={() => updateDesign({ spacing: s.id })}
              >
                <div className="spacing-bars">
                  {s.bars.map((h, i) => (
                    <div key={i} className="spacing-bar" style={{ height: h }} />
                  ))}
                </div>
                <div>
                  <p className="spacing-label">{s.label}</p>
                  <p className="spacing-desc">{s.desc}</p>
                </div>
                {active && (
                  <div className="spacing-check">
                    <div style={{
                      width: 18, height: 18, borderRadius: '50%',
                      background: design.primaryColor,
                      display: 'flex', alignItems: 'center', justifyContent: 'center',
                      transition: 'background 0.2s',
                    }}>
                      <Check size={9} strokeWidth={3} color="#fff" />
                    </div>
                  </div>
                )}
              </button>
            );
          })}
        </div>
      </div>

    </div>
  );
}