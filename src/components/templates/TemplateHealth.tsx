import type { CVData } from '../../types/cv.types';
import './Templates.css';
interface Props { cv: CVData; }

function fmt(d: string) {
  if (!d) return '';
  const [y, m] = d.split('-');
  const mo = ['Jan','Fév','Mar','Avr','Mai','Juin','Juil','Aoû','Sep','Oct','Nov','Déc'];
  return `${mo[parseInt(m)-1]??''} ${y}`;
}
function cl(n: number): React.CSSProperties {
  return { display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:n, overflow:'hidden' };
}

/* ── Motif hexagones en nid d'abeille (biologie / cellules) ── */
function HexPattern({ color }: { color: string }) {
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
      <defs>
        <pattern id="hex" x="0" y="0" width="30" height="26" patternUnits="userSpaceOnUse">
          <polygon points="15,1 27,7.5 27,18.5 15,25 3,18.5 3,7.5"
            fill="none" stroke={color} strokeWidth="0.7" opacity="0.18" />
        </pattern>
        <pattern id="hex2" x="15" y="13" width="30" height="26" patternUnits="userSpaceOnUse">
          <polygon points="15,1 27,7.5 27,18.5 15,25 3,18.5 3,7.5"
            fill="none" stroke={color} strokeWidth="0.7" opacity="0.18" />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#hex)" />
      <rect width="100%" height="100%" fill="url(#hex2)" />
    </svg>
  );
}

/* Segments de langue */
function LangBar({ level, color }: { level: string; color: string }) {
  const pct = ({'Débutant':1,'Intermédiaire':2,'Avancé':3,'Courant':4,'Natif':5,
    'A1':1,'A2':1,'B1':2,'B2':3,'C1':4,'C2':5} as Record<string,number>)[level] ?? 3;
  return (
    <div style={{ display:'flex', gap:3 }}>
      {[1,2,3,4,5].map(n => (
        <div key={n} style={{ width:16, height:4, borderRadius:2, background: n <= pct ? color : `${color}20` }} />
      ))}
    </div>
  );
}

