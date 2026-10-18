export interface Sujet {
  id: number;
  reference: string;
  titre: string;
  description: string;
  objectifs: string;
  niveau: string;
  capaciteMax: number;
  disponible: boolean;
  enseignantId: number;
  sessionUniversitaireId: number;
}