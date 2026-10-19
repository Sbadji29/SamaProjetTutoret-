import { Enseignant } from './enseignant.model';
import { SessionUniversitaire } from './session.model';

export interface Sujet {
  id?: number;
  reference: string;
  titre: string;
  description?: string;
  objectifs?: string;
  niveau?: string;
  capaciteMax: number;
  disponible?: boolean;
  enseignant?: Enseignant;
  sessionUniversitaire?: SessionUniversitaire;
}
