import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';

@Component({
  selector: 'app-responsable-affectations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header, Sidebar, KpiCard],
  templateUrl: './responsable-affectations.html',
  styleUrl: './responsable-affectations.css'
})
export class ResponsableAffectations {
  searchTerm = '';
  selectedFilter = 'Tous les sujets';

  sujets = [
    {
      id: 'SUJ-2024-042',
      titre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      encadrant: 'Pr. Marc Bernard',
      capacite: 3,
      assignes: 2,
      etudiants: [
        { nom: 'Sarah Lemercier', date: '24/10/2024', voeu: 'Vœu 1' },
        { nom: 'Thomas Roux', date: '22/10/2024', voeu: 'Vœu 2' }
      ]
    },
    {
      id: 'SUJ-2024-048',
      titre: "Détection d'anomalies réseau via Transformer & eBPF",
      encadrant: 'Pr. Marc Bernard',
      capacite: 2,
      assignes: 2,
      etudiants: [
        { nom: 'Alexandre Dubois', date: '23/10/2024', voeu: 'Vœu 1' },
        { nom: 'Lina Benali', date: '21/10/2024', voeu: 'Vœu 1' }
      ]
    },
    {
      id: 'SUJ-2024-039',
      titre: 'Optimisation de requêtes SQL vectorielles sous DuckDB',
      encadrant: 'Dr. Claire Vasseur',
      capacite: 3,
      assignes: 3,
      etudiants: [
        { nom: 'Julien Faure', date: '19/10/2024', voeu: 'Vœu 1' },
        { nom: 'Maxime Bertrand', date: '18/10/2024', voeu: 'Vœu 2' },
        { nom: 'Chloé Martin', date: '17/10/2024', voeu: 'Vœu 1' }
      ]
    },
    {
      id: 'SUJ-2024-051',
      titre: 'Audit automatisé de conformité RGPD en architecture micro-services',
      encadrant: 'Dr. Stéphane Valérie',
      capacite: 2,
      assignes: 1,
      etudiants: [
        { nom: 'Lucas Moreau', date: '20/10/2024', voeu: 'Vœu 2' }
      ]
    }
  ];

  get filteredSujets() {
    return this.sujets.filter(s => {
      const matchSearch = !this.searchTerm ||
        s.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        s.encadrant.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchSearch;
    });
  }
}
