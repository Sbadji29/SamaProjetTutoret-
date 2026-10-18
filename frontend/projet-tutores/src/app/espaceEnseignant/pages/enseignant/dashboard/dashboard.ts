
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe } from '@angular/common';
import { RouterLink } from '@angular/router';

import { Sujet } from '../../../models/sujet';
import { Candidature } from '../../../models/candidature';
import { StatutCandidature } from '../../../models/enums';

import { SujetService } from '../../../services/sujet';
import { CandidatureService } from '../../../services/candidature';

interface CandidatureRecente {
  candidature: Candidature;
  titreSujet: string;
}

@Component({
  selector: 'app-dashboard',
  standalone: true,
  imports: [RouterLink, DatePipe],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css'
})
export class Dashboard implements OnInit {

  sujets: Sujet[] = [];
  candidatures: Candidature[] = [];

  chargementSujets = false;
  erreurSujets = '';

  constructor(
    private sujetService: SujetService,
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargementSujets = true;
    this.erreurSujets = '';

    this.cdr.detectChanges();

    this.sujetService.lister().subscribe({
      next: (sujets) => {
        this.sujets = sujets;

        this.chargerCandidatures();

        this.chargementSujets = false;

        console.log('[Dashboard] Sujets reçus :', this.sujets.length);
        console.log('[Dashboard] Disponibles :', this.sujetsDisponibles);
        console.log('[Dashboard] Capacité totale :', this.capaciteTotale);
        console.log('[Dashboard] Chargement terminé :', this.chargementSujets);

        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error('[Dashboard] Erreur de chargement :', erreur);

        this.erreurSujets =
          'Impossible de charger les sujets depuis le serveur.';
        this.chargementSujets = false;

        this.cdr.detectChanges();
      }
    });
  }


private chargerCandidatures(): void {
  this.candidatureService.lister().subscribe({
    next: (candidatures) => {
      this.candidatures = candidatures.filter(
        candidature =>
          this.sujets.some(sujet => sujet.id === candidature.sujetId)
      );

      console.log(
        '[Dashboard] Candidatures reçues :',
        this.candidatures.length
      );

      this.cdr.detectChanges();
    },
    error: (erreur) => {
      console.error(
        '[Dashboard] Erreur de chargement des candidatures :',
        erreur
      );

      this.candidatures = [];
      this.cdr.detectChanges();
    }
  });
}


  get totalSujets(): number {
    return this.sujets.length;
  }

  get sujetsDisponibles(): number {
    return this.sujets.filter(sujet => sujet.disponible).length;
  }

  get capaciteTotale(): number {
    return this.sujets.reduce(
      (total, sujet) => total + sujet.capaciteMax,
      0
    );
  }

  get totalCandidatures(): number {
    return this.candidatures.length;
  }

  get candidaturesEnAttente(): number {
    return this.candidatures.filter(
      candidature =>
        candidature.statut === StatutCandidature.EN_ATTENTE
    ).length;
  }

  get candidaturesRecentes(): CandidatureRecente[] {
    return [...this.candidatures]
      .sort(
        (a, b) =>
          new Date(b.dateCandidature).getTime() -
          new Date(a.dateCandidature).getTime()
      )
      .slice(0, 5)
      .map(candidature => ({
        candidature,
        titreSujet:
          this.sujets.find(sujet => sujet.id === candidature.sujetId)?.titre
          ?? 'Sujet introuvable'
      }));
  }

  libelleStatut(statut: StatutCandidature): string {
    switch (statut) {
      case StatutCandidature.EN_ATTENTE:
        return 'En attente';
      case StatutCandidature.ACCEPTEE:
        return 'Acceptée';
      case StatutCandidature.REJETEE:
        return 'Rejetée';
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
    }
  }
}
