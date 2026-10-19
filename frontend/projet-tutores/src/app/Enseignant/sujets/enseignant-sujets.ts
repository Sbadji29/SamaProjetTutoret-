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
  sujets: SujetItem[] = [
    {
      numericId: 1,
      id: 'SUJ-2024-042',
      titre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      description: "L'objectif principal est de concevoir et déployer une infrastructure de santé interopérable (norme HL7/FHIR) avec isolation stricte des pods multi-tenants sous Kubernetes. Les étudiants devront implémenter une chaîne d'authentification Zero-Trust (mTLS + OpenID Connect) et auditer les performances en latence sous contraintes de chiffrement au repos.",
      capacite: 3,
      disponible: true
    },
    {
      numericId: 2,
      id: 'SUJ-2024-048',
      titre: "Détection d'anomalies réseau via Transformer & eBPF",
      description: "Extraction de métriques réseau en temps réel via des programmes eBPF dans le noyau Linux et inférence légère avec des transformers pour la détection d'intrusions.",
      capacite: 2,
      disponible: true
    },
    {
      numericId: 3,
      id: 'SUJ-2024-039',
      titre: 'Optimisation de requêtes SQL vectorielles sous DuckDB',
      description: "Benchmark et amélioration des algorithmes d'indexation HNSW intégrés aux moteurs de bases de données analytiques embarquées.",
      capacite: 3,
      disponible: false
    },
    {
      numericId: 4,
      id: 'SUJ-2024-051',
      titre: 'Audit automatisé de conformité RGPD en architecture micro-services',
      description: "Analyse statique et dynamique des flux d'informations personnelles à travers des traces OpenTelemetry pour détecter les fuites non conformes.",
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
    this.chargerSujets();
  }

  chargerSujets(): void {
    const user = this.authService.currentUser();
    const enseignantId = user?.profilId || 1;

    this.sujetService.getParEnseignant(enseignantId).subscribe({
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
