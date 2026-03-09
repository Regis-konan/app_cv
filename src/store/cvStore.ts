import { create } from 'zustand';
import type { CVData, Experience, Formation, Skill, Language, EditorStep, TemplateId } from '../types/cv.types';

interface CVStore {
  cvData: CVData;
  currentStep: EditorStep;
  isPreviewing: boolean;
  setStep: (step: EditorStep) => void;
  setIsPreviewing: (v: boolean) => void;
  updatePersonal: (data: Partial<CVData['personal']>) => void;
  updateProfile: (profile: string) => void;
  addExperience: (exp: Experience) => void;
  updateExperience: (id: string, exp: Partial<Experience>) => void;
  removeExperience: (id: string) => void;
  reorderExperiences: (experiences: Experience[]) => void;
  addFormation: (formation: Formation) => void;
  updateFormation: (id: string, formation: Partial<Formation>) => void;
  removeFormation: (id: string) => void;
  addSkill: (skill: Skill) => void;
  updateSkill: (id: string, skill: Partial<Skill>) => void;
  removeSkill: (id: string) => void;
  addLanguage: (language: Language) => void;
  updateLanguage: (id: string, language: Partial<Language>) => void;
  removeLanguage: (id: string) => void;
  updateDesign: (design: Partial<CVData['design']>) => void;
  resetCV: () => void;
  initWithTemplate: (templateId: TemplateId) => void;
}

// ==================== TEMPLATE ÉTUDIANT ====================
const studentCV: CVData = {
  personal: {
    firstName: "Emma",
    lastName: "Petit",
    title: "Étudiante en Master Marketing Digital – Recherche alternance",
    email: "emma.petit@etudiant.fr",
    phone: "+33 6 12 34 56 78",
    address: "Lyon, France",
    linkedin: "linkedin.com/in/emmapetit",
    website: "emmapetit-portfolio.fr",
    photoUrl: "",
  },
  profile: "Étudiante en Master 2 Marketing Digital à l'EM Lyon, je recherche un contrat d'alternance à partir de septembre 2024. Rigoureuse et passionnée par les nouvelles technologies, j'ai développé des compétences solides en analyse de données et en stratégie digitale lors de mes stages. Je souhaite mettre mon énergie au service d'une entreprise innovante pour contribuer à sa stratégie de croissance.",
  experiences: [
    {
      id: "s1",
      company: "L'Oréal – Division Produits Grand Public",
      position: "Assistante Marketing Digital – Paris (Stage)",
      startDate: "2024-02",
      endDate: "2024-07",
      current: false,
      description: "Création de contenus pour les réseaux sociaux de 3 marques. Analyse hebdomadaire des performances avec Google Analytics et Tableau. Participation au lancement influenceurs (150 invités). Suivi des KPIs : taux d'ouverture +32%, taux de clic +18%.",
      location: ""
    },
    {
      id: "s2",
      company: "Publicis Conseil",
      position: "Stagiaire Community Management – Lyon",
      startDate: "2023-06",
      endDate: "2023-08",
      current: false,
      description: "Gestion des comptes Instagram et LinkedIn pour 4 clients luxe. Calendriers éditoriaux avec Hootsuite, reporting hebdomadaire. Campagne ayant généré +15% d'engagement.",
      location: ""
    },
    {
      id: "s3",
      company: "Association Étudiante EM Lyon",
      position: "Responsable Communication",
      startDate: "2023-09",
      endDate: "",
      current: true,
      description: "Community management du Bureau des Arts (300+ membres). +40% d'abonnés en 6 mois. Coordination d'une équipe de 5 bénévoles.",
      location: ""
    }
  ],
  formations: [
    {
      id: "sf1",
      school: "EM Lyon Business School",
      degree: "Master 2 – Marketing Digital & Innovation",
      field: "",
      startDate: "2023-09",
      endDate: "2025-06",
      current: true,
      description: "Top 15% de la promotion. Cours : Stratégie digitale, Data Marketing & Analytics, Brand Content, E-commerce & Growth Hacking. Projet fin d'études : 'L'impact de l'IA générative dans les stratégies luxe' – Note : 16/20."
    },
    {
      id: "sf2",
      school: "Université Jean Moulin Lyon 3",
      degree: "Licence – Information-Communication",
      field: "",
      startDate: "2020-09",
      endDate: "2023-06",
      current: false,
      description: "Mention Assez Bien (12,8/20). Spécialisation en communication numérique et médias sociaux."
    }
  ],
  skills: [
    { id: "ss1", name: "Community Management", level: 5 },
    { id: "ss2", name: "Google Analytics 4", level: 4 },
    { id: "ss3", name: "Pack Office (Excel, PPT)", level: 5 },
    { id: "ss4", name: "Canva / Adobe Express", level: 5 },
    { id: "ss5", name: "SEO / SEA fondamentaux", level: 3 },
    { id: "ss6", name: "Meta Business Suite", level: 4 },
    { id: "ss7", name: "Mailchimp", level: 4 },
    { id: "ss8", name: "WordPress", level: 3 },
  ],
  languages: [
    { id: "sl1", name: "Français", level: "Natif" },
    { id: "sl2", name: "Anglais", level: "Courant" },
    { id: "sl3", name: "Espagnol", level: "Intermédiaire" }
  ],
  design: {
    template: "student",
    primaryColor: "#4A90E2",
    secondaryColor: "#F5F7FA",
    accentColor: "#F9A826",
    font: "dm-sans",
    spacing: "normal"
  }
};

