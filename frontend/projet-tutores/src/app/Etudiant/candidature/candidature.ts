import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';
import { CandidatureItem, StatutCandidature } from './candidature.model';
import { CandidatureService } from '../../core/services/candidature.service';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-candidature',
  standalone: true,
  imports: [CommonModule, Sidebar, Header],
  templateUrl: './candidature.html',
  styleUrl: './candidature.css',
})
export class Candidature implements OnInit {
  activeTab: 'TOUTES' | StatutCandidature = 'TOUTES';
  chargement = false;

  candidatures: CandidatureItem[] = [
    {
      id: 1,
      titre: "Conception d'une plateforme numérique de suivi des activités agricoles au Sénégal",
      verifie: true,
      technologies: ['AgriTech', 'Cloud', 'PostgreSQL'],
      initiales: 'MD',
      initialesClass: 'avatar-green',
      enseignant: 'Pr. Moussa Diop',
      grade: 'Professeur Titulaire (UFR SAT)',
      date: '14/10/2026',
      heure: '10:45',
      statut: 'EN_ATTENTE',
    },
    {
      id: 2,
      titre: "Détection d'anomalies réseau et sécurisation des infrastructures informatiques universitaires",
      verifie: true,
      technologies: ['Sécurité', 'Réseau', 'eBPF'],
      initiales: 'MD',
      initialesClass: 'avatar-green',
      enseignant: 'Pr. Moussa Diop',
      grade: 'Professeur Titulaire (UFR SAT)',
      date: '12/10/2026',
      heure: '16:30',
      statut: 'ACCEPTEE',
    }
  ];

  constructor(
    private candidatureService: CandidatureService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    this.chargerCandidatures();
  }

  chargerCandidatures(): void {
    const user = this.authService.currentUser();
    const etudiantId = user?.profilId || 1;

    this.chargement = true;
    this.candidatureService.getParEtudiant(etudiantId).subscribe({
      next: (apiCandidatures) => {
        this.chargement = false;
        if (apiCandidatures && apiCandidatures.length > 0) {
          this.candidatures = apiCandidatures.map((c) => {
            const dateStr = c.dateCandidature ? new Date(c.dateCandidature).toLocaleDateString('fr-FR') : 'Récent';
            const heureStr = c.dateCandidature ? new Date(c.dateCandidature).toLocaleTimeString('fr-FR', { hour: '2-digit', minute: '2-digit' }) : '';
            const ensNom = c.sujet?.enseignant ? `${c.sujet.enseignant.utilisateur?.prenom || ''} ${c.sujet.enseignant.utilisateur?.nom || ''}`.trim() : 'Enseignant';

            return {
              id: c.id || 0,
              titre: c.sujet?.titre || 'Sujet de projet tutoré',
              verifie: true,
              technologies: [c.sujet?.niveau || 'Master 2', `Vœu n°${c.priorite}`],
              initiales: ensNom.split(' ').map(p => p.charAt(0)).join('').slice(0, 2).toUpperCase() || 'EN',
              initialesClass: 'avatar-green',
              enseignant: ensNom,
              grade: c.sujet?.enseignant?.departement || 'Département Informatique',
              date: dateStr,
              heure: heureStr,
              statut: c.statut || 'EN_ATTENTE',
            };
          });
        }
      },
      error: () => {
        this.chargement = false;
      }
    });
  }

  get countTotal(): number {
    return this.candidatures.length;
  }

  get countEnAttente(): number {
    return this.candidatures.filter((c) => c.statut === 'EN_ATTENTE').length;
  }

  get countAcceptees(): number {
    return this.candidatures.filter((c) => c.statut === 'ACCEPTEE').length;
  }

  get countRejetees(): number {
    return this.candidatures.filter((c) => c.statut === 'REJETEE').length;
  }

  get filteredCandidatures(): CandidatureItem[] {
    if (this.activeTab === 'TOUTES') {
      return this.candidatures;
    }
    return this.candidatures.filter((c) => c.statut === this.activeTab);
  }

  setTab(tab: 'TOUTES' | StatutCandidature): void {
    this.activeTab = tab;
  }
}
