import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';

interface SujetItem {
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
export class EnseignantSujets {
  sujets: SujetItem[] = [
    {
      id: 'SUJ-2024-042',
      titre: 'Plateforme de télé-médecine sécurisée sur Kubernetes',
      description: "L'objectif principal est de concevoir et déployer une infrastructure de santé interopérable (norme HL7/FHIR) avec isolation stricte des pods multi-tenants sous Kubernetes. Les étudiants devront implémenter une chaîne d'authentification Zero-Trust (mTLS + OpenID Connect) et auditer les performances en latence sous contraintes de chiffrement au repos.",
      capacite: 3,
      disponible: true
    },
    {
      id: 'SUJ-2024-048',
      titre: "Détection d'anomalies réseau via Transformer & eBPF",
      description: "Extraction de métriques réseau en temps réel via des programmes eBPF dans le noyau Linux et inférence légère avec des transformers pour la détection d'intrusions.",
      capacite: 2,
      disponible: true
    },
    {
      id: 'SUJ-2024-039',
      titre: 'Optimisation de requêtes SQL vectorielles sous DuckDB',
      description: "Benchmark et amélioration des algorithmes d'indexation HNSW intégrés aux moteurs de bases de données analytiques embarquées.",
      capacite: 3,
      disponible: false
    },
    {
      id: 'SUJ-2024-051',
      titre: 'Audit automatisé de conformité RGPD en architecture micro-services',
      description: "Analyse statique et dynamique des flux d'informations personnelles à travers des traces OpenTelemetry pour détecter les fuites non conformes.",
      capacite: 2,
      disponible: true
    }
  ];

  selectedSujet: SujetItem = { ...this.sujets[0] };
  showSuccess = false;

  selectForEdit(s: SujetItem): void {
    this.selectedSujet = { ...s };
  }

  saveEdit(): void {
    const idx = this.sujets.findIndex(item => item.id === this.selectedSujet.id);
    if (idx !== -1) {
      this.sujets[idx] = { ...this.selectedSujet };
    }
    this.showSuccess = true;
    setTimeout(() => {
      this.showSuccess = false;
    }, 3000);
  }

  deleteSujet(id: string): void {
    this.sujets = this.sujets.filter(s => s.id !== id);
    if (this.selectedSujet.id === id && this.sujets.length > 0) {
      this.selectedSujet = { ...this.sujets[0] };
    }
  }

  resetForm(): void {
    this.selectedSujet = { ...this.sujets[0] };
  }

  newSujet(): void {
    const nextNum = String(this.sujets.length + 55).padStart(3, '0');
    this.selectedSujet = {
      id: `SUJ-2024-${nextNum}`,
      titre: '',
      description: '',
      capacite: 2,
      disponible: true
    };
  }
}