// ==================== TEMPLATE TECH ====================
const techCV: CVData = {
  personal: {
    firstName: "Alexandre",
    lastName: "Moreau",
    title: "Lead Développeur Full Stack – Expert Cloud",
    email: "alex.moreau@dev.fr",
    phone: "+33 6 98 76 54 32",
    address: "Paris 11ème, France",
    linkedin: "linkedin.com/in/alexmoreau",
    website: "alexmoreau.dev",
    photoUrl: "",
  },
  profile: "Lead Développeur Full Stack avec 7 ans d'expérience, spécialisé dans les architectures cloud (AWS, GCP) et les applications à grande échelle (500k+ utilisateurs). J'ai dirigé des équipes de 5 à 8 développeurs sur des projets complexes en fintech et santé. Certifié AWS Solutions Architect et Kubernetes Administrator.",
  experiences: [
    {
      id: "t1",
      company: "Qonto",
      position: "Lead Développeur Full Stack",
      startDate: "2022-03",
      endDate: "",
      current: true,
      description: "Encadrement d'une équipe de 6 développeurs. Refonte de l'architecture microservices (15 → 30 services). CI/CD avec GitHub Actions et ArgoCD (déploiement -40%). Migration Node.js → Go pour les services critiques. API GraphQL unifiant 12 microservices. Stack : TypeScript, Go, Kubernetes, AWS EKS, PostgreSQL.",
      location: "Paris"
    },
    {
      id: "t2",
      company: "Alan",
      position: "Développeur Senior Full Stack",
      startDate: "2019-09",
      endDate: "2022-02",
      current: false,
      description: "Développement du dashboard patient et migration React → Next.js (+35% score Lighthouse). Tests Jest/Cypress à 85% de couverture. Event Sourcing avec Kafka. Stack : React, Next.js, TypeScript, Node.js, PostgreSQL.",
      location: "Paris"
    },
    {
      id: "t3",
      company: "Deezer",
      position: "Développeur Full Stack",
      startDate: "2017-02",
      endDate: "2019-08",
      current: false,
      description: "API REST pour les playlists collaboratives. Refonte de l'admin interne (React/Redux, 200+ utilisateurs). Optimisation backend : temps de réponse 350ms → 180ms grâce au cache Redis.",
      location: "Paris"
    }
  ],
  formations: [
    {
      id: "tf1",
      school: "École 42",
      degree: "Diplôme Expert en ingénierie logicielle",
      field: "",
      startDate: "2015-09",
      endDate: "2018-06",
      current: false,
      description: "Formation intensive peer-to-peer (15 000h de code). Projets : shell Unix en C, serveur HTTP multithread, algorithmes avancés. Spécialisation architecture logicielle et systèmes distribués."
    },
    {
      id: "tf2",
      school: "AWS Certifications en ligne",
      degree: "AWS Certified Solutions Architect – Associate",
      field: "",
      startDate: "2023-01",
      endDate: "2026-01",
      current: true,
      description: "Certification obtenue en janvier 2023. Formation continue sur EC2, S3, Lambda, ECS, RDS."
    }
  ],
  skills: [
    { id: "ts1", name: "TypeScript / JavaScript", level: 5 },
    { id: "ts2", name: "React / Next.js", level: 5 },
    { id: "ts3", name: "Node.js / Express", level: 5 },
    { id: "ts4", name: "Python (Django)", level: 4 },
    { id: "ts5", name: "Go", level: 3 },
    { id: "ts6", name: "Docker / Kubernetes", level: 5 },
    { id: "ts7", name: "AWS (ECS, EKS, Lambda)", level: 4 },
    { id: "ts8", name: "PostgreSQL / MySQL", level: 5 },
    { id: "ts9", name: "MongoDB / Redis", level: 4 },
    { id: "ts10", name: "GraphQL", level: 4 },
    { id: "ts11", name: "CI/CD (GitHub Actions)", level: 5 },
    { id: "ts12", name: "Terraform", level: 3 },
  ],
  languages: [
    { id: "tl1", name: "Français", level: "Natif" },
    { id: "tl2", name: "Anglais technique", level: "Courant" }
  ],
  design: {
    template: "tech",
    primaryColor: "#58A6FF",
    secondaryColor: "#0D1117",
    accentColor: "#FF7B72",
    font: "jakarta",
    spacing: "normal"
  }
};

