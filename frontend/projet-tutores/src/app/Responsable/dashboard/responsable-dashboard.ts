import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
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
  totalCandidatures = 0;
  enAttenteCount = 0;
  affectationsCount = 0;
  rejeteesCount = 0;
  chargement = false;

  candidaturesPrioritaires: CandidaturePrioritaireItem[] = [];

  constructor(
    private candidatureService: CandidatureService,
    private affectationService: AffectationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerDonnees();
  }

  chargerDonnees(): void {
    this.chargement = true;

    forkJoin({
      candidatures: this.candidatureService.getToutes().pipe(catchError(() => of([]))),
      affectations: this.affectationService.getToutes().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res) => {
        const cands = res.candidatures || [];
        this.totalCandidatures = cands.length;
        const pending = cands.filter(c => c.statut === 'EN_ATTENTE');
        this.enAttenteCount = pending.length;
        this.rejeteesCount = cands.filter(c => c.statut === 'REJETEE').length;
        this.affectationsCount = (res.affectations || []).length;

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

        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }
}
