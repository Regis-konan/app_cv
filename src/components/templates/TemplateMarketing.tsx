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
function lvl(l: string) {
  return ({'Débutant':1,'Intermédiaire':2,'Avancé':3,'Courant':4,'Natif':5}[l]??3);
}

function MagTitle({ t, c }: { t: string; c: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:14, marginBottom:14 }}>
      <span style={{ fontSize:10, fontWeight:800, letterSpacing:3, textTransform:'uppercase', color:c }}>{t}</span>
      <div style={{ flex:1, height:1, background:`${c}30` }} />
    </div>
  );
}

export default function TemplateMarketing({ cv }: Props) {
  const { personal, profile, experiences, formations, skills, languages, design } = cv;
  const p = design.primaryColor;

  const contacts = [
    { label:'Tél.',     val: personal.phone },
    { label:'Email',    val: personal.email },
    { label:'Adresse',  val: personal.address },
    { label:'LinkedIn', val: personal.linkedin },
    { label:'Site',     val: personal.website },
  ].filter(c => c.val?.trim());

  return (
    <div className="cv-root" data-font={design.font} data-spacing={design.spacing}
      style={{ flexDirection:'column', background:'#FAF8F5' }}>

      {/* ══ HEADER MAGAZINE ════════════════════════════════════ */}
      <div style={{ background:'#1A1A1A', padding:'32px 44px 28px', flexShrink:0, position:'relative', overflow:'hidden' }}>
        {/* Grande initiale watermark */}
        <div style={{ position:'absolute', right:24, top:-20, fontSize:220, fontWeight:900, color:'rgba(255,255,255,0.03)', lineHeight:1, userSelect:'none', fontFamily:'serif', pointerEvents:'none' }}>
          {personal.lastName?.[0]}
        </div>

        <div style={{ display:'flex', alignItems:'center', gap:24, position:'relative', zIndex:1 }}>
          {/* Photo ronde */}
          <div style={{ width:88, height:88, borderRadius:'50%', border:`3px solid ${p}`, overflow:'hidden', flexShrink:0, boxShadow:`0 0 0 5px ${p}25` }}>
            {personal.photoUrl
              ? <img src={personal.photoUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              : <div style={{ width:'100%', height:'100%', background:`${p}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:26, fontWeight:900, color:p }}>{personal.firstName?.[0]}{personal.lastName?.[0]}</div>
            }
          </div>

          {/* Nom */}
          <div style={{ flex:1 }}>
            <div style={{ fontSize:11, color:'rgba(255,255,255,0.3)', letterSpacing:3, textTransform:'uppercase', marginBottom:5 }}>{personal.title}</div>
            <div style={{ fontSize:36, fontWeight:900, color:'white', lineHeight:0.95, letterSpacing:-1 }}>
              {personal.firstName} <span style={{ color:p }}>{personal.lastName}</span>
            </div>
          </div>

          {/* Contacts */}
          {contacts.length > 0 && (
            <div style={{ display:'flex', flexDirection:'column', gap:5, alignItems:'flex-end', flexShrink:0 }}>
              {contacts.map((c,i) => (
                <div key={i} style={{ textAlign:'right' }}>
                  <span style={{ fontSize:8.5, fontWeight:700, color:p, letterSpacing:1, textTransform:'uppercase' }}>{c.label} </span>
                  <span style={{ fontSize:10.5, color:'rgba(255,255,255,0.5)' }}>{c.val}</span>
                </div>
              ))}
            </div>
          )}
        </div>
      </div>

      {/* Trait couleur */}
      <div style={{ height:4, background:p, flexShrink:0 }} />

      {/* ══ BODY FULL WIDTH ════════════════════════════════════ */}
      <div style={{ flex:1, padding:'24px 44px', display:'flex', flexDirection:'column', gap:22 }}>

        {/* Profil — quote style */}
        {profile && (
          <div style={{ borderLeft:`4px solid ${p}`, paddingLeft:18 }}>
            <p style={{ fontSize:13, lineHeight:1.85, color:'#555', margin:0, fontStyle:'italic', ...cl(4) }}>{profile}</p>
          </div>
        )}

        {/* ── Expériences full width ── */}
        {experiences.length > 0 && (
          <section>
            <MagTitle t="Expériences" c={p} />
            <div style={{ display:'flex', flexDirection:'column', gap:16 }}>
              {experiences.map(exp => (
                <div key={exp.id} style={{ display:'grid', gridTemplateColumns:'120px 1fr', gap:20, paddingBottom:16, borderBottom:'1px solid #EDE8E2' }}>
                  <div>
                    <div style={{ fontSize:10, color:'#bbb', lineHeight:1.6 }}>
                      {fmt(exp.startDate)}<br/>
                      <span style={{ color: exp.current ? p : '#bbb', fontWeight: exp.current ? 700 : 400 }}>
                        {exp.current ? 'Présent' : fmt(exp.endDate)}
                      </span>
                    </div>
                    <div style={{ fontSize:11, fontWeight:700, color:'#333', marginTop:5, ...cl(2) }}>{exp.company}</div>
                    {exp.location && <div style={{ fontSize:10, color:'#bbb' }}>{exp.location}</div>}
                  </div>
                  <div>
                    <div style={{ fontSize:14, fontWeight:800, color:'#1A1A1A', letterSpacing:-0.3, marginBottom:5 }}>{exp.position}</div>
                    {exp.description && <p style={{ fontSize:11.5, color:'#666', lineHeight:1.75, margin:0, ...cl(3) }}>{exp.description}</p>}
                  </div>
                </div>
              ))}
            </div>
          </section>
        )}

        {/* ── 3 colonnes : Skills | Formation | Langues ── */}
        <div style={{ display:'grid', gridTemplateColumns:'1fr 1fr 1fr', gap:32 }}>

          {skills.length > 0 && (
            <section>
              <MagTitle t="Compétences" c={p} />
              <div style={{ display:'flex', flexWrap:'wrap', gap:6 }}>
                {skills.map(s => (
                  <span key={s.id} style={{ fontSize:10.5, color:'#333', background:'white', border:`1px solid ${p}40`, padding:'4px 11px', borderRadius:99, fontWeight:500 }}>{s.name}</span>
                ))}
              </div>
            </section>
          )}

          {formations.length > 0 && (
            <section>
              <MagTitle t="Formation" c={p} />
              <div style={{ display:'flex', flexDirection:'column', gap:12 }}>
                {formations.map(f => (
                  <div key={f.id}>
                    <div style={{ fontSize:10, color:'#bbb', marginBottom:2 }}>{fmt(f.startDate)} — {f.current ? 'En cours' : fmt(f.endDate)}</div>
                    <div style={{ fontSize:12.5, fontWeight:800, color:'#1A1A1A', letterSpacing:-0.2 }}>{f.school}</div>
                    <div style={{ fontSize:11, color:p, fontWeight:600, marginTop:1 }}>{f.degree}</div>
                    {f.description && <p style={{ fontSize:10.5, color:'#888', margin:'3px 0 0', lineHeight:1.6, ...cl(2) }}>{f.description}</p>}
                  </div>
                ))}
              </div>
            </section>
          )}

          {languages.length > 0 && (
            <section>
              <MagTitle t="Langues" c={p} />
              <div style={{ display:'flex', flexDirection:'column', gap:10 }}>
                {languages.map(l => {
                  const f = lvl(l.level);
                  return (
                    <div key={l.id}>
                      <div style={{ display:'flex', justifyContent:'space-between', marginBottom:5 }}>
                        <span style={{ fontSize:12, color:'#333', fontWeight:600 }}>{l.name}</span>
                        <span style={{ fontSize:10, color:'#aaa' }}>{l.level}</span>
                      </div>
                      <div style={{ display:'flex', gap:4 }}>
                        {[1,2,3,4,5].map(n => (
                          <div key={n} style={{ height:6, flex:1, borderRadius:99, background: n <= f ? p : `${p}20` }} />
                        ))}
                      </div>
                    </div>
                  );
                })}
              </div>
            </section>
          )}
        </div>
      </div>
    </div>
  );
}