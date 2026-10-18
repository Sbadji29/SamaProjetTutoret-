
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Sujet } from '../../../models/sujet';
import { SujetService } from '../../../services/sujet';

interface CapaciteEnseignant {
  enseignantId: number;
  nom: string;
  specialite: string;
  capaciteTotale: number;
  sujets: Sujet[];
  placesDisponibles: number;
  placesOccupees: number;
  tauxOccupation: number;
}

@Component({
  selector: 'app-responsable-capacites',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './capacites.html',
  styleUrl: './capacites.css'
})
export class CapacitesComponent {
  sujets: Sujet[] = [];
  recherche = '';

  constructor(private sujetService: SujetService) {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.sujetService.lister().subscribe({
  next: (sujets) => {
    this.sujets = sujets;
  },
  error: (erreur) => {
    console.error('Erreur de chargement des sujets :', erreur);
  }
});
  }

  get enseignants(): CapaciteEnseignant[] {
    const groupes = new Map<number, Sujet[]>();

    for (const sujet of this.sujets) {
      const groupe = groupes.get(sujet.enseignantId) ?? [];
      groupe.push(sujet);
      groupes.set(sujet.enseignantId, groupe);
    }

    return Array.from(groupes.entries()).map(([enseignantId, sujets]) => {
      const capaciteTotale = sujets.reduce(
        (total, sujet) => total + sujet.capaciteMax,
        0
      );

      // Estimation provisoire : aucune affectation réelle n'est encore
      // reliée à cette page.
      const placesOccupees = 0;
      const placesDisponibles = capaciteTotale - placesOccupees;

      return {
        enseignantId,
        nom: `Enseignant #${enseignantId}`,
        specialite: 'Non renseignée',
        capaciteTotale,
        sujets,
        placesDisponibles,
        placesOccupees,
        tauxOccupation: capaciteTotale > 0
          ? Math.round((placesOccupees / capaciteTotale) * 100)
          : 0
      };
    });
  }

  get enseignantsFiltres(): CapaciteEnseignant[] {
    const terme = this.recherche.trim().toLowerCase();

    if (!terme) {
      return this.enseignants;
    }

    return this.enseignants.filter(enseignant =>
      enseignant.nom.toLowerCase().includes(terme) ||
      enseignant.specialite.toLowerCase().includes(terme) ||
      enseignant.sujets.some(sujet =>
        sujet.titre.toLowerCase().includes(terme)
      )
    );
  }

  get capaciteTotale(): number {
    return this.enseignants.reduce(
      (total, enseignant) => total + enseignant.capaciteTotale,
      0
    );
  }

  get totalPlacesOccupees(): number {
    return this.enseignants.reduce(
      (total, enseignant) => total + enseignant.placesOccupees,
      0
    );
  }

  get totalPlacesDisponibles(): number {
    return this.enseignants.reduce(
      (total, enseignant) => total + enseignant.placesDisponibles,
      0
    );
  }

  get tauxOccupationGlobal(): number {
    return this.capaciteTotale > 0
      ? Math.round(
          (this.totalPlacesOccupees / this.capaciteTotale) * 100
        )
      : 0;
  }
}
