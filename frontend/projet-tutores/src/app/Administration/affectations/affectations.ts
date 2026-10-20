import { CommonModule } from '@angular/common';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { AffectationItem } from './affectations.model';
import { AffectationService } from '../../core/services/affectation.service';
import { SujetService } from '../../core/services/sujet.service';
import { EtudiantService } from '../../core/services/etudiant.service';

@Component({
  selector: 'app-affectations',
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header, KpiCard],
  templateUrl: './affectations.html',
  styleUrl: './affectations.css',
})
export class Affectations implements OnInit {
  searchQuery: string = '';
  selectedLab: string = 'Tous les laboratoires';
  selectedStatut: string = 'Tous les statuts';
  chargement: boolean = false;

  totalInscrits: number = 0;
  affectesFermes: number = 0;
  sansAffectation: number = 0;
  sujetsPourvus: string = '0 / 0';
  tauxPourvus: number = 0;
  tauxSujets: number = 0;

  laboratoires: string[] = [
    'Tous les laboratoires',
    'Laboratoire LANI',
    "Laboratoire d'Informatique",
  ];

  statuts: string[] = [
    'Tous les statuts',
    'Validé ferme',
    'En attente d\'arbitrage',
    'Sujet Vacant',
  ];

  affectations: AffectationItem[] = [];

  constructor(
    private affectationService: AffectationService,
    private sujetService: SujetService,
    private etudiantService: EtudiantService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;

    forkJoin({
      affectations: this.affectationService.getToutes().pipe(catchError(() => of([]))),
      sujets: this.sujetService.getTous().pipe(catchError(() => of([]))),
      etudiants: this.etudiantService.obtenirTous().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res) => {
        const assigns = res.affectations || [];
        const subjects = res.sujets || [];
        const students = res.etudiants || [];

        const avatarColors = ['avatar-green', 'avatar-dark', 'avatar-yellow', 'avatar-blue'];

        const affItems: AffectationItem[] = assigns.map((a, index) => {
          const prenom = a.etudiant?.utilisateur?.prenom || '';
          const nom = a.etudiant?.utilisateur?.nom || '';
          const initials = `${prenom.charAt(0)}${nom.charAt(0)}`.toUpperCase() || 'ET';
          const ensNom = a.sujet?.enseignant ? `${a.sujet.enseignant.utilisateur?.prenom || ''} ${a.sujet.enseignant.utilisateur?.nom || ''}`.trim() : 'Enseignant';
          const labo = a.sujet?.enseignant?.laboratoire || a.sujet?.enseignant?.departement || 'Laboratoire LANI';
          const capTotal = a.sujet?.capaciteMax || 2;
          const capPrise = assigns.filter(other => other.sujet?.id === a.sujet?.id).length;

          return {
            id: a.id || index + 1,
            etudiantNom: `${prenom} ${nom}`.trim() || 'Étudiant',
            etudiantInitiales: initials,
            avatarClass: avatarColors[index % avatarColors.length],
            sujetTitre: a.sujet?.titre || 'Sujet de projet',
            enseignantNom: ensNom,
            laboratoire: labo,
            statut: 'VALIDE',
            statutLabel: 'Validé ferme',
            capacitePrise: capPrise,
            capaciteTotal: capTotal,
            placesRestantes: Math.max(0, capTotal - capPrise),
          };
        });

        const assignedSubjectIds = new Set(assigns.map(a => a.sujet?.id));
        const vacantSubjects = subjects.filter(s => !assignedSubjectIds.has(s.id));

        vacantSubjects.forEach((vs, idx) => {
          const ensNom = vs.enseignant ? `${vs.enseignant.utilisateur?.prenom || ''} ${vs.enseignant.utilisateur?.nom || ''}`.trim() : 'Enseignant';
          affItems.push({
            id: 1000 + (vs.id || idx),
            etudiantNom: 'Non affecté',
            estNonAffecte: true,
            sujetTitre: vs.titre,
            enseignantNom: ensNom,
            laboratoire: vs.enseignant?.laboratoire || vs.enseignant?.departement || 'Laboratoire Universitaire',
            statut: 'VACANT',
            statutLabel: 'Sujet Vacant',
            capacitePrise: 0,
            capaciteTotal: vs.capaciteMax || 2,
            placesRestantes: vs.capaciteMax || 2,
          });
        });

        this.affectations = affItems;

        if (students.length > 0) {
          this.totalInscrits = students.length;
        }
        this.affectesFermes = assigns.length;
        this.sansAffectation = Math.max(0, this.totalInscrits - this.affectesFermes);
        if (this.totalInscrits > 0) {
          this.tauxPourvus = Math.min(100, Math.round((this.affectesFermes / this.totalInscrits) * 100));
        }

        if (subjects.length > 0) {
          const assignedSubjectCount = new Set(assigns.map(a => a.sujet?.id)).size;
          this.sujetsPourvus = `${assignedSubjectCount} / ${subjects.length}`;
          this.tauxSujets = Math.min(100, Math.round((assignedSubjectCount / subjects.length) * 100));
        }

        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredAffectations(): AffectationItem[] {
    return this.affectations.filter((item) => {
      const q = this.searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        item.etudiantNom.toLowerCase().includes(q) ||
        item.sujetTitre.toLowerCase().includes(q) ||
        item.enseignantNom.toLowerCase().includes(q);

      const matchLab =
        this.selectedLab === 'Tous les laboratoires' ||
        item.laboratoire.includes(this.selectedLab);

      let matchStatut = true;
      if (this.selectedStatut === 'Validé ferme') {
        matchStatut = item.statut === 'VALIDE';
      } else if (this.selectedStatut === "En attente d'arbitrage") {
        matchStatut = item.statut === 'ARBITRAGE';
      } else if (this.selectedStatut === 'Sujet Vacant') {
        matchStatut = item.statut === 'VACANT';
      }

      return matchQuery && matchLab && matchStatut;
    });
  }
}
