export interface ConnexionRequete {
  email: string;
  motDePasse: string;
}

export interface InscriptionRequete {
  nom: string;
  prenom: string;
  email: string;
  motDePasse: string;
  role: 'ETUDIANT' | 'ENSEIGNANT' | 'RESPONSABLE';
  filiere?: string;
  departement?: string;
  specialite?: string;
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
