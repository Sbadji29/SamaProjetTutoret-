
import { StatutAffectation } from './enums';

export interface Affectation {
  id: number;
  dateAffectation: string;
  statut: StatutAffectation;
  etudiantId: number;
  sujetId: number;
  candidatureId: number;
}
