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
  userName = 'Mamadou Alpha';
  nbSujetsDispos = 2;
  nbCandidaturesDeposees = 1;
  nbCandidaturesAcceptees = 0;

  recentSujets: RecentSujet[] = [
    {
      id: 1,
      titre: "Conception d'une plateforme numérique de suivi des activités agricoles au Sénégal",
      auteur: "Pr. Moussa Diop (Informatique - UFR SAT)",
      capacite: '3 places au total',
      estComplet: false,
    },
    {
      id: 2,
      titre: "Détection d'anomalies réseau et sécurisation des infrastructures informatiques universitaires",
      auteur: "Pr. Moussa Diop (Informatique - UFR SAT)",
      capacite: '2 places au total',
      estComplet: false,
    }
  ];

  recentCandidatures: RecentCandidature[] = [
    {
      id: 1,
      titre: "Conception d'une plateforme numérique de suivi des activités agricoles au Sénégal",
      voeuInfo: "Pr. Moussa Diop • Vœu n°1",
      date: 'Récemment',
      statut: 'EN_ATTENTE',
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
