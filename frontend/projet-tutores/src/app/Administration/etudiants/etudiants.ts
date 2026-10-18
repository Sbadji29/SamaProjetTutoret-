import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../header/header';
import { Sidebar } from '../../sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { EtudiantItem } from './etudiants.model';

@Component({
  selector: 'app-etudiants',
  imports: [CommonModule, FormsModule, RouterModule, Sidebar, Header, KpiCard],
  templateUrl: './etudiants.html',
  styleUrl: './etudiants.css',
})
export class Etudiants {
  searchQuery: string = '';
  selectedParcours: string = 'Tous les parcours';
  selectedStatut: string = 'Tous les statuts';

  parcoursList: string[] = [
    'Tous les parcours',
    'M2 Génie Logiciel',
    'M2 Réseaux & Systèmes',
    'M2 Intelligence Artificielle',
  ];

  statutsList: string[] = [
    'Tous les statuts',
    'Affecté',
    'En attente',
    'Aucun vœu',
  ];

  etudiants: EtudiantItem[] = [
    {
      id: 1,
      initiales: 'SL',
      avatarClass: 'avatar-green',
      nom: 'Sarah Lemercier',
      numeroEtudiant: '22104981',
      email: 'sarah.lemercier@etu.univ-lorraine.fr',
      parcours: 'M2 Génie Logiciel',
      statut: 'AFFECTE',
      statutLabel: 'AFFECTÉE',
      compteEntActif: true,
    },
    {
      id: 2,
      initiales: 'AD',
      avatarClass: 'avatar-blue',
      nom: 'Alexandre Dubois',
      numeroEtudiant: '22105122',
      email: 'alexandre.dubois@etu.univ-lorraine.fr',
      parcours: 'M2 Réseaux & Systèmes',
      statut: 'ATTENTE',
      statutLabel: '2 VŒUX EN ATTENTE',
      compteEntActif: true,
    },
    {
      id: 3,
      initiales: 'CL',
      avatarClass: 'avatar-green-bright',
      nom: 'Camille Laurent',
      numeroEtudiant: '22108840',
      email: 'camille.laurent@etu.univ-lorraine.fr',
      parcours: 'M2 Intelligence Artificielle',
      statut: 'AFFECTE',
      statutLabel: 'AFFECTÉE',
      compteEntActif: true,
    },
    {
      id: 4,
      initiales: 'TR',
      avatarClass: 'avatar-gray',
      nom: 'Thomas Roux',
      numeroEtudiant: '22106319',
      email: 'thomas.roux@etu.univ-lorraine.fr',
      parcours: 'M2 Génie Logiciel',
      statut: 'AUCUN_VOEU',
      statutLabel: 'AUCUN VŒU',
      compteEntActif: true,
    },
    {
      id: 5,
      initiales: 'LB',
      avatarClass: 'avatar-blue',
      nom: 'Lina Benali',
      numeroEtudiant: '22107752',
      email: 'lina.benali@etu.univ-lorraine.fr',
      parcours: 'M2 Intelligence Artificielle',
      statut: 'AFFECTE',
      statutLabel: 'AFFECTÉE',
      compteEntActif: true,
    },
    {
      id: 6,
      initiales: 'LM',
      avatarClass: 'avatar-navy',
      nom: 'Lucas Moreau',
      numeroEtudiant: '22103401',
      email: 'lucas.moreau@etu.univ-lorraine.fr',
      parcours: 'M2 Réseaux & Systèmes',
      statut: 'ATTENTE',
      statutLabel: '1 VŒU EN ATTENTE',
      compteEntActif: true,
    },
    {
      id: 7,
      initiales: 'JF',
      avatarClass: 'avatar-blue',
      nom: 'Julien Faure',
      numeroEtudiant: '22101908',
      email: 'julien.faure@etu.univ-lorraine.fr',
      parcours: 'M2 Génie Logiciel',
      statut: 'AFFECTE',
      statutLabel: 'AFFECTÉ',
      compteEntActif: true,
    },
  ];

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
