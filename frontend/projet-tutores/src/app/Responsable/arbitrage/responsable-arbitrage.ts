import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';

export interface ArbitrageItem {
  id: string;
  initials: string;
  avatarClass: string;
  nom: string;
  sujet: string;
  enseignant: string;
  date: string;
  capaciteStatus: 'disponible' | 'complet';
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';
  voeu: string;
  voeuPriorite: string;
  placesRestantes: string;
  parcours: string;
}

@Component({
  selector: 'app-responsable-arbitrage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header, Sidebar],
  templateUrl: './responsable-arbitrage.html',
  styleUrl: './responsable-arbitrage.css'
})
export class ResponsableArbitrage {
  candidatures: ArbitrageItem[] = [
    {
      id: 'ARB-01',
      initials: 'SL',
      avatarClass: 'bg-forest',
      nom: 'Sarah Lemercier',
      sujet: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      enseignant: 'Pr. Marc Bernard',
      date: '24/10/2024',
      capaciteStatus: 'disponible',
      statut: 'EN_ATTENTE',
      voeu: 'Vœu n°1',
      voeuPriorite: 'Vœu n°1 (Priorité haute)',
      placesRestantes: '1 place restante (2/3 retenus)',
      parcours: 'M2 Génie Logiciel'
    },
    {
      id: 'ARB-02',
      initials: 'AD',
      avatarClass: 'bg-primary-subtle text-primary',
      nom: 'Alexandre Dubois',
      sujet: 'Cloud Native Service Mesh avec Istio',
      enseignant: 'Dr. Claire Vasseur',
      date: '23/10/2024',
      capaciteStatus: 'disponible',
      statut: 'EN_ATTENTE',
      voeu: 'Vœu n°1',
      voeuPriorite: 'Vœu n°1 (Priorité haute)',
      placesRestantes: '1 place restante (1/2 retenu)',
      parcours: 'M2 Systèmes & Réseaux'
    },
    {
      id: 'ARB-03',
      initials: 'TR',
      avatarClass: 'bg-primary-subtle text-primary',
      nom: 'Thomas Roux',
      sujet: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      enseignant: 'Pr. Marc Bernard',
      date: '22/10/2024',
      capaciteStatus: 'disponible',
      statut: 'EN_ATTENTE',
      voeu: 'Vœu n°2',
      voeuPriorite: 'Vœu n°2 (Priorité moyenne)',
      placesRestantes: '1 place restante (2/3 retenus)',
      parcours: 'M2 Sécurité & Syst.'
    },
    {
      id: 'ARB-04',
      initials: 'LB',
      avatarClass: 'bg-primary-subtle text-primary',
      nom: 'Lina Benali',
      sujet: 'Cloud Native Service Mesh avec Istio',
      enseignant: 'Dr. Claire Vasseur',
      date: '21/10/2024',
      capaciteStatus: 'disponible',
      statut: 'EN_ATTENTE',
      voeu: 'Vœu n°1',
      voeuPriorite: 'Vœu n°1 (Priorité haute)',
      placesRestantes: '1 place restante (1/2 retenu)',
      parcours: 'M2 Génie Logiciel'
    },
    {
      id: 'ARB-05',
      initials: 'LM',
      avatarClass: 'bg-primary-subtle text-primary',
      nom: 'Lucas Moreau',
      sujet: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      enseignant: 'Pr. Marc Bernard',
      date: '20/10/2024',
      capaciteStatus: 'disponible',
      statut: 'EN_ATTENTE',
      voeu: 'Vœu n°2',
      voeuPriorite: 'Vœu n°2 (Conflit cap.)',
      placesRestantes: '1 place restante (2/3 retenus)',
      parcours: 'M2 Génie Logiciel'
    }
  ];

  selectedCandidature: ArbitrageItem = this.candidatures[0];
  activeTab: 'TOUTES' | 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE' = 'EN_ATTENTE';
  searchTerm = '';
  selectedParcours = 'Tous les parcours M2';

  get countToutes(): number {
    return 42;
  }

  get countEnAttente(): number {
    return this.candidatures.filter(c => c.statut === 'EN_ATTENTE').length;
  }

  get countValidees(): number {
    return 28;
  }

  get countRejetees(): number {
    return 9;
  }

  get filteredList(): ArbitrageItem[] {
    return this.candidatures.filter(c => {
      const matchSearch = !this.searchTerm ||
        c.nom.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        c.sujet.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchSearch;
    });
  }

  select(c: ArbitrageItem): void {
    this.selectedCandidature = c;
  }

  accepter(): void {
    this.selectedCandidature.statut = 'VALIDEE';
    const next = this.candidatures.find(c => c.statut === 'EN_ATTENTE');
    if (next) {
      this.selectedCandidature = next;
    }
  }

  rejeter(): void {
    this.selectedCandidature.statut = 'REJETEE';
    const next = this.candidatures.find(c => c.statut === 'EN_ATTENTE');
    if (next) {
      this.selectedCandidature = next;
    }
  }
}
