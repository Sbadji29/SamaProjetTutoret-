import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { Header } from '../../shared/header/header';
import { Sidebar } from '../../shared/sidebar/sidebar';
import { CandidatureService } from '../../core/services/candidature.service';
import { AffectationService } from '../../core/services/affectation.service';

export interface ArbitrageItem {
  numericId?: number;
  id: string;
  initials: string;
  avatarClass: string;
  nom: string;
  sujet: string;
  enseignant: string;
  date: string;
  capaciteStatus: 'disponible' | 'complet';
  statut: 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE';
  voeu: string;
  voeuPriorite: string;
  placesRestantes: string;
  parcours: string;
}

@Component({
  selector: 'app-responsable-arbitrage',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule, Header, Sidebar],
  templateUrl: './responsable-arbitrage.html',
  styleUrl: './responsable-arbitrage.css'
})
export class ResponsableArbitrage implements OnInit {
  candidatures: ArbitrageItem[] = [];
  selectedCandidature: ArbitrageItem | null = null;
  activeTab: 'TOUTES' | 'EN_ATTENTE' | 'VALIDEE' | 'REJETEE' = 'EN_ATTENTE';
  searchTerm = '';
  selectedParcours = 'Tous les parcours M2';
  chargement = false;
  countAffectes = 0;

  constructor(
    private candidatureService: CandidatureService,
    private affectationService: AffectationService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerCandidatures();
  }

  chargerCandidatures(): void {
    this.chargement = true;

    forkJoin({
      candidatures: this.candidatureService.getToutes().pipe(catchError(() => of([]))),
      affectations: this.affectationService.getToutes().pipe(catchError(() => of([])))
    }).subscribe({
      next: (res) => {
        const list = res.candidatures || [];
        this.candidatures = list.map((c, index) => {
          const nomEtu = c.etudiant?.utilisateur ? `${c.etudiant.utilisateur.prenom} ${c.etudiant.utilisateur.nom}` : 'Étudiant';
          const initials = nomEtu.split(' ').map(p => p.charAt(0)).join('').slice(0, 2).toUpperCase() || 'ET';
          const ensNom = c.sujet?.enseignant ? `${c.sujet.enseignant.utilisateur?.prenom || ''} ${c.sujet.enseignant.utilisateur?.nom || ''}`.trim() : 'Enseignant';
          const dateStr = c.dateCandidature ? new Date(c.dateCandidature).toLocaleDateString('fr-FR') : 'Récent';

          return {
            numericId: c.id,
            id: `ARB-${String(index + 1).padStart(2, '0')}`,
            initials: initials,
            avatarClass: index === 0 ? 'bg-forest' : 'bg-primary-subtle text-primary',
            nom: nomEtu,
            sujet: c.sujet?.titre || 'Sujet proposé',
            enseignant: ensNom,
            date: dateStr,
            capaciteStatus: c.sujet?.disponible ? 'disponible' : 'complet',
            statut: c.statut === 'ACCEPTEE' ? 'VALIDEE' : (c.statut as any),
            voeu: `Vœu n°${c.priorite}`,
            voeuPriorite: `Vœu n°${c.priorite} (${c.priorite === 1 ? 'Priorité haute' : 'Priorité standard'})`,
            placesRestantes: `${c.sujet?.capaciteMax || 2} places offertes`,
            parcours: c.etudiant ? `${c.etudiant.filiere} (${c.etudiant.niveau})` : 'Master 2 Informatique'
          };
        });

        const pending = this.candidatures.find(c => c.statut === 'EN_ATTENTE');
        this.selectedCandidature = pending || (this.candidatures.length > 0 ? this.candidatures[0] : null);
        this.countAffectes = (res.affectations || []).length;
        this.chargement = false;
        this.cdr.detectChanges();
      },
      error: () => {
        this.chargement = false;
        this.cdr.detectChanges();
      }
    });
  }

  get countToutes(): number {
    return this.candidatures.length;
  }

  get countEnAttente(): number {
    return this.candidatures.filter(c => c.statut === 'EN_ATTENTE').length;
  }

  get countValidees(): number {
    return this.candidatures.filter(c => c.statut === 'VALIDEE').length;
  }

  get countRejetees(): number {
    return this.candidatures.filter(c => c.statut === 'REJETEE').length;
  }

  get filteredList(): ArbitrageItem[] {
    return this.candidatures.filter(c => {
      const matchTab = this.activeTab === 'TOUTES' ? true : c.statut === this.activeTab;
      const term = this.searchTerm.toLowerCase().trim();
      const matchSearch = !term ||
        c.nom.toLowerCase().includes(term) ||
        c.sujet.toLowerCase().includes(term) ||
        c.enseignant.toLowerCase().includes(term);
      return matchTab && matchSearch;
    });
  }

  select(c: ArbitrageItem): void {
    this.selectedCandidature = c;
  }

  accepter(): void {
    if (!this.selectedCandidature) {
      return;
    }

    const item = this.selectedCandidature;
    item.statut = 'VALIDEE';

    if (item.numericId) {
      this.candidatureService.changerStatut(item.numericId, 'ACCEPTEE').subscribe({
        next: () => {
          this.affectationService.creer(item.numericId!).subscribe({
            next: () => {},
            error: () => {}
          });
        },
        error: () => {}
      });
    }

    const next = this.candidatures.find(c => c.statut === 'EN_ATTENTE' && c.id !== item.id);
    if (next) {
      this.selectedCandidature = next;
    }
  }

  rejeter(): void {
    if (!this.selectedCandidature) {
      return;
    }

    const item = this.selectedCandidature;
    item.statut = 'REJETEE';

    if (item.numericId) {
      this.candidatureService.changerStatut(item.numericId, 'REJETEE').subscribe({
        next: () => {},
        error: () => {}
      });
    }

    const next = this.candidatures.find(c => c.statut === 'EN_ATTENTE' && c.id !== item.id);
    if (next) {
      this.selectedCandidature = next;
    }
  }
}
