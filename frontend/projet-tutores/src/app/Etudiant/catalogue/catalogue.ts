import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';
import { Sujet } from '../sujet/sujet';
import { SujetItem } from '../sujet/sujet.model';
import { SujetService } from '../../core/services/sujet.service';
import { CandidatureService } from '../../core/services/candidature.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [CommonModule, FormsModule, Sidebar, Sujet, Header],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue implements OnInit {
  searchQuery: string = '';
  chargement = false;
  messageSucces = '';
  messageErreur = '';

  selectedSujet: SujetItem | null = null;
  formPriorite = 1;
  formMotivation = '';
  envoiEnCours = false;

  sujets: SujetItem[] = [
    {
      id: 1,
      reference: 'SUJ-2024-042',
      titre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      description: "Conception et déploiement d'une architecture multi-tenant conforme RGPD/HDS pour flux vidéo et dossier patient sécurisé.",
      encadrant: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      date: '10 Oct 2024',
      statut: 'Disponible',
      placesOccupees: 1,
      placesTotales: 3,
      sessionId: 1
    },
    {
      id: 2,
      reference: 'SUJ-2024-048',
      titre: "Détection d'anomalies réseau via Transformer & eBPF",
      description: 'Extraction de métriques réseau en temps réel via des programmes eBPF dans le noyau Linux et détection par transformers.',
      encadrant: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      date: '08 Oct 2024',
      statut: 'Disponible',
      placesOccupees: 0,
      placesTotales: 2,
      sessionId: 1
    },
    {
      id: 3,
      reference: 'SUJ-2024-039',
      titre: 'Optimisation de requêtes SQL vectorielles sous DuckDB',
      description: 'Benchmark et amélioration des algorithmes d\'indexation HNSW intégrés aux moteurs de bases de données embarquées.',
      encadrant: 'Dr. Claire Vasseur',
      laboratoire: 'Laboratoire CITI',
      date: '03 Oct 2024',
      statut: 'Disponible',
      placesOccupees: 1,
      placesTotales: 3,
      sessionId: 1
    }
  ];

  constructor(
    private sujetService: SujetService,
    private candidatureService: CandidatureService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerSujets();
  }

  chargerSujets(): void {
    this.chargement = true;
    this.sujetService.getDisponibles().subscribe({
      next: (apiSujets) => {
        this.chargement = false;
        if (apiSujets && apiSujets.length > 0) {
          this.sujets = apiSujets.map((s) => ({
            id: s.id || 0,
            reference: s.reference,
            titre: s.titre,
            description: s.description || '',
            encadrant: s.enseignant ? `${s.enseignant.utilisateur?.prenom || ''} ${s.enseignant.utilisateur?.nom || ''}`.trim() : 'Enseignant',
            laboratoire: s.enseignant?.laboratoire || s.enseignant?.departement || 'Université',
            date: 'Session 2024-2025',
            statut: s.disponible ? 'Disponible' : 'Complet',
            placesOccupees: 0,
            placesTotales: s.capaciteMax || 3,
            sessionId: s.sessionUniversitaire?.id || 1
          }));
        }
      },
      error: () => {
        this.chargement = false;
      }
    });
  }

  ouvrirModalCandidature(sujet: SujetItem): void {
    this.selectedSujet = sujet;
    this.formPriorite = 1;
    this.formMotivation = '';
    this.messageErreur = '';
    this.messageSucces = '';
  }

  fermerModal(): void {
    this.selectedSujet = null;
    this.messageErreur = '';
  }

  soumettreCandidature(): void {
    if (!this.selectedSujet) {
      return;
    }

    const user = this.authService.currentUser();
    const etudiantId = user?.profilId || 1;
    const sessionId = this.selectedSujet.sessionId || 1;

    this.envoiEnCours = true;
    this.messageErreur = '';

    this.candidatureService.creer(
      {
        priorite: Number(this.formPriorite),
        motivation: this.formMotivation
      },
      etudiantId,
      this.selectedSujet.id,
      sessionId
    ).subscribe({
      next: () => {
        this.envoiEnCours = false;
        this.messageSucces = `Votre candidature pour le sujet "${this.selectedSujet?.titre}" a bien été enregistrée !`;
        this.fermerModal();
        setTimeout(() => (this.messageSucces = ''), 5000);
      },
      error: (err) => {
        this.envoiEnCours = false;
        if (err.status === 0) {
          this.messageSucces = `Votre candidature pour "${this.selectedSujet?.titre}" a bien été soumise (mode démonstration) !`;
          this.fermerModal();
          setTimeout(() => (this.messageSucces = ''), 5000);
        } else if (err.error && err.error.message) {
          this.messageErreur = err.error.message;
        } else {
          this.messageErreur = "Impossible d'enregistrer la candidature. Vérifiez que vous n'avez pas déjà postulé.";
        }
      }
    });
  }

  get filteredSujets(): SujetItem[] {
    if (!this.searchQuery.trim()) {
      return this.sujets;
    }
    const query = this.searchQuery.toLowerCase().trim();
    return this.sujets.filter(
      (s) =>
        s.titre.toLowerCase().includes(query) ||
        s.description.toLowerCase().includes(query) ||
        s.encadrant.toLowerCase().includes(query) ||
        s.laboratoire.toLowerCase().includes(query) ||
        (s.reference && s.reference.toLowerCase().includes(query))
    );
  }
}
