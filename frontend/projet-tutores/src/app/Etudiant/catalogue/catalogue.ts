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
      reference: 'SUJ-UGB-01',
      titre: "Conception d'une plateforme numérique de suivi des activités agricoles au Sénégal",
      description: "Développement d'une solution informatique permettant de collecter, centraliser et analyser les données agricoles pour faciliter le suivi des exploitations et la prise de décision.",
      encadrant: 'Pr. Moussa Diop',
      laboratoire: "Laboratoire d'informatique - UFR SAT",
      date: 'Session 2026-2027',
      statut: 'Disponible',
      placesOccupees: 0,
      placesTotales: 3,
      sessionId: 1
    },
    {
      id: 2,
      reference: 'SUJ-UGB-02',
      titre: "Détection d'anomalies réseau et sécurisation des infrastructures informatiques universitaires",
      description: "Étude et mise en œuvre d'une solution de surveillance du trafic réseau visant à détecter les comportements anormaux et à renforcer la sécurité des infrastructures informatiques de l'UGB.",
      encadrant: 'Pr. Moussa Diop',
      laboratoire: "Laboratoire d'informatique - UFR SAT",
      date: 'Session 2026-2027',
      statut: 'Disponible',
      placesOccupees: 0,
      placesTotales: 2,
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
    this.sujetService.getTous().subscribe({
      next: (apiSujets) => {
        this.chargement = false;
        if (apiSujets && apiSujets.length > 0) {
          this.sujets = apiSujets.map((s) => ({
            id: s.id || 0,
            reference: s.reference,
            titre: s.titre,
            description: s.description || '',
            encadrant: s.enseignant?.utilisateur ? `Pr. ${s.enseignant.utilisateur.prenom} ${s.enseignant.utilisateur.nom}`.trim() : 'Pr. Moussa Diop',
            laboratoire: s.enseignant?.laboratoire || s.enseignant?.departement || "Laboratoire d'informatique - UFR SAT",
            date: s.sessionUniversitaire?.libelle || 'Session 2026-2027',
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