// ==================== TEMPLATE BUSINESS ====================
const businessCV: CVData = {
  personal: {
    firstName: "Sophie",
    lastName: "Laurent",
    title: "Directrice Administrative et Financière – MBA HEC",
    email: "sophie.laurent@finance.fr",
    phone: "+33 6 72 34 56 78",
    address: "Neuilly-sur-Seine, France",
    linkedin: "linkedin.com/in/sophielaurent",
    website: "",
    photoUrl: "",
  },
  profile: "Directrice Administrative et Financière avec 12 ans d'expérience (PwC, Deloitte, LVMH). Expertise en gestion de la performance, contrôle de gestion international et opérations de M&A. Diplômée d'HEC Paris (MBA). Je souhaite mettre mon expérience au service d'une entreprise en croissance comme Directrice Financière ou DAF.",
  experiences: [
    {
      id: "b1",
      company: "LVMH – Division Montres & Joaillerie",
      position: "Directrice Administrative et Financière",
      startDate: "2020-01",
      endDate: "",
      current: true,
      description: "Pilotage financier d'une division 500M€ CA (6 marques, 15 pays). Management de 12 collaborateurs. Déploiement SAP S/4HANA (budget 2,5M€). Optimisation du BFR de 15% (économie 45M€). Due diligence pour l'acquisition d'une maison horlogère suisse.",
      location: "Paris"
    },
    {
      id: "b2",
      company: "PwC France",
      position: "Senior Manager Audit",
      startDate: "2015-04",
      endDate: "2019-12",
      current: false,
      description: "Audit de grands comptes (CACIB, TotalEnergies, L'Oréal). Supervision d'équipes de 5 à 8 collaborateurs. Certification des comptes consolidés IFRS. Participation à 4 introductions en bourse sur Euronext Paris.",
      location: "Paris"
    },
    {
      id: "b3",
      company: "Deloitte Lyon",
      position: "Auditrice Confirmée",
      startDate: "2011-09",
      endDate: "2015-03",
      current: false,
      description: "Audit légal et contractuel pour des PME/ETI (industrie, services, BTP). Due diligences M&A et rédaction des rapports pour les comités d'audit.",
      location: "Lyon"
    }
  ],
  formations: [
    {
      id: "bf1",
      school: "HEC Paris",
      degree: "MBA – Management & Finance",
      field: "",
      startDate: "2009-09",
      endDate: "2011-06",
      current: false,
      description: "Major de promotion (3e/220). Cours : Finance d'entreprise, LBO/M&A, Contrôle de gestion stratégique. Mémoire : 'L'impact de la digitalisation sur la fonction finance dans les groupes du CAC 40'."
    },
    {
      id: "bf2",
      school: "Université Paris-Dauphine",
      degree: "Master 1 – Économie-Gestion",
      field: "",
      startDate: "2006-09",
      endDate: "2009-06",
      current: false,
      description: "Mention Très Bien (15,8/20). Spécialisation finance d'entreprise et marchés financiers."
    }
  ],
  skills: [
    { id: "bs1", name: "Gestion budgétaire", level: 5 },
    { id: "bs2", name: "Comptabilité (IFRS/FR)", level: 5 },
    { id: "bs3", name: "Contrôle de gestion", level: 5 },
    { id: "bs4", name: "SAP S/4HANA", level: 4 },
    { id: "bs5", name: "Excel avancé (VBA, PowerPivot)", level: 5 },
    { id: "bs6", name: "Tableau de bord / KPI", level: 5 },
    { id: "bs7", name: "Management d'équipe", level: 5 },
    { id: "bs8", name: "Fusions-Acquisitions", level: 4 },
    { id: "bs9", name: "Anglais des affaires", level: 5 },
    { id: "bs10", name: "Power BI", level: 4 },
  ],
  languages: [
    { id: "bl1", name: "Français", level: "Natif" },
    { id: "bl2", name: "Anglais", level: "Courant" },
    { id: "bl3", name: "Allemand", level: "Avancé" }
  ],
  design: {
    template: "business",
    primaryColor: "#1E2B3A",
    secondaryColor: "#FFFFFF",
    accentColor: "#C9A959",
    font: "fraunces",
    spacing: "normal"
  }
};

