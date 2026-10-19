import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { AffectationItem } from './affectations.model';
import { AffectationService } from '../../core/services/affectation.service';
import { SujetService } from '../../core/services/sujet.service';
import { EtudiantService } from '../../core/services/etudiant.service';

@Component({
  selector: 'app-affectations',
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header, KpiCard],
  templateUrl: './affectations.html',
  styleUrl: './affectations.css',
})
export class Affectations implements OnInit {
  searchQuery: string = '';
  selectedLab: string = 'Tous les laboratoires';
  selectedStatut: string = 'Tous les statuts';
  chargement: boolean = false;

  totalInscrits: number = 38;
  affectesFermes: number = 28;
  sansAffectation: number = 10;
  sujetsPourvus: string = '11 / 14';
  tauxPourvus: number = 74;
  tauxSujets: number = 85;

  laboratoires: string[] = [
    'Tous les laboratoires',
    'Laboratoire LIRIS',
    'Laboratoire CRAN',
    'Laboratoire LORIA',
  ];

  statuts: string[] = [
    'Tous les statuts',
    'Validé ferme',
    'En attente d\'arbitrage',
    'Sujet Vacant',
  ];

  affectations: AffectationItem[] = [
    {
      id: 1,
      etudiantNom: 'Mamadou Alpha Touré',
      etudiantInitiales: 'MT',
      avatarClass: 'avatar-green',
      sujetTitre: "Conception d'une plateforme numérique de suivi des activités agricoles au Sénégal",
      enseignantNom: 'Pr. Moussa Diop',
      laboratoire: "Laboratoire d'informatique",
      statut: 'VALIDE',
      statutLabel: 'Validé ferme',
      capacitePrise: 1,
      capaciteTotal: 3,
      placesRestantes: 2,
    },
    {
      id: 2,
      etudiantNom: 'Fatou Marie Ndiaye',
      etudiantInitiales: 'FN',
      avatarClass: 'avatar-green',
      sujetTitre: "Détection d'anomalies réseau et sécurisation des infrastructures informatiques universitaires",
      enseignantNom: 'Pr. Moussa Diop',
      laboratoire: "Laboratoire d'informatique",
      statut: 'VALIDE',
      statutLabel: 'Validé ferme',
      capacitePrise: 1,
      capaciteTotal: 2,
      placesRestantes: 1,
    },
    {
      id: 3,
      etudiantNom: 'Alioune Badara Badji',
      etudiantInitiales: 'AB',
      avatarClass: 'avatar-yellow',
      sujetTitre: "Conception d'une plateforme numérique de suivi des activités agricoles au Sénégal",
      enseignantNom: 'Pr. Moussa Diop',
      laboratoire: "Laboratoire d'informatique",
      statut: 'ARBITRAGE',
      statutLabel: "En attente d'arbitrage",
      capacitePrise: 1,
      capaciteTotal: 3,
      placesRestantes: 2,
    },
    {
      id: 4,
      etudiantNom: 'Non affecté',
      estNonAffecte: true,
      sujetTitre: "Détection d'anomalies réseau et sécurisation des infrastructures informatiques universitaires",
      enseignantNom: 'Pr. Moussa Diop',
      laboratoire: "Laboratoire d'informatique",
      statut: 'VACANT',
      statutLabel: 'Places disponibles',
      capacitePrise: 1,
      capaciteTotal: 2,
      placesRestantes: 1,
    }
  ];

