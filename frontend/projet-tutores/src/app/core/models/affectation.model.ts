import { Candidature } from './candidature.model';
import { Etudiant } from './etudiant.model';
import { Sujet } from './sujet.model';

export type StatutAffectation = 'ACTIVE' | 'ANNULEE' | 'CLOTUREE';

export interface Affectation {
  id?: number;
  dateAffectation?: string;
  statut?: StatutAffectation;
  candidature?: Candidature;
  etudiant?: Etudiant;
  sujet?: Sujet;
}
