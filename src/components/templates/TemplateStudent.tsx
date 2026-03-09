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

function DotGrid({ color, opacity = 0.12 }: { color: string; opacity?: number }) {
  return (
    <svg style={{ position:'absolute', inset:0, width:'100%', height:'100%', pointerEvents:'none' }}>
      <defs>
        <pattern id="dotgrid" x="0" y="0" width="16" height="16" patternUnits="userSpaceOnUse">
          <circle cx="1.5" cy="1.5" r="1.5" fill={color} fillOpacity={opacity} />
        </pattern>
      </defs>
      <rect width="100%" height="100%" fill="url(#dotgrid)" />
    </svg>
  );
}

function CornerArc({ color, size = 90, pos }: { color: string; size?: number; pos: 'tl'|'br' }) {
  const style: React.CSSProperties = {
    position: 'absolute', pointerEvents: 'none',
    ...(pos === 'tl' ? { top: 0, left: 0 } : { bottom: 0, right: 0 }),
  };
  return (
    <svg width={size} height={size} style={style} viewBox={`0 0 ${size} ${size}`}>
      <path d={`M 0 ${size} A ${size} ${size} 0 0 1 ${size} 0`} fill="none" stroke={color} strokeWidth="1" opacity="0.22" />
      <path d={`M 0 ${size*0.68} A ${size*0.68} ${size*0.68} 0 0 1 ${size*0.68} 0`} fill="none" stroke={color} strokeWidth="1" opacity="0.14" />
      <path d={`M 0 ${size*0.42} A ${size*0.42} ${size*0.42} 0 0 1 ${size*0.42} 0`} fill="none" stroke={color} strokeWidth="1" opacity="0.09" />
    </svg>
  );
}

function OrnDivider({ color }: { color: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:7, margin:'2px 0 6px' }}>
      <div style={{ flex:1, height:1, background:`${color}20` }} />
      <svg width="12" height="8" viewBox="0 0 12 8">
        <polygon points="6,0 12,4 6,8 0,4" fill={color} opacity="0.45" />
      </svg>
      <div style={{ flex:1, height:1, background:`${color}20` }} />
    </div>
  );
}

