
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Candidature } from '../../../models/candidature';
import { Sujet } from '../../../models/sujet';
import { StatutCandidature } from '../../../models/enums';

import { CandidatureService } from '../../../services/candidature';
import { SujetService } from '../../../services/sujet';

@Component({
  selector: 'app-responsable-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe, NgClass],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class DashboardResponsableComponent implements OnInit {
  candidatures: Candidature[] = [];
  sujets: Sujet[] = [];

  constructor(
    private candidatureService: CandidatureService,
    private sujetService: SujetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    // Charger les candidatures depuis le backend
    this.candidatureService.lister().subscribe({
      next: (candidatures) => {
        this.candidatures = candidatures;
        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error(
          'Erreur de chargement des candidatures :',
          erreur
        );
        this.candidatures = [];
        this.cdr.detectChanges();
      }
    });

    // Charger les sujets depuis le backend
    this.sujetService.lister().subscribe({
      next: (sujets) => {
        this.sujets = sujets;
        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error(
          'Erreur de chargement des sujets :',
          erreur
        );
        this.sujets = [];
        this.cdr.detectChanges();
      }
    });
  }

  get totalCandidatures(): number {
    return this.candidatures.length;
  }

  get candidaturesEnAttente(): number {
    return this.candidatures.filter(
      c => c.statut === StatutCandidature.EN_ATTENTE
    ).length;
  }

  get candidaturesAcceptees(): number {
    return this.candidatures.filter(
      c => c.statut === StatutCandidature.ACCEPTEE
    ).length;
  }

  get totalSujetsDisponibles(): number {
    return this.sujets.filter(s => s.disponible).length;
  }

  get candidaturesRecentes(): Candidature[] {
    return [...this.candidatures]
      .sort(
        (a, b) =>
          new Date(b.dateCandidature).getTime() -
          new Date(a.dateCandidature).getTime()
      )
      .slice(0, 5);
  }

  libelleStatut(statut: StatutCandidature): string {
    switch (statut) {
      case StatutCandidature.EN_ATTENTE:
        return 'En attente';
      case StatutCandidature.ACCEPTEE:
        return 'Acceptée';
      case StatutCandidature.REJETEE:
        return 'Rejetée';
      default:
        return statut;
    }
  }

  classeStatut(statut: StatutCandidature): string {
    switch (statut) {
      case StatutCandidature.EN_ATTENTE:
        return 'status-pending';
      case StatutCandidature.ACCEPTEE:
        return 'status-accepted';
      case StatutCandidature.REJETEE:
        return 'status-rejected';
      default:
        return '';
    }
  }
}
