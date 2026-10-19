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
  userName = 'Pr. Moussa Diop';
  userRole = 'Enseignant-Chercheur (UFR SAT)';
  userInitials = 'MD';

  candidatures: CandidatureItem[] = [
    {
      numericId: 1,
      id: 'CAND-01',
      nom: 'Mamadou Alpha Touré',
      email: 'toure.mamadou-alpha@ugb.edu.sn',
      sujet: "Conception d'une plateforme numérique de suivi des activités agricoles au Sénégal",
      date: '12/10/2026',
      statut: 'EN_ATTENTE',
      parcours: 'Master Génie Informatique (M2 GDIL)',
      motivation: "Passionné par le développement de plateformes web distribuées et l'optimisation agricole par le numérique.",
      moyenne: '16.5/20'
    },
    {
      numericId: 2,
      id: 'CAND-02',
      nom: 'Fatou Marie Ndiaye',
      email: 'ndiaye.fatou-marie@ugb.edu.sn',
      sujet: "Détection d'anomalies réseau et sécurisation des infrastructures informatiques universitaires",
      date: '12/10/2026',
      statut: 'ACCEPTEE',
      parcours: 'Master Génie Informatique (M2 GDIL)',
      motivation: "Je souhaite me spécialiser en cybersécurité et analyse proactive des flux de paquets réseau à l'UGB.",
      moyenne: '16.0/20'
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
    const user = this.authService.currentUser();
    if (user) {
      this.userName = user.prenom && user.nom ? `Pr. ${user.prenom} ${user.nom}` : user.nom || 'Pr. Moussa Diop';
      const parts = this.userName.replace(/^Pr\.\s*/, '').trim().split(' ');
      this.userInitials = parts.map(p => p.charAt(0)).join('').slice(0, 2).toUpperCase() || 'MD';
    }
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
