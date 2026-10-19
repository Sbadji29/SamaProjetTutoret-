import { Routes } from '@angular/router';
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

export const routes: Routes = [
  { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },
  { path: 'tableau-de-bord', component: Dashboard },
  { path: 'dashboard', component: Dashboard },
  { path: 'catalogue', component: Catalogue },
  { path: 'candidatures', component: Candidature },
  { path: 'candidature', component: Candidature },

  { path: 'enseignant', redirectTo: 'enseignant/dashboard', pathMatch: 'full' },
  { path: 'enseignant/dashboard', component: EnseignantDashboard },
  { path: 'enseignant/sujets', component: EnseignantSujets },
  { path: 'enseignant/candidatures', component: EnseignantCandidatures },

  { path: 'responsable', redirectTo: 'responsable/dashboard', pathMatch: 'full' },
  { path: 'responsable/dashboard', component: ResponsableDashboard },
  { path: 'responsable/arbitrage', component: ResponsableArbitrage },
  { path: 'responsable/affectations', component: ResponsableAffectations },

  { path: 'admin', redirectTo: 'admin/tableau-de-bord', pathMatch: 'full' },
  { path: 'admin/tableau-de-bord', component: DashboardAdmin },
  { path: 'admin/dashboard', component: DashboardAdmin },
  { path: 'admin/etudiants', component: Etudiants },
  { path: 'admin/enseignants', component: Enseignants },
  { path: 'admin/affectations', component: Affectations },
  { path: 'gestion-etudiants', component: Etudiants },
  { path: 'gestion-enseignants', component: Enseignants },
  { path: 'suivi-affectations', component: Affectations },

  { path: 'connexion', component: Connexion },
  { path: 'inscription', component: Inscription },
  { path: '**', redirectTo: 'tableau-de-bord' }
];
