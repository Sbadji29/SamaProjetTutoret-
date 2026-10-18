import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../header/header';
import { Sidebar } from '../../sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';

interface RecentSujet {
  id: number;
  titre: string;
  auteur: string;
  capacite: string;
  estComplet: boolean;
}

interface RecentCandidature {
  id: number;
  titre: string;
  voeuInfo: string;
  date: string;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REJETEE';
}

@Component({
  selector: 'app-dashboard',
  imports: [CommonModule, RouterModule, Sidebar, Header, KpiCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard {
  userName: string = 'Camille';

  
  recentSujets: RecentSujet[] = [
    {
      id: 1,
      titre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      auteur: 'Pr. Marc Bernard (Département Génie Logiciel)',
      capacite: '2 / 3 places',
      estComplet: false,
    },
    {
      id: 2,
      titre: 'Système de recommandation basé sur LLM pour archives ouvertes',
      auteur: 'Dr. Sophie Mercier (Laboratoire I3S / IA)',
      capacite: '1 / 2 places',
      estComplet: false,
    },
    {
      id: 3,
      titre: "Architecture micro-services d'analyse de données IoT",
      auteur: 'Pr. Antoine Duval (Systèmes Distribués)',
      capacite: 'Complet (3/3)',
      estComplet: true,
    },
  ];

  
  recentCandidatures: RecentCandidature[] = [
    {
      id: 1,
      titre: 'Système de recommandation LLM',
      voeuInfo: 'Dr. Sophie Mercier • Vœu n°1',
      date: '14 oct. 2024',
      statut: 'EN_ATTENTE',
    },
    {
      id: 2,
      titre: 'Plateforme de télé-médecine',
      voeuInfo: 'Pr. Marc Bernard • Vœu n°2',
      date: '12 oct. 2024',
      statut: 'ACCEPTEE',
    },
    {
      id: 3,
      titre: 'Audit automatisé de sécurité CI/CD',
      voeuInfo: 'Pr. Luc Vasseur • Vœu n°3',
      date: '08 oct. 2024',
      statut: 'REJETEE',
    },
  ];
}
