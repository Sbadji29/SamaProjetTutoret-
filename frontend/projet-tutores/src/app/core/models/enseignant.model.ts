import { Utilisateur } from './utilisateur.model';

export interface Enseignant {
  id?: number;
  matricule: string;
  specialite: string;
  laboratoire?: string;
  departement: string;
  quotaEncadrement?: number;
  utilisateur: Utilisateur;
}
