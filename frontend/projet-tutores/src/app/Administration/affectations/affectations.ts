import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../header/header';
import { Sidebar } from '../../sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { AffectationItem } from './affectations.model';

@Component({
  selector: 'app-affectations',
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header, KpiCard],
  templateUrl: './affectations.html',
  styleUrl: './affectations.css',
})
export class Affectations {
  searchQuery: string = '';
  selectedLab: string = 'Tous les laboratoires';
  selectedStatut: string = 'Tous les statuts';

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
      etudiantNom: 'Alexandre Dubois',
      etudiantInitiales: 'AD',
      avatarClass: 'avatar-green',
      sujetTitre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      enseignantNom: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      statut: 'VALIDE',
      statutLabel: 'Validé ferme',
      capacitePrise: 2,
      capaciteTotal: 3,
      placesRestantes: 1,
    },
    {
      id: 2,
      etudiantNom: 'Camille Laurent',
      etudiantInitiales: 'CL',
      avatarClass: 'avatar-green',
      sujetTitre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      enseignantNom: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      statut: 'VALIDE',
      statutLabel: 'Validé ferme',
      capacitePrise: 2,
      capaciteTotal: 3,
      placesRestantes: 1,
    },
    {
      id: 3,
      etudiantNom: 'Julien Faure',
      etudiantInitiales: 'JF',
      avatarClass: 'avatar-dark',
      sujetTitre: 'Orchestration Cloud Native de Microservices avec Istio',
      enseignantNom: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      statut: 'VALIDE',
      statutLabel: 'Validé ferme',
      capacitePrise: 3,
      capaciteTotal: 3,
      placesRestantes: 0,
    },
    {
      id: 4,
      etudiantNom: 'Thomas Roux',
      etudiantInitiales: 'TR',
      avatarClass: 'avatar-dark',
      sujetTitre: 'Orchestration Cloud Native de Microservices avec Istio',
      enseignantNom: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      statut: 'VALIDE',
      statutLabel: 'Validé ferme',
      capacitePrise: 3,
      capaciteTotal: 3,
      placesRestantes: 0,
    },
    {
      id: 5,
      etudiantNom: 'Maxime Robert',
      etudiantInitiales: 'MR',
      avatarClass: 'avatar-dark',
      sujetTitre: 'Orchestration Cloud Native de Microservices avec Istio',
      enseignantNom: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      statut: 'VALIDE',
      statutLabel: 'Validé ferme',
      capacitePrise: 3,
      capaciteTotal: 3,
      placesRestantes: 0,
    },
    {
      id: 6,
      etudiantNom: 'Sarah Lemercier',
      etudiantInitiales: 'SL',
      avatarClass: 'avatar-yellow',
      sujetTitre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      enseignantNom: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      statut: 'ARBITRAGE',
      statutLabel: "En attente d'arbitrage",
      capacitePrise: 2,
      capaciteTotal: 3,
      placesRestantes: 1,
    },
    {
      id: 7,
      etudiantNom: 'Non affecté',
      estNonAffecte: true,
      sujetTitre: 'Moteur de Traitement de Flux Événementiels Haute Performance',
      enseignantNom: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      statut: 'VACANT',
      statutLabel: 'Sujet Vacant',
      capacitePrise: 0,
      capaciteTotal: 2,
      placesRestantes: 2,
    },
  ];

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
