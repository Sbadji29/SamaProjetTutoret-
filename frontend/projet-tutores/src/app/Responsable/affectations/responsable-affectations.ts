import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { AffectationService } from '../../core/services/affectation.service';
import { SujetService } from '../../core/services/sujet.service';

interface AffectationEtudiantInfo {
  nom: string;
  date: string;
  voeu: string;
}

interface SujetAffectationItem {
  id: string;
  titre: string;
  encadrant: string;
  capacite: number;
  assignes: number;
  etudiants: AffectationEtudiantInfo[];
}

@Component({
  selector: 'app-responsable-affectations',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header, Sidebar, KpiCard],
  templateUrl: './responsable-affectations.html',
  styleUrl: './responsable-affectations.css'
})
export class ResponsableAffectations implements OnInit {
  searchTerm = '';
  selectedFilter = 'Tous les sujets';
  chargement = false;

  capaciteTotale = 0;
  etudiantsAssignes = 0;
  placesVacantes = 0;

  sujets: SujetAffectationItem[] = [];

  constructor(
    private affectationService: AffectationService,
    private sujetService: SujetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;

    forkJoin({
      sujets: this.sujetService.getTous().pipe(catchError(() => of([]))),
      affectations: this.affectationService.getToutes().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res) => {
        const apiSujets = res.sujets || [];
        const apiAffectations = res.affectations || [];

        this.capaciteTotale = apiSujets.reduce((acc, s) => acc + (s.capaciteMax || 0), 0);
        this.etudiantsAssignes = apiAffectations.length;
        this.placesVacantes = Math.max(0, this.capaciteTotale - this.etudiantsAssignes);

        this.sujets = apiSujets.map((s) => {
          const ensNom = s.enseignant ? `${s.enseignant.utilisateur?.prenom || ''} ${s.enseignant.utilisateur?.nom || ''}`.trim() : 'Enseignant';
          const assignsForSujet = apiAffectations.filter(a => a.sujet?.id === s.id);

          return {
            id: s.reference || `SUJ-${s.id}`,
            titre: s.titre,
            encadrant: ensNom,
            capacite: s.capaciteMax || 2,
            assignes: assignsForSujet.length,
            etudiants: assignsForSujet.map(a => ({
              nom: a.etudiant?.utilisateur ? `${a.etudiant.utilisateur.prenom} ${a.etudiant.utilisateur.nom}` : 'Étudiant',
              date: a.dateAffectation ? new Date(a.dateAffectation).toLocaleDateString('fr-FR') : 'Récent',
              voeu: a.candidature?.priorite ? `Vœu ${a.candidature.priorite}` : 'Vœu 1'
            }))
          };
        });

        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  get filteredSujets(): SujetAffectationItem[] {
    return this.sujets.filter(s => {
      const matchSearch = !this.searchTerm ||
        s.titre.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        s.encadrant.toLowerCase().includes(this.searchTerm.toLowerCase()) ||
        s.id.toLowerCase().includes(this.searchTerm.toLowerCase());
      return matchSearch;
    });
  }
}
