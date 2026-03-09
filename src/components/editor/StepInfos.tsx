import { useRef } from 'react';
import { Camera, Mail, Phone, MapPin, Linkedin, Globe, User, Info } from 'lucide-react';
import { useCVStore } from '../../store/cvStore';

export default function StepInfos() {
  const { cvData, updatePersonal, updateProfile } = useCVStore();
  const { personal, profile } = cvData;
  const fileRef = useRef<HTMLInputElement>(null);

  const initials = `${personal.firstName?.[0]??''}${personal.lastName?.[0]??''}`.toUpperCase();

  const handlePhoto = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    const reader = new FileReader();
    reader.onload = (ev) => {
      const dataUrl = ev.target?.result as string;
      const img = new Image();
      img.onload = () => {
        const canvas = document.createElement('canvas');
        const MAX = 400;
        const ratio = Math.min(MAX / img.width, MAX / img.height, 1);
        canvas.width  = Math.round(img.width  * ratio);
        canvas.height = Math.round(img.height * ratio);
        canvas.getContext('2d')!.drawImage(img, 0, 0, canvas.width, canvas.height);
        updatePersonal({ photoUrl: canvas.toDataURL('image/jpeg', 0.88) });
      };
      img.src = dataUrl;
    };
    reader.readAsDataURL(file);
  };

  return (
    <div style={{ display:'flex', flexDirection:'column', gap:24 }}>

      {/* ── Bannière d'aide ── */}
      <div style={{
        display: 'flex',
        alignItems: 'flex-start',
        gap: 10,
        padding: '12px 14px',
        background: 'var(--terra-light)',
        border: '1px solid rgba(180,80,60,0.18)',
        borderRadius: 10,
        fontSize: 12,
        color: 'var(--gray)',
        lineHeight: 1.6,
      }}>
        <Info size={15} style={{ color: 'var(--terra)', flexShrink: 0, marginTop: 1 }} />
        <span>
          <strong style={{ color: 'var(--dark)' }}>Ces informations sont des exemples</strong> — remplacez-les par les vôtres.
          Cliquez sur n'importe quel champ pour le modifier.
        </span>
      </div>

      {/* ── Photo ── */}
      <div>
        <p className="form-section-title">Photo de profil</p>
        <div className="photo-block">
          <div
            className="photo-avatar"
            onClick={() => fileRef.current?.click()}
            style={{ cursor:'pointer' }}
          >
            {personal.photoUrl
              ? <img src={personal.photoUrl} alt="Photo" />
              : <span className="photo-avatar-initials">{initials || <User size={22}/>}</span>
            }
            <button className="photo-change-btn" type="button" tabIndex={-1}>
              <Camera size={10} strokeWidth={2.5} />
            </button>
          </div>
          <div className="photo-meta">
            <p>Recommandée sur tous les templates</p>
            <small>JPG ou PNG · max 5 Mo</small>
            <div className="photo-meta-btns">
              <button className="btn-photo-add" onClick={() => fileRef.current?.click()}>
                {personal.photoUrl ? 'Changer' : 'Ajouter une photo'}
              </button>
              {personal.photoUrl && (
                <button className="btn-photo-del" onClick={() => updatePersonal({ photoUrl: '' })}>
                  Supprimer
                </button>
              )}
            </div>
          </div>
          <input ref={fileRef} type="file" accept="image/*" hidden onChange={handlePhoto} />
        </div>
      </div>

      <div className="form-divider" />

      {/* ── Identité ── */}
      <div>
        <p className="form-section-title">Identité</p>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="firstName">Prénom</label>
              <input
                id="firstName" className="form-input"
                value={personal.firstName}
                onChange={e => updatePersonal({ firstName: e.target.value })}
                placeholder="Emma"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="lastName">Nom</label>
              <input
                id="lastName" className="form-input"
                value={personal.lastName}
                onChange={e => updatePersonal({ lastName: e.target.value })}
                placeholder="Dupont"
              />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="title">Titre professionnel</label>
            <input
              id="title" className="form-input"
              value={personal.title}
              onChange={e => updatePersonal({ title: e.target.value })}
              placeholder="Développeur Full Stack · Infirmière DE · DAF..."
            />
            <p className="form-helper">S'affiche sous votre nom sur le CV</p>
          </div>
        </div>
      </div>

      <div className="form-divider" />

      {/* ── Contact ── */}
      <div>
        <p className="form-section-title">Contact</p>
        <div style={{ display:'flex', flexDirection:'column', gap:14 }}>
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="email">
                <Mail size={11}/> Email
              </label>
              <input
                id="email" type="email" className="form-input"
                value={personal.email}
                onChange={e => updatePersonal({ email: e.target.value })}
                placeholder="emma@email.com"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="phone">
                <Phone size={11}/> Téléphone
              </label>
              <input
                id="phone" type="tel" className="form-input"
                value={personal.phone}
                onChange={e => updatePersonal({ phone: e.target.value })}
                placeholder="+33 6 12 34 56 78"
              />
            </div>
          </div>
          <div className="form-field">
            <label className="form-label" htmlFor="address">
              <MapPin size={11}/> Ville / Adresse
            </label>
            <input
              id="address" className="form-input"
              value={personal.address}
              onChange={e => updatePersonal({ address: e.target.value })}
              placeholder="Paris, France"
            />
          </div>
          <div className="form-grid-2">
            <div className="form-field">
              <label className="form-label" htmlFor="linkedin">
                <Linkedin size={11}/> LinkedIn
              </label>
              <input
                id="linkedin" className="form-input"
                value={personal.linkedin}
                onChange={e => updatePersonal({ linkedin: e.target.value })}
                placeholder="linkedin.com/in/emma"
              />
            </div>
            <div className="form-field">
              <label className="form-label" htmlFor="website">
                <Globe size={11}/> Site web / Portfolio
              </label>
              <input
                id="website" className="form-input"
                value={personal.website}
                onChange={e => updatePersonal({ website: e.target.value })}
                placeholder="emma-portfolio.fr"
              />
            </div>
          </div>
        </div>
      </div>

      <div className="form-divider" />

      {/* ── Résumé professionnel ── */}
      <div>
        <p className="form-section-title">Résumé professionnel</p>
        <p style={{ fontSize:11, color:'var(--ash)', marginBottom:10, lineHeight:1.6 }}>
          2 à 4 phrases qui résument votre profil. Affiché en haut de votre CV.
        </p>
        <div className="form-field">
          <textarea
            className="form-textarea"
            rows={5}
            value={profile}
            onChange={e => updateProfile(e.target.value)}
            maxLength={600}
            style={{ minHeight:110 }}
            placeholder="Ex : Ingénieur logiciel avec 5 ans d'expérience en développement web, spécialisé React et Node.js. J'ai piloté des projets pour des équipes de 10 personnes et livré des produits utilisés par +50k utilisateurs..."
          />
          <span className="form-counter">{profile.length} / 600</span>
        </div>
      </div>

    </div>
  );
}