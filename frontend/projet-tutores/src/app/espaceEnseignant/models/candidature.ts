
import { StatutCandidature } from './enums';

export interface SujetCandidature {
  id: number;
  titre: string;
}

export interface Candidature {
  id: number;
  dateCandidature: string;
  priorite: number;
  motivation: string;
  avisEncadrant: string | null;
  commentaireDecision: string | null;
  statut: StatutCandidature;

  // Identifiants éventuellement utilisés dans le frontend
  etudiantId?: number;
  sujetId?: number;

  // Objets imbriqués renvoyés par le backend
  sujet?: SujetCandidature;

  sessionUniversitaireId?: number;
  responsablePedagogiqueId?: number | null;
}
