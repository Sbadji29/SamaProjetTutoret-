
import {
  Component,
  OnInit,
  ChangeDetectorRef
} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Sujet } from '../../../models/sujet';
import { SujetService } from '../../../services/sujet';

@Component({
  selector: 'app-catalogue',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './catalogue.html',
  styleUrl: './catalogue.css'
})
export class Catalogue implements OnInit {

  sujets: Sujet[] = [];
  recherche = '';
  niveauFiltre = 'TOUS';
  disponibiliteFiltre = 'TOUS';

  sujetSelectionne: Sujet | null = null;
  chargement = false;
  messageErreur = '';

  constructor(
    private sujetService: SujetService,
    private cdr: ChangeDetectorRef
  ) {}

  ngOnInit(): void {
    this.chargerSujets();
  }

  chargerSujets(): void {
    this.chargement = true;
    this.messageErreur = '';

    this.cdr.detectChanges();

    this.sujetService.lister().subscribe({
      next: (sujets) => {
        this.sujets = sujets;
        this.chargement = false;

        console.log('[Catalogue] Nombre de sujets :', this.sujets.length);

        this.cdr.detectChanges();
      },
      error: (erreur) => {
        console.error('[Catalogue] Erreur de chargement :', erreur);

        this.messageErreur =
          'Impossible de charger le catalogue depuis le serveur.';
        this.chargement = false;

        this.cdr.detectChanges();
      }
    });
  }

  get sujetsFiltres(): Sujet[] {
    const terme = this.recherche.trim().toLowerCase();

    return this.sujets.filter(sujet => {
      const correspondRecherche =
        sujet.titre.toLowerCase().includes(terme) ||
        sujet.reference.toLowerCase().includes(terme) ||
        sujet.description.toLowerCase().includes(terme) ||
        sujet.objectifs.toLowerCase().includes(terme);

      const correspondNiveau =
        this.niveauFiltre === 'TOUS' ||
        sujet.niveau === this.niveauFiltre;

      const correspondDisponibilite =
        this.disponibiliteFiltre === 'TOUS' ||
        (this.disponibiliteFiltre === 'DISPONIBLES' &&
          sujet.disponible) ||
        (this.disponibiliteFiltre === 'INDISPONIBLES' &&
          !sujet.disponible);

      return correspondRecherche &&
        correspondNiveau &&
        correspondDisponibilite;
    });
  }

  get totalSujets(): number {
    return this.sujets.length;
  }

  get totalDisponibles(): number {
    return this.sujets.filter(sujet => sujet.disponible).length;
  }

  get totalIndisponibles(): number {
    return this.sujets.filter(sujet => !sujet.disponible).length;
  }

  consulter(sujet: Sujet): void {
    this.sujetSelectionne = sujet;
  }

  fermerDetails(): void {
    this.sujetSelectionne = null;
  }
}
