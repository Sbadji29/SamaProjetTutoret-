import { CommonModule } from '@angular/common';
import { Component } from '@angular/core';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { Header } from '../../shared/header/header';
import { CandidatureItem, StatutCandidature } from './candidature.model';

@Component({
  selector: 'app-candidature',
  imports: [CommonModule, Sidebar, Header],
  templateUrl: './candidature.html',
  styleUrl: './candidature.css',
})
export class Candidature {
  activeTab: 'TOUTES' | StatutCandidature = 'TOUTES';

  candidatures: CandidatureItem[] = [
    {
      id: 1,
      titre: 'Système de recommandation basé sur LLM pour archives ouvertes',
      verifie: false,
      technologies: ['Python', 'LangChain', 'FastAPI'],
      initiales: 'SM',
      initialesClass: 'avatar-green',
      enseignant: 'Dr. Sophie Mercier',
      grade: 'Maître de Conférences',
      date: '14/10/2024',
      heure: '10:45',
      statut: 'EN_ATTENTE',
    },
    {
      id: 2,
      titre: "Conception d'une plateforme de télé-médecine sécurisée",
      verifie: true,
      technologies: ['Angular', 'Node.js', 'WebRTC'],
      initiales: 'MB',
      initialesClass: 'avatar-green',
      enseignant: 'Pr. Marc Bernard',
      grade: 'Professeur des Universités',
      date: '12/10/2024',
      heure: '16:30',
      statut: 'ACCEPTEE',
    },
    {
      id: 3,
      titre: 'Audit automatisé de sécurité et conformité CI/CD',
      verifie: false,
      technologies: ['Docker', 'GitLab CI', 'Trivy'],
      initiales: 'HR',
      initialesClass: 'avatar-blue',
      enseignant: 'Dr. Hélène Roche',
      grade: 'Maître de Conférences',
      date: '08/10/2024',
      heure: '09:15',
      statut: 'REJETEE',
    },
  ];

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
