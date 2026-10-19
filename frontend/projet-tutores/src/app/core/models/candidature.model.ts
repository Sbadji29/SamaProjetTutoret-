import { Etudiant } from './etudiant.model';
import { Sujet } from './sujet.model';
import { SessionUniversitaire } from './session.model';

export type StatutCandidature = 'EN_ATTENTE' | 'ACCEPTEE' | 'REJETEE';

export interface Candidature {
  id?: number;
  priorite: number;
  motivation?: string;
  dateCandidature?: string;
  statut?: StatutCandidature;
  avisEncadrant?: string;
  commentaireEncadrant?: string;
  etudiant?: Etudiant;
  sujet?: Sujet;
  sessionUniversitaire?: SessionUniversitaire;
}
