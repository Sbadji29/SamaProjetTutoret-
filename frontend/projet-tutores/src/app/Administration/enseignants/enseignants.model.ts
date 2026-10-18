export interface EnseignantItem {
  id: number;
  initiales: string;
  avatarClass: string;
  nom: string;
  titre: string;
  email: string;
  departement: string;
  laboratoire: string;
  nbSujets: number;
  nbPlaces: number;
  etudiantsAssignes: number;
  quotaMax: number;
}