// ==================== TEMPLATE MARKETING ====================
const marketingCV: CVData = {
  personal: {
    firstName: "Julie",
    lastName: "Marchand",
    title: "Directrice Marketing Digital – ROI & Performance",
    email: "julie.marchand@marketing.fr",
    phone: "+33 6 87 65 43 21",
    address: "Paris, France",
    linkedin: "linkedin.com/in/juliemarchand",
    website: "juliemarchand.com",
    photoUrl: "",
  },
  profile: "Directrice Marketing Digital avec 8 ans d'expérience en agence et chez l'annonceur. Expertise en stratégie de marque, acquisition digitale (SEA/SEO) et marketing d'influence. ROAS moyen : 5,2. J'ai généré plus de 15M€ de CA incrémental grâce à des stratégies data-driven.",
  experiences: [
    {
      id: "m1",
      company: "Havas Paris",
      position: "Directrice Conseil Digital",
      startDate: "2021-06",
      endDate: "",
      current: true,
      description: "Direction stratégique des comptes L'Oréal (Lancôme, Biotherm) et Danone (Evian, Actimel). Management d'une équipe de 8 consultants. Résultats : +45% d'engagement Instagram pour Lancôme, 12M de vues sur la campagne TikTok Evian. Budget géré : 8M€.",
      location: "Paris"
    },
    {
      id: "m2",
      company: "Publicis Conseil",
      position: "Cheffe de Groupe Marketing",
      startDate: "2018-02",
      endDate: "2021-05",
      current: false,
      description: "Pilotage des campagnes 360° pour Renault et Orange. Budget annuel 15M€. Négociation des achats d'espaces (-12% sur les tarifs). Stratégie de retargeting ayant augmenté le ROAS de 35%.",
      location: "Paris"
    },
    {
      id: "m3",
      company: "Ogilvy",
      position: "Chef de Projet Digital",
      startDate: "2016-01",
      endDate: "2018-01",
      current: false,
      description: "Projets digitaux pour Coca-Cola et IBM. Application de fidélité Coca-Cola : 100k téléchargements en 3 mois.",
      location: "Paris"
    }
  ],
  formations: [
    {
      id: "mf1",
      school: "Sciences Po Paris",
      degree: "Master – Communication & Marketing",
      field: "",
      startDate: "2014-09",
      endDate: "2016-06",
      current: false,
      description: "Stratégie de marque, Consumer insights, Media planning, Digital marketing. Mémoire : 'L'évolution des stratégies d'influence dans le luxe' – Mention Très Bien."
    },
    {
      id: "mf2",
      school: "CELSA – Sorbonne Université",
      degree: "Licence – Information-Communication",
      field: "",
      startDate: "2011-09",
      endDate: "2014-06",
      current: false,
      description: "Mention Bien. Spécialisation publicité et communication d'entreprise."
    }
  ],
  skills: [
    { id: "ms1", name: "Stratégie de marque", level: 5 },
    { id: "ms2", name: "Marketing d'influence", level: 5 },
    { id: "ms3", name: "Social Media (IG, TT, LI)", level: 5 },
    { id: "ms4", name: "SEO / SEA (Google Ads)", level: 4 },
    { id: "ms5", name: "Google Analytics 4", level: 4 },
    { id: "ms6", name: "Suite Adobe (PS, AI)", level: 4 },
    { id: "ms7", name: "Gestion de projet agile", level: 5 },
    { id: "ms8", name: "Anglais professionnel", level: 5 },
    { id: "ms9", name: "Marketing automation", level: 4 },
  ],
  languages: [
    { id: "ml1", name: "Français", level: "Natif" },
    { id: "ml2", name: "Anglais", level: "Courant" },
    { id: "ml3", name: "Italien", level: "Intermédiaire" }
  ],
  design: {
    template: "marketing",
    primaryColor: "#FF6B6B",
    secondaryColor: "#FFFFFF",
    accentColor: "#4ECDC4",
    font: "syne",
    spacing: "normal"
  }
};

