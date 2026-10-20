import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { EnseignantItem } from './enseignants.model';
import { EnseignantService } from '../../core/services/enseignant.service';
import { SujetService } from '../../core/services/sujet.service';
import { AffectationService } from '../../core/services/affectation.service';

@Component({
  selector: 'app-enseignants',
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header, KpiCard],
  templateUrl: './enseignants.html',
  styleUrl: './enseignants.css',
})
export class Enseignants implements OnInit {
  searchQuery: string = '';
  selectedLab: string = 'Tous les laboratoires';
  selectedStatut: string = 'Statut : Tous';
  chargement: boolean = false;

  totalEnseignants: number = 0;
  totalSujets: number = 0;
  tauxMobilisation: string = '0%';
  progressMobilisation: number = 0;
  enAttenteDepot: number = 0;
  capaciteCumulee: number = 0;
  totalAssignes: number = 0;

  laboratoires: string[] = [
    'Tous les laboratoires',
    'Laboratoire LANI',
    "Laboratoire d'Informatique",
  ];

  statuts: string[] = [
    'Statut : Tous',
    'Complet',
    'Places disponibles',
    'Sans sujet déposé',
  ];

  enseignants: EnseignantItem[] = [];

  constructor(
    private enseignantService: EnseignantService,
    private sujetService: SujetService,
    private affectationService: AffectationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;

    forkJoin({
      enseignants: this.enseignantService.obtenirTous().pipe(catchError(() => of([]))),
      sujets: this.sujetService.getTous().pipe(catchError(() => of([]))),
      affectations: this.affectationService.getToutes().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res) => {
        const apiEnseignants = res.enseignants || [];
        const subjects = res.sujets || [];
        const assigns = res.affectations || [];

        const avatarColors = ['avatar-navy', 'avatar-blue', 'avatar-green', 'avatar-cyan', 'avatar-dark'];

        this.enseignants = apiEnseignants.map((ens, index) => {
          const prenom = ens.utilisateur?.prenom || '';
          const nom = ens.utilisateur?.nom || '';
          const fullNom = `${prenom} ${nom}`.trim() || 'Enseignant';
          const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || 'EN';

          const ensSujets = subjects.filter(s => s.enseignant?.id === ens.id);
          const nbSujets = ensSujets.length;
          const nbPlaces = ensSujets.reduce((acc, s) => acc + (s.capaciteMax || 0), 0);
          const ensSujetIds = new Set(ensSujets.map(s => s.id));
          const etudiantsAssignes = assigns.filter(a => a.sujet?.id && ensSujetIds.has(a.sujet.id)).length;

          return {
            id: ens.id || index + 1,
            initiales: initials,
            avatarClass: avatarColors[index % avatarColors.length],
            nom: fullNom,
            titre: ens.specialite || 'Enseignant-Chercheur',
            email: ens.utilisateur?.email || '',
            departement: ens.departement || 'Informatique - UFR SAT',
            laboratoire: ens.laboratoire || "Laboratoire d'informatique",
            nbSujets: nbSujets,
            nbPlaces: nbPlaces,
            etudiantsAssignes: etudiantsAssignes,
            quotaMax: ens.quotaEncadrement || 6,
          };
        });

        this.totalEnseignants = this.enseignants.length;
        this.totalSujets = subjects.length;
        this.capaciteCumulee = subjects.reduce((acc, s) => acc + (s.capaciteMax || 0), 0);
        this.totalAssignes = assigns.length;
        this.enAttenteDepot = this.enseignants.filter(e => e.nbSujets === 0).length;

        if (this.capaciteCumulee > 0) {
          this.progressMobilisation = Math.min(100, Math.round((this.totalAssignes / this.capaciteCumulee) * 100));
        } else {
          this.progressMobilisation = 0;
        }
        this.tauxMobilisation = `${this.progressMobilisation}%`;

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
    this.enseignantService.supprimer(id).subscribe({
      next: () => {
        this.enseignants = this.enseignants.filter(e => e.id !== id);
        this.totalEnseignants = this.enseignants.length;
        this.enAttenteDepot = this.enseignants.filter(e => e.nbSujets === 0).length;
        this.cdr.detectChanges();
      },
      error: () => {}
    });
  }

  get filteredEnseignants(): EnseignantItem[] {
    return this.enseignants.filter((ens) => {
      const q = this.searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        ens.nom.toLowerCase().includes(q) ||
        ens.email.toLowerCase().includes(q) ||
        ens.departement.toLowerCase().includes(q) ||
        ens.laboratoire.toLowerCase().includes(q);

      const matchLab =
        this.selectedLab === 'Tous les laboratoires' ||
        ens.laboratoire.includes(this.selectedLab);

      let matchStatut = true;
      if (this.selectedStatut === 'Complet') {
        matchStatut = ens.etudiantsAssignes === ens.quotaMax;
      } else if (this.selectedStatut === 'Places disponibles') {
        matchStatut = ens.etudiantsAssignes < ens.quotaMax && ens.nbSujets > 0;
      } else if (this.selectedStatut === 'Sans sujet déposé') {
        matchStatut = ens.nbSujets === 0;
      }

      return matchQuery && matchLab && matchStatut;
    });
  }

  getPercentage(assigned: number, max: number): number {
    if (!max || max === 0) return 0;
    return Math.round((assigned / max) * 100);
  }
}
