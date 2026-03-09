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

export default function TemplateIndustry({ cv }: Props) {
  const { personal, profile, experiences, formations, skills, languages, design } = cv;
  const p = design.primaryColor;   // brun/terre
  const dark = '#1A1A1A';

  const contacts = [
    { icon:'☎', v: personal.phone },
    { icon:'✉', v: personal.email },
    { icon:'◎', v: personal.address },
    { icon:'in', v: personal.linkedin },
    { icon:'⊕', v: personal.website },
  ].filter(c => c.v?.trim());

  return (
    <div className="cv-root" data-font={design.font} data-spacing={design.spacing}>

      {/* ── SIDEBAR GAUCHE étroite et sombre ── */}
      <aside style={{ width:200, background:dark, display:'flex', flexDirection:'column', flexShrink:0 }}>

        {/* Photo petit carré avec bordure colorée en bas */}
        <div style={{ width:'100%', height:180, overflow:'hidden', position:'relative', flexShrink:0 }}>
          {personal.photoUrl
            ? <img src={personal.photoUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
            : <div style={{ width:'100%', height:'100%', background:`${p}30`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:48, fontWeight:900, color:p }}>{personal.firstName?.[0]}{personal.lastName?.[0]}</div>
          }
          {/* Overlay gradient bas */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:60, background:`linear-gradient(transparent, ${dark})` }} />
          {/* Trait coloré bas */}
          <div style={{ position:'absolute', bottom:0, left:0, right:0, height:3, background:p }} />
        </div>

        {/* Nom */}
        <div style={{ padding:'14px 16px 10px' }}>
          <div style={{ fontSize:14, fontWeight:900, color:'white', lineHeight:1.2, letterSpacing:-0.3 }}>{personal.firstName} {personal.lastName}</div>
          {personal.title && <div style={{ fontSize:9.5, color:p, marginTop:4, lineHeight:1.4, ...cl(2) }}>{personal.title}</div>}
        </div>

        <div style={{ width:'100%', height:1, background:'rgba(255,255,255,0.07)' }} />

        {/* Contact */}
        {contacts.length > 0 && (
          <div style={{ padding:'12px 16px' }}>
            <IndLabel t="Contact" c={p} />
            {contacts.map((c,i) => (
              <div key={i} style={{ display:'flex', gap:8, alignItems:'flex-start', marginBottom:7 }}>
                <span style={{ fontSize:11, color:p, flexShrink:0, width:12 }}>{c.icon}</span>
                <span style={{ fontSize:10.5, color:'rgba(255,255,255,0.5)', wordBreak:'break-all', lineHeight:1.4, ...cl(2) }}>{c.v}</span>
              </div>
            ))}
          </div>
        )}

        <div style={{ width:'100%', height:1, background:'rgba(255,255,255,0.07)' }} />

        {/* Formation dans sidebar */}
        {formations.length > 0 && (
          <div style={{ padding:'12px 16px' }}>
            <IndLabel t="Formation" c={p} />
            {formations.map(f => (
              <div key={f.id} style={{ marginBottom:10 }}>
                <div style={{ fontSize:11, fontWeight:700, color:'white', lineHeight:1.25 }}>{f.school}</div>
                <div style={{ fontSize:10, color:p, marginTop:1, ...cl(2) }}>{f.degree}</div>
                <div style={{ fontSize:9.5, color:'rgba(255,255,255,0.28)', marginTop:1 }}>
                  {fmt(f.startDate)} – {f.current ? 'En cours' : fmt(f.endDate)}
                </div>
              </div>
            ))}
          </div>
        )}

        <div style={{ width:'100%', height:1, background:'rgba(255,255,255,0.07)' }} />

        {/* Langues */}
        {languages.length > 0 && (
          <div style={{ padding:'12px 16px' }}>
            <IndLabel t="Langues" c={p} />
            {languages.map(l => (
              <div key={l.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.65)' }}>{l.name}</span>
                <span style={{ fontSize:9, color:p, background:`${p}20`, padding:'2px 6px', borderRadius:3 }}>{l.level}</span>
              </div>
            ))}
          </div>
        )}
      </aside>

      {/* ── MAIN ── */}
      <main style={{ flex:1, background:'#FAFAFA', display:'flex', flexDirection:'column', minWidth:0 }}>

        {/* Header bandeau */}
        <div style={{ background:'white', borderBottom:`3px solid ${p}`, padding:'22px 26px 16px' }}>
          <div style={{ fontSize:22, fontWeight:900, color:dark, lineHeight:1 }}>{personal.firstName} <span style={{ color:p }}>{personal.lastName}</span></div>
          {personal.title && <div style={{ fontSize:10.5, color:'#999', textTransform:'uppercase', letterSpacing:1.5, marginTop:5, ...cl(1) }}>{personal.title}</div>}
        </div>

        <div style={{ padding:'18px 26px', display:'flex', flexDirection:'column', gap:16 }}>

          {profile && (
            <div style={{ background:'white', border:'1px solid #eee', borderLeft:`4px solid ${p}`, padding:'12px 16px', borderRadius:'0 6px 6px 0' }}>
              <p style={{ fontSize:11.5, lineHeight:1.8, color:'#555', margin:0, ...cl(4) }}>{profile}</p>
            </div>
          )}

          {/* Expériences en timeline */}
          {experiences.length > 0 && (
            <section>
              <IndMainTitle t="EXPÉRIENCES" c={p} />
              <div style={{ position:'relative', marginTop:10 }}>
                {/* Ligne centrale */}
                <div style={{ position:'absolute', left:88, top:0, bottom:0, width:2, background:`${p}25` }} />
                <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
                  {experiences.map(exp => (
                    <div key={exp.id} style={{ display:'grid', gridTemplateColumns:'82px 14px 1fr', gap:10, alignItems:'flex-start' }}>
                      {/* Date à gauche */}
                      <div style={{ textAlign:'right', paddingTop:3 }}>
                        <div style={{ fontSize:9.5, color:'#bbb', lineHeight:1.6 }}>
                          {fmt(exp.startDate)}<br/>
                          <span style={{ color: exp.current ? p : '#bbb', fontWeight: exp.current ? 700 : 400 }}>
                            {exp.current ? 'Présent' : fmt(exp.endDate)}
                          </span>
                        </div>
                      </div>
                      {/* Point sur la ligne */}
                      <div style={{ display:'flex', justifyContent:'center', paddingTop:4 }}>
                        <div style={{ width:10, height:10, borderRadius:'50%', background:p, border:'2px solid white', boxShadow:`0 0 0 2px ${p}`, zIndex:1 }} />
                      </div>
                      {/* Contenu */}
                      <div style={{ background:'white', border:'1px solid #eee', borderRadius:6, padding:'10px 14px' }}>
                        <div style={{ fontSize:12.5, fontWeight:800, color:dark, textTransform:'uppercase', letterSpacing:0.2 }}>{exp.position}</div>
                        <div style={{ fontSize:11.5, color:p, fontWeight:600, marginBottom:4 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                        {exp.description && <p style={{ fontSize:11, color:'#777', lineHeight:1.65, margin:0, ...cl(3) }}>{exp.description}</p>}
                      </div>
                    </div>
                  ))}
                </div>
              </div>
            </section>
          )}

          {/* Compétences en tags */}
          {skills.length > 0 && (
            <section>
              <IndMainTitle t="COMPÉTENCES" c={p} />
              <div style={{ display:'flex', flexWrap:'wrap', gap:6, marginTop:8 }}>
                {skills.map(s => (
                  <span key={s.id} style={{ fontSize:11, color:dark, background:'white', border:`1px solid ${p}50`, padding:'5px 12px', borderRadius:4, fontWeight:500 }}>{s.name}</span>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>
    </div>
  );
}

function IndLabel({ t, c }: { t: string; c: string }) {
  return <div style={{ fontSize:9, fontWeight:800, letterSpacing:2, color:c, textTransform:'uppercase', marginBottom:9 }}>{t}</div>;
}
function IndMainTitle({ t, c }: { t: string; c: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10 }}>
      <div style={{ width:3, height:18, background:c, borderRadius:99 }} />
      <span style={{ fontSize:11, fontWeight:800, letterSpacing:2, color:'#222', textTransform:'uppercase' }}>{t}</span>
      <div style={{ flex:1, height:1, background:`${c}20` }} />
    </div>
  );
}