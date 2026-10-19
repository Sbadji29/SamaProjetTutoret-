export interface SujetItem {
  id: number;
  reference?: string;
  titre: string;
  description: string;
  objectifs?: string;
  encadrant: string;
  laboratoire: string;
  date: string;
  statut: string;
  placesOccupees: number;
  placesTotales: number;
  sessionId?: number;
}