export default function TemplateStudent({ cv }: Props) {
  const { personal, profile, experiences, formations, skills, languages, design } = cv;
  const p = design.primaryColor;

  const contacts = [
    { icon:'☎', v: personal.phone },
    { icon:'✉', v: personal.email },
    { icon:'◎', v: personal.address },
    { icon:'in', v: personal.linkedin },
    { icon:'⊕', v: personal.website },
  ].filter(c => c.v?.trim());

  return (
    <div className="cv-root" data-font={design.font} data-spacing={design.spacing}
      style={{ flexDirection:'column', background:'#FAFAF8' }}>

      {/* ══ HEADER ══ */}
      <header style={{ background:p, position:'relative', overflow:'hidden', flexShrink:0 }}>
        <DotGrid color="white" opacity={0.13} />
        <CornerArc color="white" size={110} pos="tl" />
        <CornerArc color="white" size={100} pos="br" />

        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:'rgba(255,255,255,0.18)' }} />
        <svg style={{ position:'absolute', bottom:2, left:0, right:0, pointerEvents:'none' }} height="20" viewBox="0 0 600 20" preserveAspectRatio="none">
          <path d="M0,20 L0,10 Q150,0 300,10 Q450,20 600,8 L600,20 Z" fill="rgba(255,255,255,0.07)" />
        </svg>

        <div style={{ display:'flex', alignItems:'center', gap:22, padding:'26px 30px 30px', position:'relative', zIndex:1 }}>

          {/* Photo avec doubles cercles décoratifs */}
          <div style={{ position:'relative', flexShrink:0, width:96, height:96 }}>
            <div style={{ position:'absolute', inset:-9, borderRadius:'50%', border:'1px solid rgba(255,255,255,0.2)' }} />
            <div style={{ position:'absolute', inset:-18, borderRadius:'50%', border:'1px dashed rgba(255,255,255,0.11)' }} />
            <div style={{ width:96, height:96, borderRadius:'50%', border:'3px solid rgba(255,255,255,0.85)', overflow:'hidden', boxShadow:'0 6px 20px rgba(0,0,0,0.2)' }}>
              {personal.photoUrl
                ? <img src={personal.photoUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
                : <div style={{ width:'100%', height:'100%', background:'rgba(255,255,255,0.15)', display:'flex', alignItems:'center', justifyContent:'center', fontSize:30, fontWeight:900, color:'white' }}>
                    {personal.firstName?.[0]}{personal.lastName?.[0]}
                  </div>
              }
            </div>
          </div>

          {/* Identité */}
          <div style={{ flex:1, minWidth:0, overflow:'hidden' }}>
            <div style={{ fontSize:10, fontWeight:500, color:'rgba(255,255,255,0.6)', letterSpacing:3, textTransform:'uppercase', marginBottom:3, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {personal.firstName}
            </div>
            <div style={{ fontSize:26, fontWeight:900, color:'white', lineHeight:1, letterSpacing:-0.5, overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap' }}>
              {personal.lastName?.toUpperCase()}
            </div>
            {personal.title && (
              <div style={{ marginTop:7, display:'flex', alignItems:'center', gap:8, overflow:'hidden' }}>
                <div style={{ width:22, flexShrink:0, height:1.5, background:'rgba(255,255,255,0.5)' }} />
                <span style={{ fontSize:9, color:'rgba(255,255,255,0.7)', letterSpacing:1.5, textTransform:'uppercase', display:'-webkit-box', WebkitBoxOrient:'vertical', WebkitLineClamp:2, overflow:'hidden' }}>{personal.title}</span>
              </div>
            )}
          </div>

          {/* Contacts */}
          {contacts.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:5, alignItems:'flex-end', flexShrink:0, width:148, minWidth:0 }}>
              {contacts.map((c, i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6, width:'100%', justifyContent:'flex-end' }}>
                  <span style={{ fontSize:8.5, color:'rgba(255,255,255,0.75)', textAlign:'right', overflow:'hidden', textOverflow:'ellipsis', whiteSpace:'nowrap', flex:1, minWidth:0 }}>{c.v}</span>
                  <div style={{ width:18, height:18, borderRadius:'50%', background:'rgba(255,255,255,0.12)', display:'flex', alignItems:'center', justifyContent:'center', flexShrink:0 }}>
                    <span style={{ fontSize:9, color:'rgba(255,255,255,0.7)' }}>{c.icon}</span>
                  </div>
                </div>
              ))}
            </div>
          )}
        </div>
      </header>

      {/* ══ CORPS ══ */}
      <div style={{ display:'flex', flex:1 }}>

        {/* ── COLONNE PRINCIPALE ── */}
        <main style={{ flex:1, padding:'22px 26px', display:'flex', flexDirection:'column', gap:18, minWidth:0 }}>

          {profile && (
            <section>
              <SecTitle t="Profil" c={p} />
              <p style={{ fontSize:11, lineHeight:1.85, color:'#555', margin:'6px 0 0', ...cl(4) }}>{profile}</p>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <SecTitle t="Expériences" c={p} />
              <div style={{ display:'flex', flexDirection:'column', gap:13, marginTop:8 }}>
                {experiences.map(exp => (
                  <div key={exp.id} style={{ display:'grid', gridTemplateColumns:'76px 1fr', gap:14 }}>
                    <div style={{ textAlign:'right', paddingTop:3 }}>
                      <div style={{ fontSize:8.5, color:'#ccc', lineHeight:1.7 }}>
                        {fmt(exp.startDate)}<br/>
                        <span style={{ color: exp.current ? p : '#ccc', fontWeight: exp.current ? 700 : 400 }}>
                          {exp.current ? 'Présent' : fmt(exp.endDate)}
                        </span>
                      </div>
                    </div>
                    <div style={{ position:'relative', paddingLeft:14, borderLeft:`2px solid ${p}25` }}>
                      <div style={{ position:'absolute', left:-5, top:5, width:8, height:8, background:p, transform:'rotate(45deg)', borderRadius:1 }} />
                      <div style={{ fontSize:12, fontWeight:800, color:'#111' }}>{exp.position}</div>
                      <div style={{ fontSize:10.5, color:p, fontWeight:600, marginTop:1 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                      {exp.description && <p style={{ fontSize:10, color:'#888', lineHeight:1.7, margin:'4px 0 0', ...cl(3) }}>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {formations.length > 0 && (
            <section>
              <SecTitle t="Formation" c={p} />
              <div style={{ display:'flex', flexDirection:'column', gap:11, marginTop:8 }}>
                {formations.map(f => (
                  <div key={f.id} style={{ display:'grid', gridTemplateColumns:'76px 1fr', gap:14 }}>
                    <div style={{ textAlign:'right', paddingTop:3 }}>
                      <div style={{ fontSize:8.5, color:'#ccc', lineHeight:1.7 }}>
                        {fmt(f.startDate)}<br/>{f.current ? 'En cours' : fmt(f.endDate)}
                      </div>
                    </div>
                    <div style={{ position:'relative', paddingLeft:14, borderLeft:`2px solid ${p}25` }}>
                      <div style={{ position:'absolute', left:-5, top:5, width:8, height:8, background:'white', border:`2px solid ${p}`, borderRadius:'50%' }} />
                      <div style={{ fontSize:12, fontWeight:800, color:'#111' }}>{f.school}</div>
                      <div style={{ fontSize:10.5, color:p, fontWeight:600, marginTop:1 }}>{f.degree}{f.field ? ` · ${f.field}` : ''}</div>
                      {f.description && <p style={{ fontSize:10, color:'#888', lineHeight:1.7, margin:'4px 0 0', ...cl(2) }}>{f.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </main>

        {/* ── COLONNE DROITE ── */}
        <aside style={{ width:172, background:'white', borderLeft:'1px solid #EDEDE9', padding:'22px 14px', display:'flex', flexDirection:'column', gap:18, flexShrink:0, position:'relative', overflow:'hidden' }}>

          {/* Triangles décoratifs coins */}
          <svg style={{ position:'absolute', top:0, right:0, pointerEvents:'none' }} width="55" height="55" viewBox="0 0 55 55">
            <polygon points="55,0 55,55 0,0" fill={p} opacity="0.055" />
            <polygon points="55,0 55,35 20,0" fill={p} opacity="0.06" />
          </svg>
          <svg style={{ position:'absolute', bottom:0, left:0, pointerEvents:'none' }} width="45" height="45" viewBox="0 0 45 45">
            <polygon points="0,45 45,45 0,0" fill={p} opacity="0.05" />
          </svg>

          <div style={{ position:'relative', zIndex:1, display:'flex', flexDirection:'column', gap:18 }}>

            {/* Compétences — tags avec variation de style */}
            {skills.length > 0 && (
              <div>
                <AsideTitle t="Compétences" c={p} />
                <div style={{ display:'flex', flexWrap:'wrap', gap:5, marginTop:8 }}>
                  {skills.map((s, i) => (
                    <span key={s.id} style={{
                      fontSize:9.5,
                      color: i % 3 === 0 ? 'white' : i % 3 === 1 ? p : '#555',
                      background: i % 3 === 0 ? p : i % 3 === 1 ? `${p}15` : '#F3F3F0',
                      border: `1px solid ${i % 3 === 0 ? p : i % 3 === 1 ? `${p}40` : '#E5E5E2'}`,
                      padding:'3px 9px',
                      borderRadius:3,
                      fontWeight: i % 3 === 0 ? 600 : 500,
                    }}>{s.name}</span>
                  ))}
                </div>
              </div>
            )}

            {skills.length > 0 && languages.length > 0 && <OrnDivider color={p} />}

            {/* Langues avec barre */}
            {languages.length > 0 && (
              <div>
                <AsideTitle t="Langues" c={p} />
                <div style={{ display:'flex', flexDirection:'column', gap:9, marginTop:8 }}>
                  {languages.map(l => (
                    <div key={l.id}>
                      <div style={{ display:'flex', justifyContent:'space-between', alignItems:'baseline', marginBottom:4 }}>
                        <span style={{ fontSize:10.5, fontWeight:700, color:'#222' }}>{l.name}</span>
                        <span style={{ fontSize:8, color:p, fontWeight:700, letterSpacing:0.3 }}>{l.level}</span>
                      </div>
                      <div style={{ height:2.5, background:`${p}15`, borderRadius:99 }}>
                        <div style={{
                          height:'100%', borderRadius:99, background:p,
                          width:`${({'Débutant':18,'Intermédiaire':38,'Avancé':58,'Courant':78,'Natif':100,'A1':15,'A2':28,'B1':45,'B2':62,'C1':80,'C2':95}[l.level]??60)}%`
                        }} />
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            )}

          </div>
        </aside>
      </div>

      {/* ══ PIED DÉCORATIF ══ */}
      <div style={{ height:5, background:`linear-gradient(90deg, ${p}, ${p}55, transparent)`, flexShrink:0 }} />
    </div>
  );
}

function SecTitle({ t, c }: { t: string; c: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:2 }}>
      <div style={{ position:'relative', width:14, height:14, flexShrink:0 }}>
        <div style={{ position:'absolute', inset:0, background:c, borderRadius:2, opacity:0.9 }} />
        <div style={{ position:'absolute', inset:3, background:'white', borderRadius:1 }} />
      </div>
      <span style={{ fontSize:10, fontWeight:900, letterSpacing:2.5, color:'#1a1a1a', textTransform:'uppercase' }}>{t}</span>
      <div style={{ flex:1, height:1, background:`${c}20` }} />
    </div>
  );
}

function AsideTitle({ t, c }: { t: string; c: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:6 }}>
      <div style={{ width:12, height:12, borderRadius:'50%', background:`${c}20`, border:`2px solid ${c}`, flexShrink:0 }} />
      <span style={{ fontSize:8, fontWeight:900, letterSpacing:2.5, color:c, textTransform:'uppercase' }}>{t}</span>
    </div>
  );
}