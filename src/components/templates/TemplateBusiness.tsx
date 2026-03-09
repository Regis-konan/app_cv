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

export default function TemplateBusiness({ cv }: Props) {
  const { personal, profile, experiences, formations, skills, languages, design } = cv;
  // FIX: était design.accentColor — doit être primaryColor pour suivre le color picker
  const gold = design.primaryColor;
  const dark = '#1C1C1C';

  const contacts = [
    { label:'Téléphone', v: personal.phone },
    { label:'Email',     v: personal.email },
    { label:'Adresse',   v: personal.address },
    { label:'LinkedIn',  v: personal.linkedin },
    { label:'Site',      v: personal.website },
  ].filter(c => c.v?.trim());

  return (
    <div className="cv-root" data-font={design.font} data-spacing={design.spacing}>

      {/* ── MAIN gauche ── */}
      <main style={{ flex:1, display:'flex', flexDirection:'column', minWidth:0, background:'white' }}>

        {/* Header avec grand nom + trait or */}
        <div style={{ padding:'32px 30px 0', borderBottom:`1px solid #f0f0f0`, paddingBottom:20 }}>
          {personal.title && (
            <div style={{ fontSize:9.5, fontWeight:700, letterSpacing:3, color:'#bbb', textTransform:'uppercase', marginBottom:8 }}>{personal.title}</div>
          )}
          <div style={{ fontSize:32, fontWeight:900, color:dark, lineHeight:0.95, letterSpacing:-1 }}>
            {personal.firstName}<br/>
            <span style={{ color:gold }}>{personal.lastName?.toUpperCase()}</span>
          </div>
          <div style={{ width:48, height:3, background:gold, borderRadius:99, marginTop:14 }} />
        </div>

        <div style={{ padding:'20px 30px', display:'flex', flexDirection:'column', gap:18 }}>

          {/* Profil */}
          {profile && (
            <section>
              <BizTitle t="PROFIL" gold={gold} />
              <p style={{ fontSize:11.5, lineHeight:1.8, color:'#555', margin:'8px 0 0', ...cl(4) }}>{profile}</p>
            </section>
          )}

          {/* Expériences */}
          {experiences.length > 0 && (
            <section>
              <BizTitle t="EXPÉRIENCES PROFESSIONNELLES" gold={gold} />
              <div style={{ display:'flex', flexDirection:'column', gap:13, marginTop:10 }}>
                {experiences.map(exp => (
                  <div key={exp.id} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:14 }}>
                    <div style={{ textAlign:'right', paddingTop:2 }}>
                      <div style={{ fontSize:10, color:'#bbb', lineHeight:1.6 }}>
                        {fmt(exp.startDate)}<br/>
                        <span style={{ color: exp.current ? gold : '#bbb', fontWeight: exp.current ? 700 : 400 }}>
                          {exp.current ? 'Présent' : fmt(exp.endDate)}
                        </span>
                      </div>
                    </div>
                    <div style={{ borderLeft:`2px solid ${gold}40`, paddingLeft:14, position:'relative' }}>
                      <div style={{ position:'absolute', left:-5, top:5, width:7, height:7, borderRadius:'50%', background:gold }} />
                      <div style={{ fontSize:12.5, fontWeight:800, color:dark, textTransform:'uppercase', letterSpacing:0.2 }}>{exp.position}</div>
                      <div style={{ fontSize:11.5, color:'#888', marginBottom:4 }}>{exp.company}{exp.location ? ` · ${exp.location}` : ''}</div>
                      {exp.description && <p style={{ fontSize:11, color:'#999', lineHeight:1.65, margin:0, ...cl(3) }}>{exp.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}

          {/* Formation */}
          {formations.length > 0 && (
            <section>
              <BizTitle t="FORMATION" gold={gold} />
              <div style={{ display:'flex', flexDirection:'column', gap:10, marginTop:10 }}>
                {formations.map(f => (
                  <div key={f.id} style={{ display:'grid', gridTemplateColumns:'80px 1fr', gap:14 }}>
                    <div style={{ textAlign:'right', paddingTop:2 }}>
                      <div style={{ fontSize:10, color:'#bbb', lineHeight:1.6 }}>
                        {fmt(f.startDate)}<br/>{f.current ? 'En cours' : fmt(f.endDate)}
                      </div>
                    </div>
                    <div style={{ borderLeft:`2px solid ${gold}40`, paddingLeft:14, position:'relative' }}>
                      <div style={{ position:'absolute', left:-5, top:5, width:7, height:7, borderRadius:'50%', background:gold }} />
                      <div style={{ fontSize:12.5, fontWeight:800, color:dark }}>{f.school}</div>
                      <div style={{ fontSize:11.5, color:gold, fontWeight:600 }}>{f.degree}</div>
                      {f.description && <p style={{ fontSize:10.5, color:'#aaa', margin:'3px 0 0', lineHeight:1.6, ...cl(2) }}>{f.description}</p>}
                    </div>
                  </div>
                ))}
              </div>
            </section>
          )}
        </div>
      </main>

      {/* ── SIDEBAR DROITE noire ── */}
      <aside style={{ width:210, background:dark, display:'flex', flexDirection:'column', flexShrink:0 }}>

        {/* Photo carré avec coin coupé */}
        <div style={{ position:'relative', margin:'28px auto 0', width:130, height:130, flexShrink:0 }}>
          <div style={{
            width:130, height:130,
            clipPath:'polygon(0 0, 85% 0, 100% 15%, 100% 100%, 0 100%)',
            overflow:'hidden',
            border:`2px solid ${gold}`,
          }}>
            {personal.photoUrl
              ? <img src={personal.photoUrl} alt="" style={{ width:'100%', height:'100%', objectFit:'cover', display:'block' }} />
              : <div style={{ width:'100%', height:'100%', background:`${gold}20`, display:'flex', alignItems:'center', justifyContent:'center', fontSize:36, fontWeight:900, color:gold }}>{personal.firstName?.[0]}{personal.lastName?.[0]}</div>
            }
          </div>
          {/* Coin décoratif or */}
          <div style={{ position:'absolute', top:0, right:0, width:0, height:0, borderTop:`22px solid ${gold}`, borderLeft:'22px solid transparent' }} />
        </div>

        {/* Nom dans sidebar */}
        <div style={{ padding:'14px 18px 0', textAlign:'center' }}>
          <div style={{ fontSize:12, fontWeight:700, color:'white', lineHeight:1.3 }}>{personal.firstName} {personal.lastName}</div>
          {personal.title && <div style={{ fontSize:9, color:gold, marginTop:3, lineHeight:1.4, ...cl(2) }}>{personal.title}</div>}
        </div>

        <div style={{ width:'60%', height:1, background:`${gold}30`, margin:'12px auto' }} />

        {/* Contact */}
        {contacts.length > 0 && (
          <SideBlock t="CONTACT" gold={gold}>
            {contacts.map((c,i) => (
              <div key={i} style={{ marginBottom:8 }}>
                <div style={{ fontSize:8.5, fontWeight:700, color:gold, letterSpacing:1, textTransform:'uppercase' }}>{c.label}</div>
                <div style={{ fontSize:10.5, color:'rgba(255,255,255,0.55)', lineHeight:1.4, wordBreak:'break-all', ...cl(2) }}>{c.v}</div>
              </div>
            ))}
          </SideBlock>
        )}

        {/* Compétences */}
        {skills.length > 0 && (
          <SideBlock t="COMPÉTENCES" gold={gold}>
            <div style={{ display:'flex', flexWrap:'wrap', gap:5 }}>
              {skills.map(s => (
                <span key={s.id} style={{ fontSize:9.5, color:'rgba(255,255,255,0.7)', background:'rgba(255,255,255,0.07)', border:`1px solid ${gold}30`, padding:'3px 8px', borderRadius:3 }}>{s.name}</span>
              ))}
            </div>
          </SideBlock>
        )}

        {/* Langues */}
        {languages.length > 0 && (
          <SideBlock t="LANGUES" gold={gold}>
            {languages.map(l => (
              <div key={l.id} style={{ display:'flex', justifyContent:'space-between', alignItems:'center', marginBottom:6 }}>
                <span style={{ fontSize:11, color:'rgba(255,255,255,0.7)' }}>{l.name}</span>
                <span style={{ fontSize:9, color:gold, background:`${gold}15`, padding:'2px 6px', borderRadius:99 }}>{l.level}</span>
              </div>
            ))}
          </SideBlock>
        )}
      </aside>
    </div>
  );
}

function BizTitle({ t, gold }: { t: string; gold: string }) {
  return (
    <div style={{ display:'flex', alignItems:'center', gap:10, marginBottom:2 }}>
      <span style={{ fontSize:10.5, fontWeight:800, letterSpacing:2, color:'#111', textTransform:'uppercase' }}>{t}</span>
      <div style={{ flex:1, height:1, background:`${gold}40` }} />
    </div>
  );
}
function SideBlock({ t, gold, children }: { t: string; gold: string; children: React.ReactNode }) {
  return (
    <div style={{ padding:'10px 18px', borderTop:'1px solid rgba(255,255,255,0.06)' }}>
      <div style={{ fontSize:8.5, fontWeight:800, letterSpacing:2, color:gold, textTransform:'uppercase', marginBottom:10 }}>{t}</div>
      {children}
    </div>
  );
}