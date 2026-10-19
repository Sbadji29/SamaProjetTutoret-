import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { KpiCard } from '../../shared/kpi-card/kpi-card';
import { CandidatureService } from '../../core/services/candidature.service';
import { AffectationService } from '../../core/services/affectation.service';

interface CandidaturePrioritaireItem {
  id?: number;
  initials: string;
  nom: string;
  parcours: string;
  projet: string;
  voeu: string;
  avisType: 'favorable' | 'reserve';
  avisTexte: string;
  avisEncadrant: string;
  statut: string;
}

@Component({
  selector: 'app-responsable-dashboard',
  standalone: true,
  imports: [CommonModule, RouterModule, Header, Sidebar, KpiCard],
  templateUrl: './responsable-dashboard.html',
  styleUrl: './responsable-dashboard.css'
})
export class ResponsableDashboard implements OnInit {
  totalCandidatures = 42;
  enAttenteCount = 5;
  affectationsCount = 28;
  rejeteesCount = 9;
  chargement = false;

  candidaturesPrioritaires: CandidaturePrioritaireItem[] = [
    {
      id: 1,
      initials: 'MT',
      nom: 'Mamadou Alpha Touré',
      parcours: 'Master Génie Informatique (M2 GDIL)',
      projet: "Plateforme numérique de suivi agricole",
      voeu: 'Vœu n°1',
      avisType: 'favorable',
      avisTexte: 'Favorable',
      avisEncadrant: 'Pr. M. Diop',
      statut: 'EN_ATTENTE'
    },
    {
      id: 2,
      initials: 'FN',
      nom: 'Fatou Marie Ndiaye',
      parcours: 'Master Génie Informatique (M2 GDIL)',
      projet: "Détection d'anomalies réseau UGB",
      voeu: 'Vœu n°1',
      avisType: 'favorable',
      avisTexte: 'Favorable',
      avisEncadrant: 'Pr. M. Diop',
      statut: 'EN_ATTENTE'
    }
  ];

  constructor(
    private candidatureService: CandidatureService,
    private affectationService: AffectationService
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;

    this.candidatureService.getToutes().subscribe({
      next: (apiList) => {
        if (apiList && apiList.length > 0) {
          this.totalCandidatures = apiList.length;
          const pending = apiList.filter(c => c.statut === 'EN_ATTENTE');
          this.enAttenteCount = pending.length;
          this.rejeteesCount = apiList.filter(c => c.statut === 'REJETEE').length;

          if (pending.length > 0) {
            this.candidaturesPrioritaires = pending.slice(0, 5).map(c => {
              const nomEtu = c.etudiant?.utilisateur ? `${c.etudiant.utilisateur.prenom} ${c.etudiant.utilisateur.nom}` : 'Étudiant';
              const initials = nomEtu.split(' ').map(p => p.charAt(0)).join('').slice(0, 2).toUpperCase() || 'ET';
              const ensNom = c.sujet?.enseignant ? `${c.sujet.enseignant.utilisateur?.prenom || ''} ${c.sujet.enseignant.utilisateur?.nom || ''}`.trim() : 'Enseignant';

              return {
                id: c.id,
                initials: initials,
                nom: nomEtu,
                parcours: c.etudiant ? `${c.etudiant.filiere} (${c.etudiant.niveau})` : 'M2 Informatique',
                projet: c.sujet?.titre || 'Sujet proposé',
                voeu: `Vœu n°${c.priorite}`,
                avisType: c.priorite === 1 ? 'favorable' : 'reserve',
                avisTexte: c.priorite === 1 ? 'Favorable' : 'À arbitrer',
                avisEncadrant: ensNom,
                statut: c.statut || 'EN_ATTENTE'
              };
            });
          }
        }
        this.chargement = false;
      },
      error: () => {
        this.chargement = false;
      }
    });

    this.affectationService.getToutes().subscribe({
      next: (affList) => {
        if (affList) {
          this.affectationsCount = affList.length;
        }
      },
      error: () => {}
    });
  }
}
