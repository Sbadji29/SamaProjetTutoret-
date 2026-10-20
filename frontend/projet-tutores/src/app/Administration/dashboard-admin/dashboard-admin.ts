import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { EtudiantService } from '../../core/services/etudiant.service';
import { EnseignantService } from '../../core/services/enseignant.service';
import { SujetService } from '../../core/services/sujet.service';
import { CandidatureService } from '../../core/services/candidature.service';
import { AffectationService } from '../../core/services/affectation.service';

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
  totalEtudiants: number = 0;
  totalEnseignants: number = 0;
  totalSujets: number = 0;
  totalCandidatures: number = 0;
  chargement: boolean = false;

  modules: AdminModuleCard[] = [
    {
      id: 1,
      icon: 'bi-person',
      iconClass: 'module-icon-blue',
      title: 'Gestion des étudiants',
      description:
        "Accéder à l'annuaire complet, importer des listes d'inscrits ENT via fichier CSV et gérer la réinitialisation de comptes.",
      infoFooter: '0 profil actif',
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
      infoFooter: '0 enseignant actif',
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
      infoFooter: '0 sujet répertorié',
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
      infoFooter: '0 affectation finalisée',
      buttonLabel: 'Voir les affectations →',
      link: '/admin/affectations',
    },
  ];

  constructor(
    private etudiantService: EtudiantService,
    private enseignantService: EnseignantService,
    private sujetService: SujetService,
    private candidatureService: CandidatureService,
    private affectationService: AffectationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerStatistiques();
  }

  chargerStatistiques(): void {
    this.chargement = true;

    forkJoin({
      etudiants: this.etudiantService.obtenirTous().pipe(catchError(() => of([]))),
      enseignants: this.enseignantService.obtenirTous().pipe(catchError(() => of([]))),
      sujets: this.sujetService.getTous().pipe(catchError(() => of([]))),
      candidatures: this.candidatureService.getToutes().pipe(catchError(() => of([]))),
      affectations: this.affectationService.getToutes().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res) => {
        this.totalEtudiants = res.etudiants.length;
        this.totalEnseignants = res.enseignants.length;
        this.totalSujets = res.sujets.length;
        this.totalCandidatures = res.candidatures.length;

        this.modules[0].infoFooter = `${this.totalEtudiants} profil${this.totalEtudiants > 1 ? 's' : ''} actif${this.totalEtudiants > 1 ? 's' : ''}`;
        this.modules[1].infoFooter = `${this.totalEnseignants} enseignant${this.totalEnseignants > 1 ? 's' : ''} actif${this.totalEnseignants > 1 ? 's' : ''}`;
        this.modules[2].infoFooter = `${this.totalSujets} sujet${this.totalSujets > 1 ? 's' : ''} répertorié${this.totalSujets > 1 ? 's' : ''}`;
        this.modules[3].infoFooter = `${res.affectations.length} affectation${res.affectations.length > 1 ? 's' : ''} finalisée${res.affectations.length > 1 ? 's' : ''}`;

        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
}