  constructor(
    private affectationService: AffectationService,
    private sujetService: SujetService,
    private etudiantService: EtudiantService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;
    this.affectationService.getToutes().subscribe({
      next: (apiAffectations) => {
        this.sujetService.getTous().subscribe({
          next: (apiSujets) => {
            this.etudiantService.obtenirTous().subscribe({
              next: (apiEtudiants) => {
                this.chargement = false;
                const subjects = apiSujets || [];
                const assigns = apiAffectations || [];
                const students = apiEtudiants || [];

                if (assigns.length > 0) {
                  const avatarColors = ['avatar-green', 'avatar-dark', 'avatar-yellow', 'avatar-blue'];

                  const affItems: AffectationItem[] = assigns.map((a, index) => {
                    const prenom = a.etudiant?.utilisateur?.prenom || '';
                    const nom = a.etudiant?.utilisateur?.nom || '';
                    const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || 'ET';
                    const ensNom = a.sujet?.enseignant ? `${a.sujet.enseignant.utilisateur?.prenom || ''} ${a.sujet.enseignant.utilisateur?.nom || ''}`.trim() : 'Enseignant';
                    const labo = a.sujet?.enseignant?.laboratoire || a.sujet?.enseignant?.departement || 'Laboratoire Universitaire';
                    const capTotal = a.sujet?.capaciteMax || 2;
                    const capPrise = assigns.filter(other => other.sujet?.id === a.sujet?.id).length;

                    return {
                      id: a.id || index + 1,
                      etudiantNom: `${prenom} ${nom}`.trim() || 'Étudiant',
                      etudiantInitiales: initials,
                      avatarClass: avatarColors[index % avatarColors.length],
                      sujetTitre: a.sujet?.titre || 'Sujet de projet',
                      enseignantNom: ensNom,
                      laboratoire: labo,
                      statut: 'VALIDE',
                      statutLabel: 'Validé ferme',
                      capacitePrise: capPrise,
                      capaciteTotal: capTotal,
                      placesRestantes: Math.max(0, capTotal - capPrise),
                    };
                  });

                  const assignedSubjectIds = new Set(assigns.map(a => a.sujet?.id));
                  const vacantSubjects = subjects.filter(s => !assignedSubjectIds.has(s.id));

                  vacantSubjects.forEach((vs, idx) => {
                    const ensNom = vs.enseignant ? `${vs.enseignant.utilisateur?.prenom || ''} ${vs.enseignant.utilisateur?.nom || ''}`.trim() : 'Enseignant';
                    affItems.push({
                      id: 1000 + (vs.id || idx),
                      etudiantNom: 'Non affecté',
                      estNonAffecte: true,
                      sujetTitre: vs.titre,
                      enseignantNom: ensNom,
                      laboratoire: vs.enseignant?.laboratoire || vs.enseignant?.departement || 'Laboratoire Universitaire',
                      statut: 'VACANT',
                      statutLabel: 'Sujet Vacant',
                      capacitePrise: 0,
                      capaciteTotal: vs.capaciteMax || 2,
                      placesRestantes: vs.capaciteMax || 2,
                    });
                  });

                  this.affectations = affItems;
                }

                if (students.length > 0) {
                  this.totalInscrits = students.length;
                }
                this.affectesFermes = assigns.length;
                this.sansAffectation = Math.max(0, this.totalInscrits - this.affectesFermes);
                if (this.totalInscrits > 0) {
                  this.tauxPourvus = Math.min(100, Math.round((this.affectesFermes / this.totalInscrits) * 100));
                }

                if (subjects.length > 0) {
                  const assignedSubjectCount = new Set(assigns.map(a => a.sujet?.id)).size;
                  this.sujetsPourvus = `${assignedSubjectCount} / ${subjects.length}`;
                  this.tauxSujets = Math.min(100, Math.round((assignedSubjectCount / subjects.length) * 100));
                }
              },
              error: () => {
                this.chargement = false;
              }
            });
          },
          error: () => {
            this.chargement = false;
          }
        });
      },
      error: () => {
        this.chargement = false;
      }
    });
  }

  get filteredAffectations(): AffectationItem[] {
    return this.affectations.filter((item) => {
      const q = this.searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.etudiantNom.toLowerCase().includes(q) ||
        item.sujetTitre.toLowerCase().includes(q) ||
        item.enseignantNom.toLowerCase().includes(q);

      const matchLab =
        this.selectedLab === 'Tous les laboratoires' ||
        item.laboratoire.includes(this.selectedLab);

      let matchStatut = true;
      if (this.selectedStatut === 'Validé ferme') {
        matchStatut = item.statut === 'VALIDE';
      } else if (this.selectedStatut === "En attente d'arbitrage") {
        matchStatut = item.statut === 'ARBITRAGE';
      } else if (this.selectedStatut === 'Sujet Vacant') {
        matchStatut = item.statut === 'VACANT';
      }

      return matchQuery && matchLab && matchStatut;
    });
  }
}
