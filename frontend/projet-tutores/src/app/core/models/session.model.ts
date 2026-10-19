export interface SessionUniversitaire {
  id?: number;
  libelle: string;
  dateDebut: string;
  dateFin: string;
  dateClotureVoeux?: string;
  dateLimiteEvaluation?: string;
  active: boolean;
}
