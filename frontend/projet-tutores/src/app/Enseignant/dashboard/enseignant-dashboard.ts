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
  userName = 'Pr. Marc Bernard';
  nbSujets = 3;
  nbPlaces = 8;
  nbCandidatures = 6;

  sujets: EnseignantSujetCard[] = [
    {
      id: 'SUJ-2024-042',
      titre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      description: "Conception d'une architecture multi-tenant conforme RGPD/HDS pour flux vidéo et dossier patient sécurisé avec enclave SGX.",
      statusLabel: 'DISPONIBLE - 1 PLACE RESTANTE',
      statusClass: 'badge-disponible',
      capacite: 3,
      candidatures: 4,
      progression: '2 pré-validés / 3',
      progressionIcon: 'bi-check-circle',
      tags: ['Cloud Native', 'e-Santé'],
      candidaturesCount: 4,
      btnClass: 'btn-success-subtle'
    },
    {
      id: 'SUJ-2024-039',
      titre: 'Orchestration Cloud Native de Microservices avec Kubernetes & Istio',
      description: "Mise en place d'un maillage de services (Service Mesh) avec injection automatique de proxy sidecar, mutual TLS et observabilité avancée Jaeger.",
      statusLabel: 'COMPLET',
      statusClass: 'badge-complet',
      capacite: 3,
      candidatures: 2,
      progression: 'Équipe au complet (3/3)',
      progressionIcon: 'bi-check2-all text-success',
      tags: ['DevOps', 'Networking'],
      candidaturesCount: 2,
      btnClass: 'btn-info-subtle'
    },
    {
      id: 'SUJ-2024-051',
      titre: 'Moteur de Traitement de Flux Événementiels Haute Performance',
      description: "Étude comparative Rust vs Go pour l'ingestion de millions de métriques de capteurs temps réel sans latence GC.",
      statusLabel: "EN ATTENTE D'ÉTUDIANTS",
      statusClass: 'badge-attente',
      capacite: 2,
      candidatures: 0,
      progression: '18 consultations',
      progressionIcon: 'bi-eye',
      tags: ['Systèmes distribués', 'Rust'],
      candidaturesCount: 0,
      btnClass: 'btn-outline-secondary',
      isEditOnly: true
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
      this.userName = `${user.prenom} ${user.nom}`;
      const enseignantId = user.profilId || 1;

      this.sujetService.getParEnseignant(enseignantId).subscribe({
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
              tags: [s.niveau || 'Master 2'],
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
}
