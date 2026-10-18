
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { DatePipe } from '@angular/common';

import { Candidature } from '../../../models/candidature';
import { StatutCandidature } from '../../../models/enums';
import { CandidatureService } from '../../../services/candidature';

@Component({
  selector: 'app-candidatures',
  standalone: true,
  imports: [DatePipe],
  templateUrl: './candidatures.html',
  styleUrl: './candidatures.css'
})
export class Candidatures implements OnInit {

  candidatures: Candidature[] = [];
  candidatureSelectionnee: Candidature | null = null;

  chargement = false;
  messageErreur = '';

  constructor(
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerCandidatures();
  }

  chargerCandidatures(): void {
    this.chargement = true;
    this.messageErreur = '';
    this.cdr.detectChanges();

    this.candidatureService.lister().subscribe({
      next: (candidatures) => {
        
        this.candidatures = candidatures;
        this.chargement = false;

        console.log(
          '[Candidatures] Nombre reçu :',
          this.candidatures.length
        );

        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error(
          '[Candidatures] Erreur de chargement :',
          erreur
        );

        this.messageErreur =
          'Impossible de charger les candidatures depuis le serveur.';
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  compterParStatut(statut: string): number {
    return this.candidatures.filter(
      candidature => candidature.statut === statut
    ).length;
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

  consulter(candidature: Candidature): void {
    this.candidatureSelectionnee = candidature;
    this.cdr.detectChanges();
  }

  fermerDetails(): void {
    this.candidatureSelectionnee = null;
    this.cdr.detectChanges();
  }
}
