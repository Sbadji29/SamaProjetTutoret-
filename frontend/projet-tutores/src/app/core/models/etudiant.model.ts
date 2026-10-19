import { Utilisateur } from './utilisateur.model';

export interface Etudiant {
  id?: number;
  numeroEtudiant: string;
  filiere: string;
  niveau: string;
  utilisateur: Utilisateur;
}