// ==================== TEMPLATE SANTÉ ====================
const healthCV: CVData = {
  personal: {
    firstName: "Dr. Thomas",
    lastName: "Bernard",
    title: "Médecin Généraliste – Spécialisé en Gériatrie",
    email: "thomas.bernard@medecin.fr",
    phone: "+33 6 45 67 89 01",
    address: "Bordeaux, France",
    linkedin: "dr-bernard",
    website: "drbernard.fr",
    photoUrl: "",
  },
  profile: "Médecin généraliste installé en libéral depuis 5 ans, spécialisé en gériatrie et soins palliatifs (DU 2019). Approche centrée sur le patient âgé et la coordination pluridisciplinaire. Engagé en télémédecine. Je souhaite rejoindre une maison de santé pluridisciplinaire.",
  experiences: [
    {
      id: "h1",
      company: "Cabinet Médical des Chartrons",
      position: "Médecin Généraliste Libéral",
      startDate: "2019-09",
      endDate: "",
      current: true,
      description: "Suivi de 850 patients (35% âgés de 75+). 25 à 30 consultations/jour + 5 à 8 visites à domicile. Téléconsultation (20% de l'activité, plateforme Doctolib). Formation de 3 internes par an. Membre du réseau de soins palliatifs de Bordeaux.",
      location: "Bordeaux"
    },
    {
      id: "h2",
      company: "CHU de Bordeaux – Hôpital Pellegrin",
      position: "Chef de Clinique – Service Gériatrie",
      startDate: "2017-11",
      endDate: "2019-08",
      current: false,
      description: "Prise en charge de patients polypathologiques (25 lits). Encadrement de 5 à 6 étudiants par semestre. Publication dans 'Gériatrie et Psychologie' (2018) sur la dénutrition et les chutes.",
      location: "Bordeaux"
    },
    {
      id: "h3",
      company: "CHU de Bordeaux",
      position: "Interne en Médecine Générale",
      startDate: "2014-11",
      endDate: "2017-10",
      current: false,
      description: "6 stages de 6 mois : Médecine interne, Gériatrie, Soins palliatifs, Cardiologie, Urgences, Cabinet libéral. 200+ actes techniques réalisés sous supervision.",
      location: "Bordeaux"
    }
  ],
  formations: [
    {
      id: "hf1",
      school: "Université de Bordeaux",
      degree: "Diplôme d'État de Docteur en Médecine – Médecine Générale",
      field: "",
      startDate: "2007-09",
      endDate: "2017-10",
      current: false,
      description: "Thèse : 'Prise en charge de la douleur chronique chez le sujet âgé en EHPAD' – Mention Très Honorable avec félicitations du jury."
    },
    {
      id: "hf2",
      school: "Université de Bordeaux",
      degree: "Diplôme Universitaire – Soins Palliatifs et Accompagnement",
      field: "",
      startDate: "2018-09",
      endDate: "2019-06",
      current: false,
      description: "Formation complète : soins palliatifs, douleur, accompagnement de fin de vie, relation d'aide."
    },
    {
      id: "hf3",
      school: "Université de Bordeaux",
      degree: "DU Gériatrie",
      field: "",
      startDate: "2017-09",
      endDate: "2018-06",
      current: false,
      description: "Pathologies du vieillissement, syndromes gériatriques, organisation du parcours de soins."
    }
  ],
  skills: [
    { id: "hs1", name: "Médecine générale", level: 5 },
    { id: "hs2", name: "Gériatrie", level: 5 },
    { id: "hs3", name: "Soins palliatifs", level: 5 },
    { id: "hs4", name: "Urgences", level: 4 },
    { id: "hs5", name: "Pédiatrie courante", level: 3 },
    { id: "hs6", name: "Gestion de cabinet", level: 4 },
    { id: "hs7", name: "Communication / Relation d'aide", level: 5 },
    { id: "hs8", name: "Télémédecine", level: 4 },
    { id: "hs9", name: "Formation des internes", level: 4 },
  ],
  languages: [
    { id: "hl1", name: "Français", level: "Natif" },
    { id: "hl2", name: "Anglais médical", level: "Courant" }
  ],
  design: {
    template: "health",
    primaryColor: "#52B788",
    secondaryColor: "#FFFFFF",
    accentColor: "#74C69D",
    font: "dm-sans",
    spacing: "normal"
  }
};

