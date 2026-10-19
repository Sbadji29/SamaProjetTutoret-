import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { EtudiantService } from '../../core/services/etudiant.service';
import { EnseignantService } from '../../core/services/enseignant.service';
import { SujetService } from '../../core/services/sujet.service';
import { CandidatureService } from '../../core/services/candidature.service';

interface AdminModuleCard {
  id: number;
  icon: string;
  iconClass: string;
  title: string;
  description: string;
  infoFooter: string;
  buttonLabel: string;
  link: string;
}

@Component({
  selector: 'app-dashboard-admin',
  imports: [CommonModule, RouterModule, Sidebar, Header, KpiCard],
  templateUrl: './dashboard-admin.html',
  styleUrl: './dashboard-admin.css',
})
export class DashboardAdmin implements OnInit {
  totalEtudiants: number = 142;
  totalEnseignants: number = 24;
  totalSujets: number = 38;
  totalCandidatures: number = 94;
  chargement: boolean = false;

  modules: AdminModuleCard[] = [
    {
      id: 1,
      icon: 'bi-person',
      iconClass: 'module-icon-blue',
      title: 'Gestion des étudiants',
      description:
        "Accéder à l'annuaire complet, importer des listes d'inscrits ENT via fichier CSV et gérer la réinitialisation de comptes.",
      infoFooter: '142 profils actifs',
      buttonLabel: 'Gérer les étudiants →',
      link: '/admin/etudiants',
    },
    {
      id: 2,
      icon: 'bi-people-fill',
      iconClass: 'module-icon-purple',
      title: 'Gestion des enseignants',
      description:
        "Liste des enseignants-chercheurs, affectation aux départements pédagogiques et équilibrage des quotas horaires d'encadrement.",
      infoFooter: 'Capacité: 48 binômes',
      buttonLabel: 'Gérer les enseignants →',
      link: '/admin/enseignants',
    },
    {
      id: 3,
      icon: 'bi-card-checklist',
      iconClass: 'module-icon-green',
      title: 'Sujets & candidatures',
      description:
        'Supervision des fiches de projets tutorés soumises, validation collégiale de la commission et suivi des vœux étudiants.',
      infoFooter: '32 sujets éligibles',
      buttonLabel: 'Consulter les sujets →',
      link: '/catalogue',
    },
    {
      id: 4,
      icon: 'bi-diagram-3',
      iconClass: 'module-icon-indigo',
      title: 'Consultation des affectations',
      description:
        "Matrice des binômes formés, saturation des capacités d'accueil laboratoires et publication des procès-verbaux officiels.",
      infoFooter: 'Arbitrage: 87% finalisé',
      buttonLabel: 'Voir les affectations →',
      link: '/admin/affectations',
    },
  ];

  constructor(
    private etudiantService: EtudiantService,
    private enseignantService: EnseignantService,
    private sujetService: SujetService,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques(): void {
    this.chargement = true;

    this.etudiantService.obtenirTous().subscribe({
      next: (etudiants) => {
        if (etudiants && etudiants.length > 0) {
          this.totalEtudiants = etudiants.length;
          this.modules[0].infoFooter = `${etudiants.length} profils actifs`;
        }
      },
      error: () => {}
    });

    this.enseignantService.obtenirTous().subscribe({
      next: (enseignants) => {
        if (enseignants && enseignants.length > 0) {
          this.totalEnseignants = enseignants.length;
          this.modules[1].infoFooter = `${enseignants.length} enseignants actifs`;
        }
      },
      error: () => {}
    });

    this.sujetService.getTous().subscribe({
      next: (sujets) => {
        if (sujets && sujets.length > 0) {
          this.totalSujets = sujets.length;
          this.modules[2].infoFooter = `${sujets.length} sujets répertoriés`;
        }
      },
      error: () => {}
    });

    this.candidatureService.getToutes().subscribe({
      next: (cands) => {
        if (cands && cands.length > 0) {
          this.totalCandidatures = cands.length;
        }
        this.chargement = false;
      },
      error: () => {
        this.chargement = false;
      }
    });
  }
}
