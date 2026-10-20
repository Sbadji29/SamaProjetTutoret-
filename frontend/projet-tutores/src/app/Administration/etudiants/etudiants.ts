import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { EtudiantItem, StatutEtudiant } from './etudiants.model';
import { EtudiantService } from '../../core/services/etudiant.service';
import { AffectationService } from '../../core/services/affectation.service';
import { CandidatureService } from '../../core/services/candidature.service';

@Component({
  selector: 'app-etudiants',
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header, KpiCard],
  templateUrl: './etudiants.html',
  styleUrl: './etudiants.css',
})
export class Etudiants implements OnInit {
  searchQuery: string = '';
  selectedParcours: string = 'Tous les parcours';
  selectedStatut: string = 'Tous les statuts';
  chargement: boolean = false;

  totalInscrits: number = 0;
  affectationsValidees: number = 0;
  voeuxEnAttente: number = 0;
  sansCandidature: number = 0;

  parcoursList: string[] = [
    'Tous les parcours',
    'Master Génie Informatique (M2 GDIL)',
    'M2 Systèmes & Réseaux',
    'M2 Sécurité & IA',
  ];

  statutsList: string[] = [
    'Tous les statuts',
    'Affecté',
    'En attente',
    'Aucun vœu',
  ];

  etudiants: EtudiantItem[] = [];

  constructor(
    private etudiantService: EtudiantService,
    private affectationService: AffectationService,
    private candidatureService: CandidatureService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;

    forkJoin({
      etudiants: this.etudiantService.obtenirTous().pipe(catchError(() => of([]))),
      affectations: this.affectationService.getToutes().pipe(catchError(() => of([]))),
      candidatures: this.candidatureService.getToutes().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res) => {
        const apiEtudiants = res.etudiants || [];
        const apiAffectations = res.affectations || [];
        const apiCandidatures = res.candidatures || [];

        const affectesEtuIds = new Set(apiAffectations.map(a => a.etudiant?.id));
        const avatarColors = ['avatar-green', 'avatar-blue', 'avatar-green-bright', 'avatar-navy', 'avatar-gray'];

        this.etudiants = apiEtudiants.map((e, index) => {
          const prenom = e.utilisateur?.prenom || '';
          const nom = e.utilisateur?.nom || '';
          const fullNom = `${prenom} ${nom}`.trim() || 'Étudiant';
          const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || 'ET';

          let statut: StatutEtudiant = 'AUCUN_VOEU';
          let statutLabel = 'AUCUN VŒU';

          if (e.id && affectesEtuIds.has(e.id)) {
            statut = 'AFFECTE';
            statutLabel = 'AFFECTÉ(E)';
          } else {
            const etuCands = apiCandidatures.filter(c => c.etudiant?.id === e.id);
            if (etuCands.length > 0) {
              statut = 'ATTENTE';
              statutLabel = `${etuCands.length} VŒU(X) EN ATTENTE`;
            }
          }

          return {
            id: e.id || index + 1,
            initiales: initials,
            avatarClass: avatarColors[index % avatarColors.length],
            nom: fullNom,
            numeroEtudiant: e.numeroEtudiant,
            email: e.utilisateur?.email || '',
            parcours: e.filiere || 'Master Génie Informatique (M2 GDIL)',
            statut: statut,
            statutLabel: statutLabel,
            compteEntActif: e.utilisateur?.actif ?? true,
          };
        });

        this.totalInscrits = this.etudiants.length;
        this.affectationsValidees = this.etudiants.filter(e => e.statut === 'AFFECTE').length;
        this.voeuxEnAttente = this.etudiants.filter(e => e.statut === 'ATTENTE').length;
        this.sansCandidature = this.etudiants.filter(e => e.statut === 'AUCUN_VOEU').length;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  supprimer(id: number): void {
    this.etudiantService.supprimer(id).subscribe({
      next: () => {
        this.etudiants = this.etudiants.filter(e => e.id !== id);
        this.totalInscrits = this.etudiants.length;
        this.affectationsValidees = this.etudiants.filter(e => e.statut === 'AFFECTE').length;
        this.voeuxEnAttente = this.etudiants.filter(e => e.statut === 'ATTENTE').length;
        this.sansCandidature = this.etudiants.filter(e => e.statut === 'AUCUN_VOEU').length;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  get filteredEtudiants(): EtudiantItem[] {
    return this.etudiants.filter((etu) => {
      const q = this.searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        etu.nom.toLowerCase().includes(q) ||
        etu.numeroEtudiant.includes(q) ||
        etu.email.toLowerCase().includes(q) ||
        etu.parcours.toLowerCase().includes(q);

      const matchParcours =
        this.selectedParcours === 'Tous les parcours' ||
        etu.parcours === this.selectedParcours;

      let matchStatut = true;
      if (this.selectedStatut === 'Affecté') {
        matchStatut = etu.statut === 'AFFECTE';
      } else if (this.selectedStatut === 'En attente') {
        matchStatut = etu.statut === 'ATTENTE';
      } else if (this.selectedStatut === 'Aucun vœu') {
        matchStatut = etu.statut === 'AUCUN_VOEU';
      }

      return matchQuery && matchParcours && matchStatut;
    });
  }
}
