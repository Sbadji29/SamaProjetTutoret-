import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { SujetService } from '../../core/services/sujet.service';
import { CandidatureService } from '../../core/services/candidature.service';
import { AuthService } from '../../core/services/auth.service';

interface EnseignantSujetCard {
  id: string;
  titre: string;
  description: string;
  statusLabel: string;
  statusClass: string;
  capacite: number;
  candidatures: number;
  progression: string;
  progressionIcon: string;
  tags: string[];
  candidaturesCount: number;
  btnClass: string;
  isEditOnly?: boolean;
}

@Component({
  selector: 'app-enseignant-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Sidebar, KpiCard],
  templateUrl: './enseignant-dashboard.html',
  styleUrl: './enseignant-dashboard.css'
})
export class EnseignantDashboard implements OnInit {
  userName = 'Pr. Moussa Diop';
  nbSujets = 2;
  nbPlaces = 5;
  nbCandidatures = 2;

  sujets: EnseignantSujetCard[] = [
    {
      id: 'SUJ-UGB-01',
      titre: "Conception d'une plateforme numérique de suivi des activités agricoles au Sénégal",
      description: "Développement d'une solution informatique permettant de collecter, centraliser et analyser les données agricoles pour faciliter le suivi des exploitations et la prise de décision.",
      statusLabel: 'DISPONIBLE - 3 PLACES',
      statusClass: 'badge-disponible',
      capacite: 3,
      candidatures: 1,
      progression: '1 candidature en attente / 3',
      progressionIcon: 'bi-check-circle',
      tags: ['AgriTech', 'Cloud'],
      candidaturesCount: 1,
      btnClass: 'btn-success-subtle'
    },
    {
      id: 'SUJ-UGB-02',
      titre: "Détection d'anomalies réseau et sécurisation des infrastructures informatiques universitaires",
      description: "Étude et mise en œuvre d'une solution de surveillance du trafic réseau visant à détecter les comportements anormaux et à renforcer la sécurité des infrastructures informatiques de l'UGB.",
      statusLabel: 'DISPONIBLE - 2 PLACES',
      statusClass: 'badge-disponible',
      capacite: 2,
      candidatures: 1,
      progression: '1 candidature validée / 2',
      progressionIcon: 'bi-check2-all text-success',
      tags: ['Sécurité', 'Réseau'],
      candidaturesCount: 1,
      btnClass: 'btn-info-subtle'
    }
  ];

  constructor(
    private authService: AuthService,
    private sujetService: SujetService,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userName = user.prenom && user.nom ? `Pr. ${user.prenom} ${user.nom}` : user.nom || 'Pr. Moussa Diop';
    }

    this.sujetService.getTous().subscribe({
      next: (apiSujets) => {
        if (apiSujets && apiSujets.length > 0) {
          this.nbSujets = apiSujets.length;
          this.nbPlaces = apiSujets.reduce((acc, s) => acc + (s.capaciteMax || 0), 0);
          this.sujets = apiSujets.map((s) => ({
            id: s.reference || `SUJ-${s.id}`,
            titre: s.titre,
            description: s.description || '',
            statusLabel: s.disponible ? 'DISPONIBLE' : 'COMPLET',
            statusClass: s.disponible ? 'badge-disponible' : 'badge-complet',
            capacite: s.capaciteMax,
            candidatures: 0,
            progression: `Capacité : ${s.capaciteMax} étudiants`,
            progressionIcon: 'bi-people',
            tags: [s.niveau || 'Master 2 GDIL'],
            candidaturesCount: 0,
            btnClass: 'btn-success-subtle'
          }));
        }
      },
      error: () => {}
    });

    this.candidatureService.compter().subscribe({
      next: (res) => {
        if (res && res.nombreCandidatures !== undefined) {
          this.nbCandidatures = res.nombreCandidatures;
        }
      },
      error: () => {}
    });
  }
}
