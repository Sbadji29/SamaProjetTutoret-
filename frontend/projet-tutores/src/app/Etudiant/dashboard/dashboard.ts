import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { AuthService } from '../../core/services/auth.service';
import { SujetService } from '../../core/services/sujet.service';
import { CandidatureService } from '../../core/services/candidature.service';

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
  standalone: true,
  imports: [CommonModule, RouterModule, Sidebar, Header, KpiCard],
  templateUrl: './dashboard.html',
  styleUrl: './dashboard.css',
})
export class Dashboard implements OnInit {
  userName = 'Camille';
  nbSujetsDispos = 3;
  nbCandidaturesDeposees = 3;
  nbCandidaturesAcceptees = 1;

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
      titre: 'Détection d\'anomalies réseau via Transformer & eBPF',
      auteur: 'Pr. Marc Bernard (Laboratoire LIRIS)',
      capacite: '1 / 2 places',
      estComplet: false,
    },
    {
      id: 3,
      titre: 'Optimisation de requêtes SQL vectorielles sous DuckDB',
      auteur: 'Dr. Claire Vasseur (Systèmes Distribués)',
      capacite: 'Complet (3/3)',
      estComplet: true,
    },
  ];

  recentCandidatures: RecentCandidature[] = [
    {
      id: 1,
      titre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      voeuInfo: 'Pr. Marc Bernard • Vœu n°1',
      date: '14 oct. 2024',
      statut: 'EN_ATTENTE',
    },
    {
      id: 2,
      titre: 'Détection d\'anomalies réseau via Transformer & eBPF',
      voeuInfo: 'Pr. Marc Bernard • Vœu n°2',
      date: '12 oct. 2024',
      statut: 'ACCEPTEE',
    },
    {
      id: 3,
      titre: 'Optimisation de requêtes SQL vectorielles sous DuckDB',
      voeuInfo: 'Dr. Claire Vasseur • Vœu n°3',
      date: '08 oct. 2024',
      statut: 'REJETEE',
    },
  ];

  constructor(
    private authService: AuthService,
    private sujetService: SujetService,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userName = user.prenom || user.nom;
      const etudiantId = user.profilId || 1;

      this.candidatureService.getParEtudiant(etudiantId).subscribe({
        next: (cands) => {
          if (cands && cands.length > 0) {
            this.nbCandidaturesDeposees = cands.length;
            this.nbCandidaturesAcceptees = cands.filter(c => c.statut === 'ACCEPTEE').length;
            this.recentCandidatures = cands.slice(0, 3).map((c) => ({
              id: c.id || 0,
              titre: c.sujet?.titre || 'Sujet sélectionné',
              voeuInfo: `${c.sujet?.enseignant ? c.sujet.enseignant.utilisateur?.nom : 'Enseignant'} • Vœu n°${c.priorite}`,
              date: c.dateCandidature ? new Date(c.dateCandidature).toLocaleDateString('fr-FR') : 'Récent',
              statut: c.statut || 'EN_ATTENTE'
            }));
          }
        },
        error: () => {}
      });
    }

    this.sujetService.getTous().subscribe({
      next: (sujets) => {
        if (sujets && sujets.length > 0) {
          this.nbSujetsDispos = sujets.filter(s => s.disponible).length;
          this.recentSujets = sujets.slice(0, 3).map((s) => ({
            id: s.id || 0,
            titre: s.titre,
            auteur: s.enseignant ? `${s.enseignant.utilisateur?.prenom || ''} ${s.enseignant.utilisateur?.nom || ''} (${s.enseignant.departement})` : 'Enseignant',
            capacite: `${s.capaciteMax} places au total`,
            estComplet: !s.disponible
          }));
        }
      },
      error: () => {}
    });
  }
}
