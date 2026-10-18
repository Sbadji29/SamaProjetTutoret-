import { Routes } from '@angular/router';
import { Candidature } from './Etudiant/candidature/candidature';
import { Catalogue } from './Etudiant/catalogue/catalogue';
import { Dashboard } from './Etudiant/dashboard/dashboard';
import { Affectations } from './Administration/affectations/affectations';
import { DashboardAdmin } from './Administration/dashboard-admin/dashboard-admin';
import { Enseignants } from './Administration/enseignants/enseignants';
import { Etudiants } from './Administration/etudiants/etudiants';
import { Connexion } from './connexion/connexion';
import { Inscription } from './inscription/inscription';

export const routes: Routes = [
  { path: '', redirectTo: 'tableau-de-bord', pathMatch: 'full' },
  { path: 'tableau-de-bord', component: Dashboard },
  { path: 'dashboard', component: Dashboard },
  { path: 'catalogue', component: Catalogue },
  { path: 'candidatures', component: Candidature },
  { path: 'candidature', component: Candidature },

  // Administration
  { path: 'admin/tableau-de-bord', component: DashboardAdmin },
  { path: 'admin/dashboard', component: DashboardAdmin },
  { path: 'admin/etudiants', component: Etudiants },
  { path: 'admin/enseignants', component: Enseignants },
  { path: 'admin/affectations', component: Affectations },
  { path: 'admin', redirectTo: 'admin/tableau-de-bord', pathMatch: 'full' },
  { path: 'gestion-etudiants', component: Etudiants },
  { path: 'gestion-enseignants', component: Enseignants },
  { path: 'suivi-affectations', component: Affectations },

  // Auth
  { path: 'connexion', component: Connexion },
  { path: 'inscription', component: Inscription },
  { path: '**', redirectTo: 'tableau-de-bord' },
];