// ==================== TEMPLATE INDUSTRIE ====================
const industryCV: CVData = {
  personal: {
    firstName: "Laurent",
    lastName: "Dupont",
    title: "Chef de Chantier BTP – Grands Projets",
    email: "laurent.dupont@btp.fr",
    phone: "+33 6 23 45 67 89",
    address: "Nantes, France",
    linkedin: "linkedin.com/in/laurentdupont",
    website: "",
    photoUrl: "",
  },
  profile: "Chef de chantier avec 12 ans d'expérience en construction et rénovation (logements collectifs, bureaux, ERP). Expert en coordination des corps de métier (25 entreprises simultanées) et respect des normes de sécurité. Diplômé ESTP Paris, projets jusqu'à 15M€ pour Bouygues, Vinci, Eiffage.",
  experiences: [
    {
      id: "i1",
      company: "Vinci Construction France",
      position: "Chef de Chantier Confirmé",
      startDate: "2019-03",
      endDate: "",
      current: true,
      description: "Pilotage de 3 opérations de logements collectifs (45, 60 et 80 logements) – total 24M€. Encadrement de 15 à 25 ouvriers. Coordination de 15 à 20 corps d'état. 0 accident sur les 3 chantiers. Négociation avenants sous-traitants : économies de 250k€.",
      location: "Nantes"
    },
    {
      id: "i2",
      company: "Bouygues Bâtiment Grand Ouest",
      position: "Conducteur de Travaux",
      startDate: "2015-09",
      endDate: "2019-02",
      current: false,
      description: "Rénovation d'immeubles de bureaux (8 000 m² et 12 000 m²) pour La Poste et le Crédit Agricole. Coordination de 10 à 15 entreprises. Budget global 9M€ respecté.",
      location: "Rennes"
    },
    {
      id: "i3",
      company: "Eiffage Construction",
      position: "Technicien de Chantier",
      startDate: "2012-02",
      endDate: "2015-08",
      current: false,
      description: "Assistance chef de chantier sur des centres commerciaux en région parisienne. Plans d'exécution Autocad, suivi des approvisionnements, relevés de quantités.",
      location: "Paris"
    }
  ],
  formations: [
    {
      id: "if1",
      school: "ESTP Paris",
      degree: "Ingénieur Bâtiment et Travaux Publics",
      field: "",
      startDate: "2009-09",
      endDate: "2012-01",
      current: false,
      description: "Spécialisation construction durable. Cours : Résistance des matériaux, Béton armé, Géotechnique, Économie de la construction, Droit des marchés publics, HQE."
    },
    {
      id: "if2",
      school: "IUT de Rennes",
      degree: "DUT Génie Civil – Construction Durable",
      field: "",
      startDate: "2007-09",
      endDate: "2009-06",
      current: false,
      description: "Topographie, Dessin de bâtiment, Matériaux, Résistance des structures. Stage 10 semaines chez Bouygues Construction."
    }
  ],
  skills: [
    { id: "is1", name: "Lecture de plans", level: 5 },
    { id: "is2", name: "Management d'équipe", level: 5 },
    { id: "is3", name: "Autocad", level: 4 },
    { id: "is4", name: "Gestion de budget", level: 5 },
    { id: "is5", name: "Sécurité (CSCS, PPSPS)", level: 5 },
    { id: "is6", name: "Planification MS Project", level: 4 },
    { id: "is7", name: "Anglais technique", level: 3 },
    { id: "is8", name: "Réglementation RT2012/RE2020", level: 5 },
    { id: "is9", name: "Négociation", level: 4 },
    { id: "is10", name: "Pack Office", level: 4 },
  ],
  languages: [
    { id: "il1", name: "Français", level: "Natif" },
    { id: "il2", name: "Anglais technique", level: "Intermédiaire" }
  ],
  design: {
    template: "industry",
    primaryColor: "#9C6644",
    secondaryColor: "#F5F0EB",
    accentColor: "#E9C46A",
    font: "dm-sans",
    spacing: "normal"
  }
};

