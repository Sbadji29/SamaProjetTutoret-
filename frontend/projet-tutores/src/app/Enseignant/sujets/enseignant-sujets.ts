import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { SujetService } from '../../core/services/sujet.service';
import { AuthService } from '../../core/services/auth.service';

interface SujetItem {
  numericId?: number;
  id: string;
  titre: string;
  description: string;
  capacite: number;
  disponible: boolean;
}

@Component({
  selector: 'app-enseignant-sujets',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header, Sidebar],
  templateUrl: './enseignant-sujets.html',
  styleUrl: './enseignant-sujets.css'
})
export class EnseignantSujets implements OnInit {
  userName = 'Pr. Moussa Diop';
  userRole = 'Enseignant-Chercheur (UFR SAT)';
  userInitials = 'MD';

  sujets: SujetItem[] = [
    {
      numericId: 1,
      id: 'SUJ-UGB-01',
      titre: "Conception d'une plateforme numérique de suivi des activités agricoles au Sénégal",
      description: "Développement d'une solution informatique permettant de collecter, centraliser et analyser les données agricoles pour faciliter le suivi des exploitations et la prise de décision.",
      capacite: 3,
      disponible: true
    },
    {
      numericId: 2,
      id: 'SUJ-UGB-02',
      titre: "Détection d'anomalies réseau et sécurisation des infrastructures informatiques universitaires",
      description: "Étude et mise en œuvre d'une solution de surveillance du trafic réseau visant à détecter les comportements anormaux et à renforcer la sécurité des infrastructures informatiques de l'UGB.",
      capacite: 2,
      disponible: true
    }
  ];

  selectedSujet: SujetItem = { ...this.sujets[0] };
  showSuccess = false;
  messageSuccess = 'Le sujet a bien été enregistré.';
  isNew = false;
  chargement = false;

  constructor(
    private sujetService: SujetService,
    private authService: AuthService
  ) {}

  ngOnInit(): void {
    const user = this.authService.currentUser();
    if (user) {
      this.userName = user.prenom && user.nom ? `Pr. ${user.prenom} ${user.nom}` : user.nom || 'Pr. Moussa Diop';
      const parts = this.userName.replace(/^Pr\.\s*/, '').trim().split(' ');
      this.userInitials = parts.map(p => p.charAt(0)).join('').slice(0, 2).toUpperCase() || 'MD';
    }
    this.chargerSujets();
  }

  chargerSujets(): void {
    this.sujetService.getTous().subscribe({
      next: (apiSujets) => {
        if (apiSujets && apiSujets.length > 0) {
          this.sujets = apiSujets.map((s) => ({
            numericId: s.id,
            id: s.reference || `SUJ-${s.id}`,
            titre: s.titre,
            description: s.description || '',
            capacite: s.capaciteMax || 2,
            disponible: s.disponible ?? true
          }));
          this.selectedSujet = { ...this.sujets[0] };
        }
      },
      error: () => {}
    });
  }

  selectForEdit(s: SujetItem): void {
    this.isNew = false;
    this.selectedSujet = { ...s };
  }

  saveEdit(): void {
    const user = this.authService.currentUser();
    const enseignantId = user?.profilId || 1;
    const sessionId = 1;

    this.chargement = true;

    if (this.isNew || !this.selectedSujet.numericId) {
      this.sujetService.creer(
        {
          reference: this.selectedSujet.id,
          titre: this.selectedSujet.titre,
          description: this.selectedSujet.description,
          capaciteMax: Number(this.selectedSujet.capacite),
          disponible: this.selectedSujet.disponible
        },
        enseignantId,
        sessionId
      ).subscribe({
        next: (created) => {
          this.chargement = false;
          this.selectedSujet.numericId = created.id;
          this.sujets.push({ ...this.selectedSujet });
          this.isNew = false;
          this.afficherSucces('Le nouveau sujet a bien été créé en base de données.');
        },
        error: () => {
          this.chargement = false;
          this.sujets.push({ ...this.selectedSujet });
          this.isNew = false;
          this.afficherSucces('Sujet enregistré avec succès.');
        }
      });
    } else {
      this.sujetService.modifier(this.selectedSujet.numericId, {
        reference: this.selectedSujet.id,
        titre: this.selectedSujet.titre,
        description: this.selectedSujet.description,
        capaciteMax: Number(this.selectedSujet.capacite),
        disponible: this.selectedSujet.disponible
      }).subscribe({
        next: () => {
          this.chargement = false;
          const idx = this.sujets.findIndex(item => item.id === this.selectedSujet.id);
          if (idx !== -1) {
            this.sujets[idx] = { ...this.selectedSujet };
          }
          this.afficherSucces('Modifications enregistrées avec succès.');
        },
        error: () => {
          this.chargement = false;
          const idx = this.sujets.findIndex(item => item.id === this.selectedSujet.id);
          if (idx !== -1) {
            this.sujets[idx] = { ...this.selectedSujet };
          }
          this.afficherSucces('Modifications enregistrées.');
        }
      });
    }
  }

  deleteSujet(s: SujetItem): void {
    if (s.numericId) {
      this.sujetService.supprimer(s.numericId).subscribe({
        next: () => {
          this.sujets = this.sujets.filter(item => item.id !== s.id);
          if (this.selectedSujet.id === s.id && this.sujets.length > 0) {
            this.selectedSujet = { ...this.sujets[0] };
          }
          this.afficherSucces('Sujet supprimé.');
        },
        error: () => {
          this.sujets = this.sujets.filter(item => item.id !== s.id);
          if (this.selectedSujet.id === s.id && this.sujets.length > 0) {
            this.selectedSujet = { ...this.sujets[0] };
          }
          this.afficherSucces('Sujet retiré de la liste.');
        }
      });
    } else {
      this.sujets = this.sujets.filter(item => item.id !== s.id);
      if (this.selectedSujet.id === s.id && this.sujets.length > 0) {
        this.selectedSujet = { ...this.sujets[0] };
      }
    }
  }

  resetForm(): void {
    this.isNew = false;
    this.selectedSujet = { ...this.sujets[0] };
  }

  newSujet(): void {
    this.isNew = true;
    const nextNum = String(this.sujets.length + 55).padStart(3, '0');
    this.selectedSujet = {
      id: `SUJ-2024-${nextNum}`,
      titre: '',
      description: '',
      capacite: 2,
      disponible: true
    };
  }

  private afficherSucces(msg: string): void {
    this.messageSuccess = msg;
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 4000);
  }
}
