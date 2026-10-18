import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../header/header';
import { Sidebar } from '../../sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { EnseignantItem } from './enseignants.model';

@Component({
  selector: 'app-enseignants',
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header, KpiCard],
  templateUrl: './enseignants.html',
  styleUrl: './enseignants.css',
})
export class Enseignants {
  searchQuery: string = '';
  selectedLab: string = 'Tous les laboratoires';
  selectedStatut: string = 'Statut : Tous';

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
      initiales: 'MB',
      avatarClass: 'avatar-navy',
      nom: 'Pr. Marc Bernard',
      titre: 'Professeur des Universités',
      email: 'marc.bernard@univ-lorraine.fr',
      departement: 'Informatique & Réseaux',
      laboratoire: 'Labo LIRIS - Équipe Cloud & Systèmes',
      nbSujets: 3,
      nbPlaces: 8,
      etudiantsAssignes: 8,
      quotaMax: 10,
    },
    {
      id: 2,
      initiales: 'SM',
      avatarClass: 'avatar-blue',
      nom: 'Dr. Sophie Mercier',
      titre: 'Maître de Conférences',
      email: 'sophie.mercier@univ-lorraine.fr',
      departement: 'Intelligence Artificielle',
      laboratoire: 'Labo CRAN - Équipe Vision & Santé',
      nbSujets: 2,
      nbPlaces: 5,
      etudiantsAssignes: 5,
      quotaMax: 6,
    },
    {
      id: 3,
      initiales: 'AF',
      avatarClass: 'avatar-green',
      nom: 'Dr. Alexandre Fontaine',
      titre: 'Enseignant-Chercheur',
      email: 'alexandre.fontaine@univ-lorraine.fr',
      departement: 'Cybersécurité',
      laboratoire: 'Labo LORIA - Équipe Cryptologie',
      nbSujets: 4,
      nbPlaces: 10,
      etudiantsAssignes: 10,
      quotaMax: 10,
    },
    {
      id: 4,
      initiales: 'HR',
      avatarClass: 'avatar-cyan',
      nom: 'Dr. Hélène Roche',
      titre: 'Maître de Conférences',
      email: 'helene.roche@univ-lorraine.fr',
      departement: 'Data Science & Statistique',
      laboratoire: 'Labo IECL - Équipe Probabilités',
      nbSujets: 1,
      nbPlaces: 3,
      etudiantsAssignes: 2,
      quotaMax: 6,
    },
    {
      id: 5,
      initiales: 'AD',
      avatarClass: 'avatar-dark',
      nom: 'Pr. Antoine Duval',
      titre: 'Professeur des Universités',
      email: 'antoine.duval@univ-lorraine.fr',
      departement: 'Génie Logiciel & IHM',
      laboratoire: 'Labo LIRIS - Ingénierie des Modèles',
      nbSujets: 0,
      nbPlaces: 0,
      etudiantsAssignes: 0,
      quotaMax: 8,
    },
  ];

  get filteredEnseignants(): EnseignantItem[] {
    return this.enseignants.filter((ens) => {
      // Filtre texte
      const q = this.searchQuery.toLowerCase().trim();
      const matchQuery =
        !q ||
        ens.nom.toLowerCase().includes(q) ||
        ens.email.toLowerCase().includes(q) ||
        ens.departement.toLowerCase().includes(q) ||
        ens.laboratoire.toLowerCase().includes(q);

      // Filtre laboratoire
      const matchLab =
        this.selectedLab === 'Tous les laboratoires' ||
        ens.laboratoire.includes(this.selectedLab);

      // Filtre statut
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
