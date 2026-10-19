import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';

@Component({
  selector: 'app-responsable-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Sidebar, KpiCard],
  templateUrl: './responsable-dashboard.html',
  styleUrl: './responsable-dashboard.css'
})
export class ResponsableDashboard {
  candidaturesPrioritaires = [
    {
      initials: 'SL',
      nom: 'Sarah Lemercier',
      parcours: 'M2 Génie Logiciel',
      projet: 'Plateforme de télé-médecine sécurisée',
      voeu: 'Vœu n°1',
      avisType: 'favorable',
      avisTexte: 'Favorable',
      avisEncadrant: 'Pr. M. Bernard',
      statut: 'EN_ATTENTE'
    },
    {
      initials: 'LM',
      nom: 'Lucas Moreau',
      parcours: 'M2 Génie Logiciel',
      projet: 'Plateforme de télé-médecine',
      voeu: 'Vœu n°2 • Conflit cap.',
      avisType: 'reserve',
      avisTexte: 'Réservé',
      avisEncadrant: 'Pr. M. Bernard',
      statut: 'EN_ATTENTE'
    },
    {
      initials: 'TR',
      nom: 'Thomas Roux',
      parcours: 'M2 Sécurité & Syst.',
      projet: 'Moteur de Traitement de Flux Évén.',
      voeu: 'Vœu n°1',
      avisType: 'favorable',
      avisTexte: 'Favorable',
      avisEncadrant: 'Dr. S. Valérie',
      statut: 'EN_ATTENTE'
    }
  ];
}
