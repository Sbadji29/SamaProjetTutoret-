import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { CandidatureService } from '../../core/services/candidature.service';
import { AuthService } from '../../core/services/auth.service';

export interface CandidatureItem {
  numericId?: number;
  id: string;
  nom: string;
  email: string;
  sujet: string;
  date: string;
  statut: 'EN_ATTENTE' | 'ACCEPTEE' | 'REJETEE';
  parcours: string;
  motivation: string;
  moyenne: string;
}

@Component({
  selector: 'app-enseignant-candidatures',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header, Sidebar],
  templateUrl: './enseignant-candidatures.html',
  styleUrl: './enseignant-candidatures.css'
})
export class EnseignantCandidatures implements OnInit {
  candidatures: CandidatureItem[] = [
    {
      numericId: 1,
      id: 'CAND-01',
      nom: 'Sarah Lemercier',
      email: 'sarah.lemercier@etu.univ.fr',
      sujet: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      date: '12/10/2024',
      statut: 'EN_ATTENTE',
      parcours: 'Master 2 Génie Logiciel',
      motivation: "Passionnée par les architectures de conteneurs et la cybersécurité en milieu hospitalier, j'ai déjà réalisé un stage sur Docker et Ansible.",
      moyenne: '16.4/20'
    },
    {
      numericId: 2,
      id: 'CAND-02',
      nom: 'Alexandre Dubois',
      email: 'alexandre.dubois@etu.univ.fr',
      sujet: 'Cloud Native Service Mesh avec Istio',
      date: '12/10/2024',
      statut: 'ACCEPTEE',
      parcours: 'Master 2 Systèmes & Réseaux',
      motivation: "Je souhaite approfondir les problématiques d'observabilité réseau et de proxy sidecar envoy.",
      moyenne: '15.8/20'
    },
    {
      numericId: 3,
      id: 'CAND-03',
      nom: 'Thomas Roux',
      email: 'thomas.roux@etu.univ.fr',
      sujet: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      date: '11/10/2024',
      statut: 'EN_ATTENTE',
      parcours: 'Master 2 Sécurité & Systèmes',
      motivation: "Spécialisé en durcissement de systèmes et cryptographie appliquée, ce sujet correspond exactement à mes aspirations de fin d'études.",
      moyenne: '15.1/20'
    },
    {
      numericId: 4,
      id: 'CAND-04',
      nom: 'Julien Faure',
      email: 'julien.faure@etu.univ.fr',
      sujet: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      date: '09/10/2024',
      statut: 'REJETEE',
      parcours: 'Master 2 Données & IA',
      motivation: "Intéressé par le traitement de signaux médicaux.",
      moyenne: '12.8/20'
    },
    {
      numericId: 5,
      id: 'CAND-05',
      nom: 'Lina Benali',
      email: 'lina.benali@etu.univ.fr',
      sujet: 'Cloud Native Service Mesh avec Istio',
      date: '08/10/2024',
      statut: 'ACCEPTEE',
      parcours: 'Master 2 Génie Logiciel',
      motivation: "Forte expérience en Java/Go et participation à des projets open-source Kubernetes.",
      moyenne: '17.2/20'
    },
    {
      numericId: 6,
      id: 'CAND-06',
      nom: 'Lucas Moreau',
      email: 'lucas.moreau@etu.univ.fr',
      sujet: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      date: '07/10/2024',
      statut: 'EN_ATTENTE',
      parcours: 'Master 2 Génie Logiciel',
      motivation: "Projet de stage axé sur les architectures distribuées et la haute disponibilité.",
      moyenne: '14.9/20'
    }
  ];

  selectedFilter: 'TOUTES' | 'EN_ATTENTE' | 'ACCEPTEE' | 'REJETEE' = 'TOUTES';
  searchTerm = '';
  selectedCandidature: CandidatureItem | null = null;
  chargement = false;

  constructor(
    private candidatureService: CandidatureService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerCandidatures();
  }

  chargerCandidatures(): void {
    this.chargement = true;
    this.candidatureService.getToutes().subscribe({
      next: (apiList) => {
        this.chargement = false;
        if (apiList && apiList.length > 0) {
          this.candidatures = apiList.map((c, index) => {
            const nomEtu = c.etudiant?.utilisateur ? `${c.etudiant.utilisateur.prenom} ${c.etudiant.utilisateur.nom}` : 'Étudiant';
            const emailEtu = c.etudiant?.utilisateur?.email || 'etudiant@etu.univ.fr';
            const dateStr = c.dateCandidature ? new Date(c.dateCandidature).toLocaleDateString('fr-FR') : 'Récent';

            return {
              numericId: c.id,
              id: `CAND-${String(index + 1).padStart(2, '0')}`,
              nom: nomEtu,
              email: emailEtu,
              sujet: c.sujet?.titre || 'Sujet proposé',
              date: dateStr,
              statut: c.statut || 'EN_ATTENTE',
              parcours: c.etudiant ? `${c.etudiant.filiere} (${c.etudiant.niveau})` : 'Master 2',
              motivation: c.motivation || 'Candidature déposée sur le portail académique.',
              moyenne: '15.5/20'
            };
          });
        }
      },
      error: () => {
        this.chargement = false;
      }
    });
  }

  get countToutes(): number {
    return this.candidatures.length;
  }

  get countEnAttente(): number {
    return this.candidatures.filter(c => c.statut === 'EN_ATTENTE').length;
  }

  get countAcceptees(): number {
    return this.candidatures.filter(c => c.statut === 'ACCEPTEE').length;
  }

  get countRejetees(): number {
    return this.candidatures.filter(c => c.statut === 'REJETEE').length;
  }

  get filteredCandidatures(): CandidatureItem[] {
    return this.candidatures.filter(c => {
      const matchFilter = this.selectedFilter === 'TOUTES' ? true : c.statut === this.selectedFilter;
      const term = this.searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        c.nom.toLowerCase().includes(term) ||
        c.email.toLowerCase().includes(term) ||
        c.sujet.toLowerCase().includes(term);
      return matchFilter && matchSearch;
    });
  }

  setFilter(f: 'TOUTES' | 'EN_ATTENTE' | 'ACCEPTEE' | 'REJETEE'): void {
    this.selectedFilter = f;
  }

  openDossier(c: CandidatureItem): void {
    this.selectedCandidature = c;
  }

  closeDossier(): void {
    this.selectedCandidature = null;
  }

  updateStatut(newStatut: 'ACCEPTEE' | 'REJETEE'): void {
    if (!this.selectedCandidature) {
      return;
    }

    const item = this.selectedCandidature;
    item.statut = newStatut;

    if (item.numericId) {
      this.candidatureService.changerStatut(item.numericId, newStatut).subscribe({
        next: () => {
          this.closeDossier();
        },
        error: () => {
          this.closeDossier();
        }
      });
    } else {
      const idx = this.candidatures.findIndex(c => c.id === item.id);
      if (idx !== -1) {
        this.candidatures[idx].statut = newStatut;
      }
      this.closeDossier();
    }
  }
}
