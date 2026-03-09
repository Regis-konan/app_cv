export type TemplateId = 
  | 'student' | 'tech' | 'business' | 'marketing' | 'health' | 'industry';

export type FontId = 'jakarta' | 'fraunces' | 'syne' | 'dm-sans';
export type SpacingId = 'compact' | 'normal' | 'relaxed';

export interface Personal {
  firstName: string;
  lastName: string;
  title: string;
  email: string;
  phone: string;
  address: string;
  linkedin: string;
  website: string;
  github?: string;
  photoUrl?: string;
}

export interface Experience {
  id: string;
  company: string;
  position: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description: string;
  location?: string;
}

export interface Formation {
  id: string;
  school: string;
  degree: string;
  field: string;
  startDate: string;
  endDate: string;
  current: boolean;
  description?: string;
}

export interface Skill {
  id: string;
  name: string;
  level: 1 | 2 | 3 | 4 | 5;
  category?: string;
}

export interface Language {
  id: string;
  name: string;
  level: 'Débutant' | 'Intermédiaire' | 'Avancé' | 'Courant' | 'Natif';
}

export interface Design {
  template: TemplateId;
  primaryColor: string;
  secondaryColor: string;
  accentColor: string;
  font: FontId;
  spacing: SpacingId;
}

export interface CVData {
  personal: Personal;
  profile: string;
  experiences: Experience[];
  formations: Formation[];
  skills: Skill[];
  languages: Language[];
  design: Design;
}

export type EditorStep = 'infos' | 'experience' | 'formation' | 'skills' | 'design';