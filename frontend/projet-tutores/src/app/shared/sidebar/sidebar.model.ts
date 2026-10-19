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
      name: 'Camille Laurent',
      role: 'Étudiant M2 Informatique',
      avatarUrl: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=100&h=100&fit=crop&crop=faces',
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
      name: 'Pr. Marc Bernard',
      role: 'Enseignant-Chercheur LIRIS',
      initials: 'MB',
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
      name: 'Dr. Alexandre Fontaine',
      role: 'Resp. M2 Info',
      initials: 'AF',
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
      name: 'Marc Le Gall',
      role: 'Direction Informatique',
      initials: 'ML',
      avatarBgColor: '#14532d',
      showConnectedStatus: true,
    },
  },
};
