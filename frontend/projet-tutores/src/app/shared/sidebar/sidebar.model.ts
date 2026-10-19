export type UserRole = 'etudiant' | 'enseignant' | 'responsable' | 'admin';

export interface NavItem {
  label: string;
  icon: string;
  route: string;
  badge?: string | number;
  badgeClass?: string;
}

export interface NavSection {
  title: string;
  items: NavItem[];
}

export interface UserProfile {
  name: string;
  role: string;
  avatarUrl?: string;
  initials?: string;
  avatarBgColor?: string;
  showConnectedStatus?: boolean;
}

export interface RoleConfig {
  subtitle: string;
  sections: NavSection[];
  user: UserProfile;
}

export const ROLE_CONFIGS: Record<UserRole, RoleConfig> = {
  etudiant: {
    subtitle: 'PORTAIL UNIVERSITAIRE',
    sections: [
      {
        title: 'Espace Étudiant',
        items: [
          { label: 'Tableau de bord', icon: 'bi-grid', route: '/tableau-de-bord' },
          { label: 'Catalogue des sujets', icon: 'bi-book', route: '/catalogue' },
          { label: 'Mes candidatures', icon: 'bi-check2-square', route: '/candidatures' },
        ],
      },
    ],
    user: {
      name: 'Mamadou Alpha Touré',
      role: 'Étudiant M2 GDIL - UGB',
      initials: 'MT',
      avatarBgColor: '#14532d',
    },
  },

  enseignant: {
    subtitle: 'PORTAIL UNIVERSITAIRE',
    sections: [
      {
        title: 'Espace Enseignant',
        items: [
          { label: 'Tableau de bord', icon: 'bi-grid-1x2', route: '/enseignant/dashboard' },
          { label: 'Mes Sujets proposés', icon: 'bi-journal-text', route: '/enseignant/sujets' },
          { label: 'Candidatures reçues', icon: 'bi-inbox', route: '/enseignant/candidatures', badge: 4, badgeClass: 'bg-success-subtle text-success' },
        ],
      },
    ],
    user: {
      name: 'Pr. Moussa Diop',
      role: 'Enseignant-Chercheur UFR SAT',
      initials: 'MD',
      avatarBgColor: '#14532d',
    },
  },

  responsable: {
    subtitle: 'PORTAIL ACADÉMIQUE',
    sections: [
      {
        title: 'Espace Responsable',
        items: [
          { label: 'Tableau de bord', icon: 'bi-grid', route: '/responsable/dashboard' },
          { label: 'Traitement des vœux', icon: 'bi-clipboard-check', route: '/responsable/arbitrage', badge: '5 en attente', badgeClass: 'bg-primary-subtle text-primary' },
          { label: 'Suivi des affectations', icon: 'bi-people', route: '/responsable/affectations' },
        ],
      },
    ],
    user: {
      name: 'Dr. Aminata Sow',
      role: 'Resp. Pédagogique M2 GDIL',
      initials: 'AS',
      avatarBgColor: '#14532d',
    },
  },

  admin: {
    subtitle: 'PORTAIL ACADÉMIQUE',
    sections: [
      {
        title: 'Espace Administration',
        items: [
          { label: 'Tableau de bord', icon: 'bi-grid', route: '/admin/tableau-de-bord' },
          { label: 'Gestion des étudiants', icon: 'bi-person', route: '/admin/etudiants' },
          { label: 'Gestion des enseignants', icon: 'bi-people-fill', route: '/admin/enseignants' },
          { label: 'Consultation des projets', icon: 'bi-card-checklist', route: '/admin/affectations' },
        ],
      },
    ],
    user: {
      name: 'Cheikh Tidiane Ndiaye',
      role: 'Direction Informatique UGB',
      initials: 'CN',
      avatarBgColor: '#14532d',
      showConnectedStatus: true,
    },
  },
};
