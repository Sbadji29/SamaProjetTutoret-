import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';
import { Sujet } from '../sujet/sujet';
import { SujetItem } from '../sujet/sujet.model';

@Component({
  selector: 'app-catalogue',
  imports: [CommonModule, FormsModule, Sidebar, Sujet, Header],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css',
})
export class Catalogue {
  searchQuery: string = '';

  sujets: SujetItem[] = [
    {
      id: 1,
      titre: 'Orchestration Cloud Native de Microservices avec Kubernetes & Istio',
      description: "Conception et déploiement d'une architecture résiliente à tolérance de...",
      encadrant: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      date: '10 Oct 2024',
      statut: 'Disponible',
      placesOccupees: 2,
      placesTotales: 3,
    },
    {
      id: 2,
      titre: 'Génération Augmentée (RAG) appliquée aux Archives Hospitalières',
      description: 'Exploitation de modèles de langage locaux connectés à un stockage...',
      encadrant: 'Dr. Sophie Mercier',
      laboratoire: 'Laboratoire ERIC',
      date: '08 Oct 2024',
      statut: 'Disponible',
      placesOccupees: 1,
      placesTotales: 3,
    },
    {
      id: 3,
      titre: 'Application Mobile & Edge AI pour le Suivi Environnemental Citoyen',
      description: 'Capture temps réel de paramètres de biodiversité avec traitement embarqué...',
      encadrant: 'Dr. Hélène Roche',
      laboratoire: 'Laboratoire CITI',
      date: '03 Oct 2024',
      statut: 'Disponible',
      placesOccupees: 0,
      placesTotales: 3,
    },
    {
      id: 4,
      titre: 'Moteur de Traitement de Flux Événementiels Haute Performance',
      description: "Implémentation d'un pipeline de réconciliation financière temps réel...",
      encadrant: 'Pr. Marc Bernard',
      laboratoire: 'Laboratoire LIRIS',
      date: '01 Oct 2024',
      statut: 'Disponible',
      placesOccupees: 2,
      placesTotales: 3,
    },
  ];

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
        s.laboratoire.toLowerCase().includes(query)
    );
  }
}
