import { Routes } from '@angular/router';
import { inject } from '@angular/core';
import { Candidature } from './Etudiant/candidature/candidature';
import { Catalogue } from './Etudiant/catalogue/catalogue';
import { Dashboard } from './Etudiant/dashboard/dashboard';
import { Affectations } from './Administration/affectations/affectations';
import { DashboardAdmin } from './Administration/dashboard-admin/dashboard-admin';
import { Enseignants } from './Administration/enseignants/enseignants';
import { Etudiants } from './Administration/etudiants/etudiants';
import { Connexion } from './authentification/connexion/connexion';
import { Inscription } from './authentification/inscription/inscription';
import { EnseignantDashboard } from './Enseignant/dashboard/enseignant-dashboard';
import { EnseignantSujets } from './Enseignant/sujets/enseignant-sujets';
import { EnseignantCandidatures } from './Enseignant/candidatures/enseignant-candidatures';
import { ResponsableDashboard } from './Responsable/dashboard/responsable-dashboard';
import { ResponsableArbitrage } from './Responsable/arbitrage/responsable-arbitrage';
import { ResponsableAffectations } from './Responsable/affectations/responsable-affectations';
import { AuthService } from './core/services/auth.service';
import { authGuard, guestGuard, roleGuard } from './core/guards/auth.guard';

const redirectBasedOnRole = () => {
  const authService = inject(AuthService);
  if (!authService.isAuthenticated()) {
    return '/connexion';
  }
  const user = authService.currentUser();
  switch (user?.role) {
    case 'ADMIN':
      return '/admin/tableau-de-bord';
    case 'ENSEIGNANT':
      return '/enseignant/dashboard';
    case 'RESPONSABLE':
      return '/responsable/dashboard';
    case 'ETUDIANT':
    default:
      return '/tableau-de-bord';
  }
};

export const routes: Routes = [
  {
    path: '',
    pathMatch: 'full',
    redirectTo: redirectBasedOnRole
  },

  { path: 'tableau-de-bord', component: Dashboard, canActivate: [roleGuard(['ETUDIANT'])] },
  { path: 'dashboard', component: Dashboard, canActivate: [roleGuard(['ETUDIANT'])] },
  { path: 'catalogue', component: Catalogue, canActivate: [roleGuard(['ETUDIANT'])] },
  { path: 'candidatures', component: Candidature, canActivate: [roleGuard(['ETUDIANT'])] },
  { path: 'candidature', component: Candidature, canActivate: [roleGuard(['ETUDIANT'])] },

  { path: 'enseignant', redirectTo: 'enseignant/dashboard', pathMatch: 'full' },
  { path: 'enseignant/dashboard', component: EnseignantDashboard, canActivate: [roleGuard(['ENSEIGNANT'])] },
  { path: 'enseignant/sujets', component: EnseignantSujets, canActivate: [roleGuard(['ENSEIGNANT'])] },
  { path: 'enseignant/candidatures', component: EnseignantCandidatures, canActivate: [roleGuard(['ENSEIGNANT'])] },

  { path: 'responsable', redirectTo: 'responsable/dashboard', pathMatch: 'full' },
  { path: 'responsable/dashboard', component: ResponsableDashboard, canActivate: [roleGuard(['RESPONSABLE'])] },
  { path: 'responsable/arbitrage', component: ResponsableArbitrage, canActivate: [roleGuard(['RESPONSABLE'])] },
  { path: 'responsable/affectations', component: ResponsableAffectations, canActivate: [roleGuard(['RESPONSABLE'])] },

  { path: 'admin', redirectTo: 'admin/tableau-de-bord', pathMatch: 'full' },
  { path: 'admin/tableau-de-bord', component: DashboardAdmin, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'admin/dashboard', component: DashboardAdmin, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'admin/etudiants', component: Etudiants, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'admin/enseignants', component: Enseignants, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'admin/affectations', component: Affectations, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'gestion-etudiants', component: Etudiants, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'gestion-enseignants', component: Enseignants, canActivate: [roleGuard(['ADMIN'])] },
  { path: 'suivi-affectations', component: Affectations, canActivate: [roleGuard(['ADMIN'])] },

  { path: 'connexion', component: Connexion, canActivate: [guestGuard] },
  { path: 'inscription', component: Inscription, canActivate: [guestGuard] },

  {
    path: '**',
    redirectTo: redirectBasedOnRole
  }
];