// ==================== STORE ====================
const defaultCV: CVData = studentCV;

const templateData: Record<TemplateId, CVData> = {
  student: studentCV,
  tech: techCV,
  business: businessCV,
  marketing: marketingCV,
  health: healthCV,
  industry: industryCV
};

export const useCVStore = create<CVStore>()((set) => ({
  cvData: defaultCV,
  currentStep: 'infos',
  isPreviewing: false,

  setStep: (step) => set({ currentStep: step }),
  setIsPreviewing: (v) => set({ isPreviewing: v }),

  updatePersonal: (data) =>
    set((state) => ({
      cvData: { ...state.cvData, personal: { ...state.cvData.personal, ...data } },
    })),

  updateProfile: (profile) =>
    set((state) => ({ cvData: { ...state.cvData, profile } })),

  addExperience: (exp) =>
    set((state) => ({
      cvData: { ...state.cvData, experiences: [exp, ...state.cvData.experiences] },
    })),

  updateExperience: (id, exp) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        experiences: state.cvData.experiences.map((e) =>
          e.id === id ? { ...e, ...exp } : e
        ),
      },
    })),

  removeExperience: (id) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        experiences: state.cvData.experiences.filter((e) => e.id !== id),
      },
    })),

  reorderExperiences: (experiences) =>
    set((state) => ({ cvData: { ...state.cvData, experiences } })),

  addFormation: (formation) =>
    set((state) => ({
      cvData: { ...state.cvData, formations: [formation, ...state.cvData.formations] },
    })),

  updateFormation: (id, formation) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        formations: state.cvData.formations.map((f) =>
          f.id === id ? { ...f, ...formation } : f
        ),
      },
    })),

  removeFormation: (id) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        formations: state.cvData.formations.filter((f) => f.id !== id),
      },
    })),

  addSkill: (skill) =>
    set((state) => ({
      cvData: { ...state.cvData, skills: [...state.cvData.skills, skill] },
    })),

  updateSkill: (id, skill) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        skills: state.cvData.skills.map((s) => (s.id === id ? { ...s, ...skill } : s)),
      },
    })),

  removeSkill: (id) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        skills: state.cvData.skills.filter((s) => s.id !== id),
      },
    })),

  addLanguage: (language) =>
    set((state) => ({
      cvData: { ...state.cvData, languages: [...state.cvData.languages, language] },
    })),

  updateLanguage: (id, language) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        languages: state.cvData.languages.map((l) =>
          l.id === id ? { ...l, ...language } : l
        ),
      },
    })),

  removeLanguage: (id) =>
    set((state) => ({
      cvData: {
        ...state.cvData,
        languages: state.cvData.languages.filter((l) => l.id !== id),
      },
    })),

  updateDesign: (design) =>
    set((state) => ({
      cvData: { ...state.cvData, design: { ...state.cvData.design, ...design } },
    })),

  resetCV: () => set({ cvData: defaultCV, currentStep: 'infos' }),

  initWithTemplate: (templateId) =>
    set(() => ({
      cvData: templateData[templateId] || defaultCV,
      currentStep: 'infos'
    })),
}));