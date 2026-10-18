export type StatutCandidature = 'EN_ATTENTE' | 'ACCEPTEE' | 'REJETEE';

export interface CandidatureItem {
  id: number;
  titre: string;
  verifie?: boolean;
  technologies: string[];
  initiales: string;
  initialesClass: string;
  enseignant: string;
  grade: string;
  date: string;
  heure: string;
  statut: StatutCandidature;
}
