import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  totalEnseignants: number = 24;
  totalSujets: number = 38;
  tauxMobilisation: string = '76%';
  progressMobilisation: number = 76;
  enAttenteDepot: number = 4;
  capaciteCumulee: number = 92;
  totalAssignes: number = 68;

  laboratoires: string[] = [
    'Tous les laboratoires',
    'Labo LIRIS',
    'Labo CRAN',
    'Labo LORIA',
    'Labo IECL',
  ];

  statuts: string[] = [
    'Statut : Tous',
    'Complet',
    'Places disponibles',
    'Sans sujet déposé',
  ];

  enseignants: EnseignantItem[] = [
    {
      id: 1,
      initiales: 'MD',
      avatarClass: 'avatar-navy',
      nom: 'Pr. Moussa Diop',
      titre: 'Professeur Titulaire',
      email: 'moussa.diop@ugb.edu.sn',
      departement: 'Informatique - UFR SAT',
      laboratoire: "Laboratoire d'informatique",
      nbSujets: 2,
      nbPlaces: 5,
      etudiantsAssignes: 2,
      quotaMax: 6,
    },
    {
      id: 2,
      initiales: 'AS',
      avatarClass: 'avatar-blue',
      nom: 'Dr. Aminata Sow',
      titre: 'Maître de Conférences',
      email: 'aminata.sow@ugb.edu.sn',
      departement: 'Informatique - UFR SAT',
      laboratoire: 'Laboratoire LANI',
      nbSujets: 1,
      nbPlaces: 3,
      etudiantsAssignes: 1,
      quotaMax: 6,
    },
    {
      id: 3,
      initiales: 'OS',
      avatarClass: 'avatar-green',
      nom: 'Pr. Ousmane Sall',
      titre: 'Professeur des Universités',
      email: 'ousmane.sall@ugb.edu.sn',
      departement: 'Informatique - UFR SAT',
      laboratoire: 'Laboratoire LANI',
      nbSujets: 2,
      nbPlaces: 6,
      etudiantsAssignes: 4,
      quotaMax: 8,
    },
    {
      id: 4,
      initiales: 'KF',
      avatarClass: 'avatar-cyan',
      nom: 'Dr. Khady Fall',
      titre: 'Maître-Assistante',
      email: 'khady.fall@ugb.edu.sn',
      departement: 'Informatique - UFR SAT',
      laboratoire: "Laboratoire d'informatique",
      nbSujets: 1,
      nbPlaces: 3,
      etudiantsAssignes: 1,
      quotaMax: 4,
    }
  ];

  constructor(
    private enseignantService: EnseignantService,
    private sujetService: SujetService,
    private affectationService: AffectationService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;
    this.enseignantService.obtenirTous().subscribe({
      next: (apiEnseignants) => {
        if (apiEnseignants && apiEnseignants.length > 0) {
          this.sujetService.getTous().subscribe({
            next: (apiSujets) => {
              this.affectationService.getToutes().subscribe({
                next: (apiAffectations) => {
                  this.chargement = false;
                  const subjects = apiSujets || [];
                  const assigns = apiAffectations || [];

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
                      departement: ens.departement || 'Informatique',
                      laboratoire: ens.laboratoire || 'Laboratoire de Recherche',
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
                },
                error: () => {
                  this.chargement = false;
                }
              });
            },
            error: () => {
              this.chargement = false;
            }
          });
        } else {
          this.chargement = false;
        }
      },
      error: () => {
        this.chargement = false;
      }
    });
  }

  supprimer(id: number): void {
    this.enseignantService.supprimer(id).subscribe({
      next: () => {
        this.enseignants = this.enseignants.filter(e => e.id !== id);
        this.totalEnseignants = this.enseignants.length;
        this.enAttenteDepot = this.enseignants.filter(e => e.nbSujets === 0).length;
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
