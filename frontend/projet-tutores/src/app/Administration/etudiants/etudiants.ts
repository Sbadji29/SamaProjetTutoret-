import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  totalInscrits: number = 142;
  affectationsValidees: number = 98;
  voeuxEnAttente: number = 36;
  sansCandidature: number = 8;

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

  constructor(
    private etudiantService: EtudiantService,
    private affectationService: AffectationService,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;
    this.etudiantService.obtenirTous().subscribe({
      next: (apiEtudiants) => {
        if (apiEtudiants && apiEtudiants.length > 0) {
          this.affectationService.getToutes().subscribe({
            next: (apiAffectations) => {
              this.candidatureService.getToutes().subscribe({
                next: (apiCandidatures) => {
                  this.chargement = false;
                  const affectesEtuIds = new Set((apiAffectations || []).map(a => a.etudiant?.id));

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
                      const etuCands = (apiCandidatures || []).filter(c => c.etudiant?.id === e.id);
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
                      parcours: e.filiere || 'M2 Informatique',
                      statut: statut,
                      statutLabel: statutLabel,
                      compteEntActif: e.utilisateur?.actif ?? true,
                    };
                  });

                  this.totalInscrits = this.etudiants.length;
                  this.affectationsValidees = this.etudiants.filter(e => e.statut === 'AFFECTE').length;
                  this.voeuxEnAttente = this.etudiants.filter(e => e.statut === 'ATTENTE').length;
                  this.sansCandidature = this.etudiants.filter(e => e.statut === 'AUCUN_VOEU').length;
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
    this.etudiantService.supprimer(id).subscribe({
      next: () => {
        this.etudiants = this.etudiants.filter(e => e.id !== id);
        this.totalInscrits = this.etudiants.length;
        this.affectationsValidees = this.etudiants.filter(e => e.statut === 'AFFECTE').length;
        this.voeuxEnAttente = this.etudiants.filter(e => e.statut === 'ATTENTE').length;
        this.sansCandidature = this.etudiants.filter(e => e.statut === 'AUCUN_VOEU').length;
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
