import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
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

  capaciteTotale = 35;
  etudiantsAssignes = 28;
  placesVacantes = 7;

  sujets: SujetAffectationItem[] = [
    {
      id: 'SUJ-2024-042',
      titre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      encadrant: 'Pr. Marc Bernard',
      capacite: 3,
      assignes: 2,
      etudiants: [
        { nom: 'Sarah Lemercier', date: '24/10/2024', voeu: 'Vœu 1' },
        { nom: 'Thomas Roux', date: '22/10/2024', voeu: 'Vœu 2' }
      ]
    },
    {
      id: 'SUJ-2024-048',
      titre: "Détection d'anomalies réseau via Transformer & eBPF",
      encadrant: 'Pr. Marc Bernard',
      capacite: 2,
      assignes: 2,
      etudiants: [
        { nom: 'Alexandre Dubois', date: '23/10/2024', voeu: 'Vœu 1' },
        { nom: 'Lina Benali', date: '21/10/2024', voeu: 'Vœu 1' }
      ]
    },
    {
      id: 'SUJ-2024-039',
      titre: 'Optimisation de requêtes SQL vectorielles sous DuckDB',
      encadrant: 'Dr. Claire Vasseur',
      capacite: 3,
      assignes: 3,
      etudiants: [
        { nom: 'Julien Faure', date: '19/10/2024', voeu: 'Vœu 1' },
        { nom: 'Maxime Bertrand', date: '18/10/2024', voeu: 'Vœu 2' },
        { nom: 'Chloé Martin', date: '17/10/2024', voeu: 'Vœu 1' }
      ]
    },
    {
      id: 'SUJ-2024-051',
      titre: 'Audit automatisé de conformité RGPD en architecture micro-services',
      encadrant: 'Dr. Stéphane Valérie',
      capacite: 2,
      assignes: 1,
      etudiants: [
        { nom: 'Lucas Moreau', date: '20/10/2024', voeu: 'Vœu 2' }
      ]
    }
  ];

  constructor(
    private affectationService: AffectationService,
    private sujetService: SujetService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;

    this.sujetService.getTous().subscribe({
      next: (apiSujets) => {
        if (apiSujets && apiSujets.length > 0) {
          this.capaciteTotale = apiSujets.reduce((acc, s) => acc + (s.capaciteMax || 0), 0);

          this.affectationService.getToutes().subscribe({
            next: (apiAffectations) => {
              this.chargement = false;
              if (apiAffectations) {
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
              }
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
