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

// Photo en hexagone via clip-path
function HexPhoto({ url, initials, color, size = 88 }: { url?: string; initials: string; color: string; size?: number }) {
  return (
    <div style={{
      width: size, height: size, flexShrink: 0,
      clipPath: 'polygon(50% 0%, 100% 25%, 100% 75%, 50% 100%, 0% 75%, 0% 25%)',
      overflow: 'hidden', background: `${color}40`,
    }}>
      {url
        ? <img src={url} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
        : <div style={{ width:'100%', height:'100%', display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:900, color }}>{initials}</div>
      }
    </div>
  );
}

export default function TemplateTech({ cv }: Props) {
  const { personal, profile, experiences, formations, skills, languages, design } = cv;
  const p = design.primaryColor;

  const contacts = [
    { icon:'☎', v: personal.phone },
    { icon:'✉', v: personal.email },
    { icon:'◎', v: personal.address },
    { icon:'⊕', v: personal.website },
    { icon:'in', v: personal.linkedin },
  ].filter(c => c.v?.trim());

  const initials = `${personal.firstName?.[0]??''}${personal.lastName?.[0]??''}`;

  return (
    <div className="cv-root" data-font={design.font} data-spacing={design.spacing}
      style={{ flexDirection:'column' }}>

      {/* ══ HEADER FULL WIDTH sombre ══════════════════════════ */}
      <div style={{ background:'#0D1117', padding:'26px 32px 22px', flexShrink:0, position:'relative', overflow:'hidden' }}>
        {/* Grille décorative en fond */}
        <div style={{ position:'absolute', inset:0, backgroundImage:`linear-gradient(${p}15 1px, transparent 1px), linear-gradient(90deg, ${p}15 1px, transparent 1px)`, backgroundSize:'32px 32px', pointerEvents:'none' }} />

        <div style={{ display:'flex', alignItems:'center', gap:22, position:'relative', zIndex:1 }}>
          {/* Photo hexagone */}
          <HexPhoto url={personal.photoUrl} initials={initials} color={p} size={90} />

          {/* Nom + titre */}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:28, fontWeight:900, color:'white', lineHeight:1, letterSpacing:-0.5 }}>
              {personal.firstName} <span style={{ color:p }}>{personal.lastName}</span>
            </div>
            {personal.title && <div style={{ fontSize:11, color:'rgba(255,255,255,0.4)', marginTop:6, letterSpacing:0.5 }}>{personal.title}</div>}
          </div>

          {/* Contacts à droite */}
          {contacts.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:5, alignItems:'flex-end', flexShrink:0 }}>
              {contacts.map((c,i) => (
                <div key={i} style={{ display:'flex', alignItems:'center', gap:6 }}>
                  <span style={{ fontSize:10.5, color:'rgba(255,255,255,0.5)', ...cl(1) }}>{c.v}</span>
                  <span style={{ fontSize:11, color:p, width:14, textAlign:'center' }}>{c.icon}</span>
                </div>
              ))}
            </div>
          )}
        </div>

        {/* Barre accent bas du header */}
        <div style={{ position:'absolute', bottom:0, left:0, right:0, height:2, background:`linear-gradient(90deg, ${p}, transparent)` }} />
      </div>

      {/* ══ BODY : 2 colonnes ══════════════════════════════════ */}
      <div style={{ display:'grid', gridTemplateColumns:'1fr 260px', flex:1 }}>

        {/* COLONNE PRINCIPALE gauche */}
        <div style={{ padding:'20px 24px', display:'flex', flexDirection:'column', gap:18, background:'#F8F9FA', borderRight:'1px solid #eee' }}>

          {profile && (
            <section>
              <TechTitle t="À PROPOS" c={p} />
              <p style={{ fontSize:11.5, lineHeight:1.8, color:'#555', margin:'8px 0 0', ...cl(4) }}>{profile}</p>
            </section>
          )}

          {experiences.length > 0 && (
            <section>
              <TechTitle t="EXPÉRIENCES" c={p} />
              <div style={{ display:'flex', flexDirection:'column', gap:14, marginTop:10 }}>
                {experiences.map(exp => (
                  <div key={exp.id} style={{ background:'white', borderRadius:6, padding:'12px 14px', border:'1px solid #eee', borderLeft:`3px solid ${p}` }}>
                    <div style={{ display:'flex', justifyContent:'space-between', flexWrap:'wrap', gap:4, marginBottom:3 }}>
                      <div style={{ fontSize:12.5, fontWeight:700, color:'#111' }}>{exp.position}</div>
                      <div style={{ fontSize:10, color:'#bbb' }}>{fmt(exp.startDate)} → {exp.current ? 'Présent' : fmt(exp.endDate)}</div>
                    </div>
                    <div style={{ fontSize:11.5, color:p, fontWeight:600, marginBottom:5 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                    {exp.description && <p style={{ fontSize:11, color:'#777', lineHeight:1.65, margin:0, ...cl(3) }}>{exp.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {formations.length > 0 && (
            <section>
              <TechTitle t="FORMATION" c={p} />
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:10 }}>
                {formations.map(f => (
                  <div key={f.id} style={{ display:'flex', gap:12 }}>
                    <div style={{ fontSize:9.5, color:'#bbb', whiteSpace:'nowrap', paddingTop:2, minWidth:70, textAlign:'right' }}>
                      {fmt(f.startDate)}<br/>{f.current ? 'En cours' : fmt(f.endDate)}
                    </div>
                    <div style={{ borderLeft:`2px solid ${p}`, paddingLeft:12, position:'relative' }}>
                      <div style={{ position:'absolute', left:-5, top:4, width:7, height:7, borderRadius:'50%', background:p }} />
                      <div style={{ fontSize:12, fontWeight:700, color:p }}>{f.school}</div>
                      <div style={{ fontSize:11, color:'#444', marginTop:1 }}>{f.degree}</div>
                      {f.description && <p style={{ fontSize:10.5, color:'#888', margin:'3px 0 0', lineHeight:1.6, ...cl(2) }}>{f.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>

        {/* COLONNE DROITE — sombre */}
        <div style={{ background:'#161B22', padding:'20px 18px', display:'flex', flexDirection:'column', gap:18 }}>

          {skills.length > 0 && (
            <div>
              <DarkLabel t="STACK TECHNIQUE" c={p} />
              <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
                {skills.map(s => (
                  <span key={s.id} style={{ fontSize:10, color:p, background:`${p}15`, border:`1px solid ${p}40`, padding:'3px 9px', borderRadius:4, fontFamily:'monospace' }}>{s.name}</span>
                ))}
              </div>
            </div>
          )}

          {languages.length > 0 && (
            <div>
              <DarkLabel t="LANGUES" c={p} />
              {languages.map(l => (
                <div key={l.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:7 }}>
                  <span style={{ fontSize:11.5, color:'rgba(255,255,255,0.75)', fontWeight:500 }}>{l.name}</span>
                  <span style={{ fontSize:9.5, color:p, background:`${p}20`, padding:'2px 8px', borderRadius:99 }}>{l.level}</span>
                </div>
              ))}
            </div>
          )}

          {/* Infos supplémentaires */}
          {personal.website && (
            <div>
              <DarkLabel t="PORTFOLIO" c={p} />
              <div style={{ fontSize:11, color:'rgba(255,255,255,0.5)', wordBreak:'break-all' }}>{personal.website}</div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}

function TechTitle({ t, c }: { t: string; c: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:8, marginBottom:2 }}>
      <div style={{ width:3, height:16, background:c, borderRadius:99 }} />
      <span style={{ fontSize:11, fontWeight:800, letterSpacing:1.5, color:'#222', textTransform:'uppercase' }}>{t}</span>
    </div>
  );
}
function DarkLabel({ t, c }: { t: string; c: string }) {
  return <div style={{ fontSize:9, fontWeight:800, letterSpacing:2, color:c, textTransform:'uppercase', marginBottom:10 }}>{t}</div>;
}