export default function TemplateHealth({ cv }: Props) {
  const { personal, profile, experiences, formations, skills, languages, design } = cv;
  const p = design.primaryColor;

  const contacts = [
    { icon:'☎', v: personal.phone },
    { icon:'✉', v: personal.email },
    { icon:'◎', v: personal.address },
    { icon:'⊕', v: personal.website },
    { icon:'in', v: personal.linkedin },
  ].filter(c => c.v?.trim());

  return (
    <div className="cv-root" data-font={design.font} data-spacing={design.spacing}
      style={{ background:'white', flexDirection:'row' }}>

      {/* ══ PANNEAU GAUCHE — blanc, étroit, typographique ══ */}
      <aside style={{
        width: 198, background: '#FAFAFA', flexShrink: 0,
        display: 'flex', flexDirection: 'column',
        borderRight: `1px solid #EBEBEB`,
        position: 'relative', overflow: 'hidden',
      }}>
        {/* Motif hexagones en fond */}
        <HexPattern color={p} />

        {/* Barre fine colorée tout à droite */}
        <div style={{ position:'absolute', top:0, right:0, bottom:0, width:3, background:p, opacity:0.7 }} />

        <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', flex:1 }}>

          {/* Zone photo + nom — fond blanc */}
          <div style={{ background:'white', padding:'26px 18px 20px', position:'relative' }}>
            {/* Photo carrée avec coin coupé */}
            <div style={{
              width: 86, height: 86, margin:'0 auto 14px',
              clipPath: 'polygon(0 0, 80% 0, 100% 20%, 100% 100%, 0 100%)',
              overflow: 'hidden', border: `3px solid ${p}`,
              boxShadow: `4px 4px 0 ${p}30`,
            }}>
              {personal.photoUrl
                ? <img src={personal.photoUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                : <div style={{ width:'100%', height:'100%', background:`${p}15`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:900, color:p }}>
                    {personal.firstName?.[0]}{personal.lastName?.[0]}
                  </div>
              }
            </div>

            {/* Nom vertical + titre */}
            <div style={{ textAlign:'center' }}>
              <div style={{ fontSize:13, fontWeight:900, color:'#111', lineHeight:1.2, letterSpacing:-0.3 }}>
                {personal.firstName}<br/>{personal.lastName}
              </div>
              {personal.title && (
                <div style={{ fontSize:8.5, color:p, marginTop:6, fontWeight:600, letterSpacing:0.5, lineHeight:1.5, ...cl(2) }}>
                  {personal.title}
                </div>
              )}
            </div>

            {/* Trait coloré bas */}
            <div style={{ width:'50%', height:2, background:p, borderRadius:99, margin:'12px auto 0', opacity:0.5 }} />
          </div>

          {/* Contacts */}
          {contacts.length > 0 && (
            <div style={{ padding:'14px 16px', borderBottom:'1px solid #EBEBEB' }}>
              <SideLabel t="Contact" c={p} />
              {contacts.map((c, i) => (
                <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:7 }}>
                  <span style={{ fontSize:10, color:p, flexShrink:0, width:12, marginTop:1 }}>{c.icon}</span>
                  <span style={{ fontSize:9.5, color:'#555', lineHeight:1.5, wordBreak:'break-all', ...cl(2) }}>{c.v}</span>
                </div>
              ))}
            </div>
          )}

          {/* Compétences */}
          {skills.length > 0 && (
            <div style={{ padding:'14px 16px', borderBottom:'1px solid #EBEBEB' }}>
              <SideLabel t="Compétences" c={p} />
              <div style={{ display:'flex', flexDirection:'column', gap:4, marginTop:6 }}>
                {skills.map((s, i) => (
                  <div key={s.id} style={{
                    fontSize: 9.5, color: i % 4 === 0 ? 'white' : '#444',
                    background: i % 4 === 0 ? p : 'white',
                    border: `1px solid ${i % 4 === 0 ? p : '#E5E5E5'}`,
                    padding: '3px 8px', borderRadius: 3, fontWeight: i % 4 === 0 ? 600 : 400,
                  }}>{s.name}</div>
                ))}
              </div>
            </div>
          )}

          {/* Langues */}
          {languages.length > 0 && (
            <div style={{ padding:'14px 16px' }}>
              <SideLabel t="Langues" c={p} />
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:6 }}>
                {languages.map(l => (
                  <div key={l.id}>
                    <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                      <span style={{ fontSize:10.5, fontWeight:700, color:'#222' }}>{l.name}</span>
                      <span style={{ fontSize:8, color:p }}>{l.level}</span>
                    </div>
                    <LangBar level={l.level} color={p} />
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </aside>

      {/* ══ COLONNE DROITE — contenu principal ══ */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, background:'white' }}>

        {/* ── Bandeau nom en haut à droite — typographie large ── */}
        <div style={{ padding:'22px 28px 16px', borderBottom:`1px solid #F0F0F0`, position:'relative', overflow:'hidden' }}>
          {/* Grand initiale watermark */}
          <div style={{
            position:'absolute', right:-10, top:-18,
            fontSize:130, fontWeight:900, color:`${p}07`,
            lineHeight:1, pointerEvents:'none', userSelect:'none',
            fontFamily:'serif',
          }}>
            {personal.lastName?.[0]}
          </div>

          <div style={{ fontSize:9, color:'#bbb', letterSpacing:3, textTransform:'uppercase', marginBottom:4 }}>Curriculum Vitæ</div>
          <div style={{ fontSize:28, fontWeight:900, color:'#111', lineHeight:1, letterSpacing:-0.5 }}>
            {personal.firstName} <span style={{ color:p }}>{personal.lastName}</span>
          </div>
          {personal.title && (
            <div style={{ display:'flex', alignItems:'center', gap:8, marginTop:7 }}>
              <div style={{ width:16, height:2, background:p, borderRadius:99 }} />
              <span style={{ fontSize:9, color:'#999', letterSpacing:1.5, textTransform:'uppercase' }}>{personal.title}</span>
            </div>
          )}
        </div>

        {/* ── Sections ── */}
        <div style={{ padding:'18px 28px', display:'flex', flexDirection:'column', gap:18 }}>

          {profile && (
            <section>
              <MainTitle t="Profil" c={p} />
              <p style={{ fontSize:11, lineHeight:1.9, color:'#555', margin:'7px 0 0', ...cl(4) }}>{profile}</p>
            </section>
          )}

          {formations.length > 0 && (
            <section>
              <MainTitle t="Formation" c={p} />
              <div style={{ display:'flex', flexDirection:'column', gap:11, marginTop:8 }}>
                {formations.map(f => (
                  <div key={f.id} style={{ display:'grid', gridTemplateColumns:'64px 1fr', gap:12 }}>
                    <div style={{ textAlign:'right', paddingTop:2 }}>
                      <span style={{ fontSize:8.5, color:'#ccc', lineHeight:1.7, display:'block' }}>{fmt(f.startDate)}</span>
                      <span style={{ fontSize:8.5, color:'#ccc', lineHeight:1.7, display:'block' }}>{f.current ? 'En cours' : fmt(f.endDate)}</span>
                    </div>
                    <div style={{ borderLeft:`2px solid ${p}30`, paddingLeft:12, position:'relative' }}>
                      <div style={{ position:'absolute', left:-5, top:5, width:7, height:7, borderRadius:'50%', background:'white', border:`2px solid ${p}` }} />
                      <div style={{ fontSize:12, fontWeight:800, color:'#111' }}>{f.school}</div>
                      <div style={{ fontSize:10.5, color:p, fontWeight:600, marginTop:1 }}>{f.degree}{f.field ? ` · ${f.field}` : ''}</div>
                      {f.description && <p style={{ fontSize:10, color:'#888', lineHeight:1.7, margin:'3px 0 0', ...cl(2) }}>{f.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <MainTitle t="Expériences" c={p} />
              <div style={{ display:'flex', flexDirection:'column', gap:11, marginTop:8 }}>
                {experiences.map(exp => (
                  <div key={exp.id} style={{ display:'grid', gridTemplateColumns:'64px 1fr', gap:12 }}>
                    <div style={{ textAlign:'right', paddingTop:2 }}>
                      <span style={{ fontSize:8.5, color:'#ccc', lineHeight:1.7, display:'block' }}>{fmt(exp.startDate)}</span>
                      <span style={{ fontSize:8.5, lineHeight:1.7, display:'block', color: exp.current ? p : '#ccc', fontWeight: exp.current ? 700 : 400 }}>
                        {exp.current ? 'Présent' : fmt(exp.endDate)}
                      </span>
                    </div>
                    <div style={{ borderLeft:`2px solid ${p}30`, paddingLeft:12, position:'relative' }}>
                      <div style={{ position:'absolute', left:-4, top:5, width:7, height:7, borderRadius:'50%', background:p }} />
                      <div style={{ fontSize:12, fontWeight:800, color:p }}>{exp.company}</div>
                      <div style={{ fontSize:10.5, fontWeight:600, color:'#444', marginTop:1 }}>{exp.position}{exp.location ? ` · ${exp.location}` : ''}</div>
                      {exp.description && <p style={{ fontSize:10, color:'#888', lineHeight:1.7, margin:'3px 0 0', ...cl(3) }}>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function SideLabel({ t, c }: { t: string; c: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:5, marginBottom:8 }}>
      <div style={{ width:10, height:10, borderRadius:2, background:`${c}20`, border:`1.5px solid ${c}` }} />
      <span style={{ fontSize:8, fontWeight:900, letterSpacing:2.5, color:c, textTransform:'uppercase' }}>{t}</span>
    </div>
  );
}

function MainTitle({ t, c }: { t: string; c: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:9, marginBottom:2 }}>
      <div style={{ width:3, height:18, background:c, borderRadius:99, flexShrink:0 }} />
      <span style={{ fontSize:10, fontWeight:900, letterSpacing:2.5, color:'#1a1a1a', textTransform:'uppercase' }}>{t}</span>
      <div style={{ flex:1, height:1, background:`${c}15` }} />
    </div>
  );
}