export type StatutEtudiant = 'AFFECTE' | 'ATTENTE' | 'AUCUN_VOEU';

export interface EtudiantItem {
  id: number;
  initiales: string;
  avatarClass: string;
  nom: string;
  numeroEtudiant: string;
  email: string;
  parcours: string;
  statut: StatutEtudiant;
  statutLabel: string;
  compteEntActif: boolean;
}
