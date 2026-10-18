
import { Component } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Affectation } from '../../../models/affectation';
import { Sujet } from '../../../models/sujet';
import { StatutAffectation } from '../../../models/enums';

import { AffectationService } from '../../../services/affectation';
import { SujetService } from '../../../services/sujet';

@Component({
  selector: 'app-responsable-affectations',
  standalone: true,
  imports: [FormsModule, DatePipe, NgClass],
  templateUrl: './affectations.html',
  styleUrl: './affectations.css'
})
export class AffectationsComponent {
  readonly StatutAffectation = StatutAffectation;

  affectations: Affectation[] = [];
  sujets: Sujet[] = [];

  recherche = '';
  filtreStatut = 'TOUS';
  affectationSelectionnee: Affectation | null = null;

  constructor(
    private affectationService: AffectationService,
    private sujetService: SujetService
  ) {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.affectations = this.affectationService.lister();
    this.sujetService.lister().subscribe({
  next: (sujets) => {
    this.sujets = sujets;
  },
  error: (erreur) => {
    console.error('Erreur de chargement des sujets :', erreur);
  }
});
  }

  get totalAffectations(): number {
    return this.affectations.length;
  }

  get totalActives(): number {
    return this.affectations.filter(
      a => a.statut === StatutAffectation.ACTIVE
    ).length;
  }

  get totalAnnulees(): number {
    return this.affectations.filter(
      a => a.statut === StatutAffectation.ANNULEE
    ).length;
  }

  get affectationsFiltrees(): Affectation[] {
    const terme = this.recherche.trim().toLowerCase();

    return this.affectations
      .filter(a => {
        const titreSujet = this.obtenirTitreSujet(a.sujetId);

        const correspondRecherche =
          !terme ||
          String(a.id).includes(terme) ||
          String(a.etudiantId).includes(terme) ||
          String(a.candidatureId).includes(terme) ||
          titreSujet.toLowerCase().includes(terme);

        const correspondStatut =
          this.filtreStatut === 'TOUS' ||
          a.statut === this.filtreStatut;

        return correspondRecherche && correspondStatut;
      })
      .sort(
        (a, b) =>
          new Date(b.dateAffectation).getTime() -
          new Date(a.dateAffectation).getTime()
      );
  }

  obtenirTitreSujet(sujetId: number): string {
    return this.sujets.find(s => s.id === sujetId)?.titre
      ?? `Sujet #${sujetId}`;
  }

  libelleStatut(statut: StatutAffectation): string {
    switch (statut) {
      case StatutAffectation.ACTIVE:
        return 'Active';
      case StatutAffectation.ANNULEE:
        return 'Annulée';
      default:
        return statut;
    }
  }

  classeStatut(statut: StatutAffectation): string {
    switch (statut) {
      case StatutAffectation.ACTIVE:
        return 'status-active';
      case StatutAffectation.ANNULEE:
        return 'status-cancelled';
      default:
        return '';
    }
  }

  consulter(affectation: Affectation): void {
    this.affectationSelectionnee = affectation;
  }

  fermerDetails(): void {
    this.affectationSelectionnee = null;
  }
}
