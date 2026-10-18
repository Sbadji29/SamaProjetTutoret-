
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';

import { Sujet } from '../../../models/sujet';
import { Candidature } from '../../../models/candidature';
import { Affectation } from '../../../models/affectation';
import { StatutCandidature, StatutAffectation } from '../../../models/enums';

import { SujetService } from '../../../services/sujet';
import { CandidatureService } from '../../../services/candidature';
import { AffectationService } from '../../../services/affectation';

interface StatistiqueStatut {
  libelle: string;
  total: number;
  pourcentage: number;
  classe: string;
}

@Component({
  selector: 'app-responsable-rapports',
  standalone: true,
  imports: [DatePipe, NgClass],
  templateUrl: './rapports.html',
  styleUrl: './rapports.css'
})
export class RapportsComponent implements OnInit {
  sujets: Sujet[] = [];
  candidatures: Candidature[] = [];
  affectations: Affectation[] = [];

  dateGeneration = new Date();

  constructor(
    private sujetService: SujetService,
    private candidatureService: CandidatureService,
    private affectationService: AffectationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    // Charger les sujets
    this.sujetService.lister().subscribe({
      next: (sujets) => {
        this.sujets = sujets;
        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error('Erreur de chargement des sujets :', erreur);
      }
    });

    // Charger les candidatures
    this.candidatureService.lister().subscribe({
      next: (candidatures) => {
        this.candidatures = candidatures;
        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error('Erreur de chargement des candidatures :', erreur);
        this.candidatures = [];
        this.cdr.detectChanges();
      }
    });

    // Le chargement des affectations sera adapté selon le service existant.
    this.affectations = this.affectationService.lister();
  }

  get totalCandidatures(): number {
    return this.candidatures.length;
  }

  get totalSujets(): number {
    return this.sujets.length;
  }

  get totalPlacesProposees(): number {
    return this.sujets.reduce(
      (total, sujet) => total + sujet.capaciteMax,
      0
    );
  }

  get affectationsActives(): number {
    return this.affectations.filter(
      a => a.statut === StatutAffectation.ACTIVE
    ).length;
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

  get candidaturesRejetees(): number {
    return this.candidatures.filter(
      c => c.statut === StatutCandidature.REJETEE
    ).length;
  }

  get tauxAcceptation(): number {
    return this.totalCandidatures > 0
      ? Math.round(
          (this.candidaturesAcceptees / this.totalCandidatures) * 100
        )
      : 0;
  }

  get tauxTraitement(): number {
    return this.totalCandidatures > 0
      ? Math.round(
          ((this.candidaturesAcceptees + this.candidaturesRejetees) /
            this.totalCandidatures) * 100
        )
      : 0;
  }

  get statistiquesStatut(): StatistiqueStatut[] {
    const total = this.totalCandidatures;

    return [
      {
        libelle: 'En attente',
        total: this.candidaturesEnAttente,
        pourcentage: total > 0
          ? Math.round((this.candidaturesEnAttente / total) * 100)
          : 0,
        classe: 'pending'
      },
      {
        libelle: 'Acceptées',
        total: this.candidaturesAcceptees,
        pourcentage: total > 0
          ? Math.round((this.candidaturesAcceptees / total) * 100)
          : 0,
        classe: 'accepted'
      },
      {
        libelle: 'Rejetées',
        total: this.candidaturesRejetees,
        pourcentage: total > 0
          ? Math.round((this.candidaturesRejetees / total) * 100)
          : 0,
        classe: 'rejected'
      }
    ];
  }

  get capacitesParSujet(): Sujet[] {
    return [...this.sujets].sort(
      (a, b) => b.capaciteMax - a.capaciteMax
    );
  }

  get sujetsDisponibles(): number {
    return this.sujets.filter(s => s.disponible).length;
  }

  get sujetsIndisponibles(): number {
    return this.sujets.filter(s => !s.disponible).length;
  }

  get donneesDisponibles(): boolean {
    return this.sujets.length > 0 ||
      this.candidatures.length > 0 ||
      this.affectations.length > 0;
  }

  actualiserRapport(): void {
    this.chargerDonnees();
    this.dateGeneration = new Date();
  }
}
