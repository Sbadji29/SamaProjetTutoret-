
import { Component, OnInit, ChangeDetectorRef } from '@angular/core';
import { DatePipe, NgClass } from '@angular/common';
import { FormsModule } from '@angular/forms';

import { Candidature } from '../../../models/candidature';
import { Sujet } from '../../../models/sujet';
import { StatutCandidature } from '../../../models/enums';

import { CandidatureService } from '../../../services/candidature';
import { SujetService } from '../../../services/sujet';

@Component({
  selector: 'app-traitement-candidatures',
  standalone: true,
  imports: [FormsModule, DatePipe, NgClass],
  templateUrl: './traitement-candidatures.html',
  styleUrl: './traitement-candidatures.css'
})
export class TraitementCandidaturesComponent implements OnInit {
  readonly StatutCandidature = StatutCandidature;

  candidatures: Candidature[] = [];
  sujets: Sujet[] = [];

  recherche = '';
  filtreStatut = 'TOUS';

  candidatureSelectionnee: Candidature | null = null;
  commentaireDecision = '';
  message = '';
  typeMessage: 'success' | 'error' = 'success';

  constructor(
    private candidatureService: CandidatureService,
    private sujetService: SujetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    
    this.candidatureService.lister().subscribe({
   next: (candidatures) => {
  console.log('Candidatures reçues :', candidatures);
  console.log('Première candidature :', candidatures[0]);
  console.log(
    'Sujet de la première candidature :',
    candidatures[0]?.sujet
  );

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

  get candidaturesFiltrees(): Candidature[] {
    const terme = this.recherche.trim().toLowerCase();

    return this.candidatures
      .filter(candidature => {
        const sujet = this.titreCandidature(candidature);

        const motivation = candidature.motivation ?? '';

        const correspondRecherche =
          !terme ||
          String(candidature.id).includes(terme) ||
          motivation.toLowerCase().includes(terme) ||
          sujet.toLowerCase().includes(terme);

        const correspondStatut =
          this.filtreStatut === 'TOUS' ||
          candidature.statut === this.filtreStatut;

        return correspondRecherche && correspondStatut;
      })
      .sort(
        (a, b) =>
          new Date(b.dateCandidature).getTime() -
          new Date(a.dateCandidature).getTime()
      );
  }

  get totalCandidatures(): number {
    return this.candidatures.length;
  }

  get totalEnAttente(): number {
    return this.candidatures.filter(
      c => c.statut === StatutCandidature.EN_ATTENTE
    ).length;
  }

  get totalAcceptees(): number {
    return this.candidatures.filter(
      c => c.statut === StatutCandidature.ACCEPTEE
    ).length;
  }

  get totalRejetees(): number {
    return this.candidatures.filter(
      c => c.statut === StatutCandidature.REJETEE
    ).length;
  }

obtenirTitreSujet(
  sujetId: number | undefined | null
): string {
  if (sujetId == null) {
    return 'Sujet non renseigné';
  }

  const sujet = this.sujets.find(
    s => Number(s.id) === Number(sujetId)
  );

  return sujet?.titre ?? `Sujet #${sujetId}`;
}

titreCandidature(candidature: Candidature): string {
  // Priorité au sujet directement renvoyé par l'API
  if (candidature.sujet?.titre) {
    return candidature.sujet.titre;
  }

  // Sinon, recherche du sujet dans la liste chargée
  const sujetId = candidature.sujetId;

  if (sujetId != null) {
    return this.obtenirTitreSujet(sujetId);
  }

  return 'Sujet non renseigné';
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

  consulter(candidature: Candidature): void {
    this.candidatureSelectionnee = candidature;
    this.commentaireDecision = candidature.commentaireDecision ?? '';
    this.message = '';
  }

  fermerDetails(): void {
    this.candidatureSelectionnee = null;
    this.commentaireDecision = '';
    this.message = '';
  }

prendreDecision(statut: StatutCandidature): void {
  if (!this.candidatureSelectionnee) {
    return;
  }

  if (
    this.candidatureSelectionnee.statut !==
    StatutCandidature.EN_ATTENTE
  ) {
    this.afficherMessage(
      'Cette candidature a déjà été traitée.',
      'error'
    );
    return;
  }

  const candidature = this.candidatureSelectionnee;
  const commentaire = this.commentaireDecision.trim();

  this.candidatureService
    .changerStatut(candidature.id, statut)
    .subscribe({
      next: (candidatureEnregistree) => {
        const candidatureMiseAJour: Candidature = {
          ...candidature,
          ...candidatureEnregistree,
          statut,
          commentaireDecision: commentaire,
          responsablePedagogiqueId: 1
        };

        this.candidatures = this.candidatures.map(c =>
          c.id === candidature.id ? candidatureMiseAJour : c
        );

        this.candidatureSelectionnee = candidatureMiseAJour;

        this.afficherMessage(
          statut === StatutCandidature.ACCEPTEE
            ? 'Candidature acceptée avec succès.'
            : 'Candidature rejetée.',
          'success'
        );

        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error(
          'Erreur lors du changement de statut :',
          erreur
        );

        this.afficherMessage(
          'La décision n’a pas été enregistrée. Vérifie la réponse du serveur.',
          'error'
        );

        this.cdr.detectChanges();
      }
    });
}


  private afficherMessage(
    texte: string,
    type: 'success' | 'error'
  ): void {
    this.message = texte;
    this.typeMessage = type;
  }
}
