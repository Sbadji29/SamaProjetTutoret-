export type StatutAffectation = 'VALIDE' | 'ARBITRAGE' | 'VACANT';

export interface AffectationItem {
  id: number;
  etudiantNom: string;
  etudiantInitiales?: string;
  avatarClass?: string;
  estNonAffecte?: boolean;
  sujetTitre: string;
  enseignantNom: string;
  laboratoire: string;
  statut: StatutAffectation;
  statutLabel: string;
  capaciteTotal: number;
  capacitePrise: number;
  placesRestantes: number;
}
