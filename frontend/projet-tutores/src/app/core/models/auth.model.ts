export interface ConnexionRequete {
  email: string;
  motDePasse: string;
}

export type RoleUtilisateur = 'ETUDIANT' | 'ENSEIGNANT' | 'RESPONSABLE' | 'ADMIN' | 'UTILISATEUR';

export interface ConnexionReponse {
  id: number;
  nom: string;
  prenom: string;
  email: string;
  role: RoleUtilisateur;
  profilId?: number;
}
