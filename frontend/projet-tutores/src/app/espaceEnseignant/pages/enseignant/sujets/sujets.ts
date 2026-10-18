
import { Component, OnInit , ChangeDetectorRef} from '@angular/core';
import { FormsModule } from '@angular/forms';

import { Sujet } from '../../../models/sujet';
import { SujetService } from '../../../services/sujet';

@Component({
  selector: 'app-sujets',
  standalone: true,
  imports: [FormsModule],
  templateUrl: './sujets.html',
  styleUrl: './sujets.css'
})
export class Sujets implements OnInit {

  sujets: Sujet[] = [];
  recherche = '';
  afficherFormulaire = false;
  sujetEnModification: number | null = null;

  chargement = false;
  enregistrementEnCours = false;
  messageErreur = '';

  formulaire: Sujet = this.nouveauSujet();

  constructor(private sujetService: SujetService , private cdr: ChangeDetectorRef) {}

  ngOnInit(): void {
    this.chargerSujets();
  }

  nouveauSujet(): Sujet {
    return {
      id: 0,
      reference: '',
      titre: '',
      description: '',
      objectifs: '',
      niveau: 'Master 2',
      capaciteMax: 1,
      disponible: true,
      enseignantId: 1,
      sessionUniversitaireId: 1
    };
  }


chargerSujets(): void {
  this.chargement = true;
  this.messageErreur = '';

  this.cdr.detectChanges();

  this.sujetService.lister().subscribe({
    next: (sujets) => {
      this.sujets = sujets;
      this.chargement = false;

      console.log('Nombre de sujets :', this.sujets.length);
      console.log('Chargement terminé :', this.chargement);

      this.cdr.detectChanges();
    },
    error: (erreur) => {
      console.error('Erreur de chargement des sujets :', erreur);

      this.messageErreur =
        'Impossible de charger les sujets depuis le serveur.';
      this.chargement = false;

      this.cdr.detectChanges();
    }
  });
}


  get sujetsFiltres(): Sujet[] {
    const terme = this.recherche.trim().toLowerCase();

    return this.sujets.filter(sujet =>
      sujet.titre.toLowerCase().includes(terme) ||
      sujet.reference.toLowerCase().includes(terme) ||
      sujet.objectifs.toLowerCase().includes(terme) ||
      sujet.niveau.toLowerCase().includes(terme)
    );
  }

  get sujetsDisponibles(): number {
    return this.sujets.filter(sujet => sujet.disponible).length;
  }

  get sujetsComplets(): number {
    return this.sujets.filter(sujet => !sujet.disponible).length;
  }

  ouvrirCreation(): void {
    this.formulaire = this.nouveauSujet();
    this.sujetEnModification = null;
    this.messageErreur = '';
    this.afficherFormulaire = true;
  }

  ouvrirModification(sujet: Sujet): void {
    this.formulaire = { ...sujet };
    this.sujetEnModification = sujet.id;
    this.messageErreur = '';
    this.afficherFormulaire = true;
  }

  enregistrer(): void {
    if (this.enregistrementEnCours) {
      return;
    }

    if (
      !this.formulaire.titre.trim() ||
      !this.formulaire.description.trim() ||
      !this.formulaire.objectifs.trim() ||
      !this.formulaire.niveau.trim() ||
      this.formulaire.capaciteMax < 1
    ) {
      this.messageErreur =
        'Veuillez remplir tous les champs obligatoires correctement.';
      return;
    }

    this.messageErreur = '';
    this.enregistrementEnCours = true;

    if (this.sujetEnModification !== null) {
      this.sujetService.modifier(this.formulaire).subscribe({
        next: () => {
          this.enregistrementEnCours = false;
          this.fermerFormulaire();
          this.chargerSujets();
        },
        error: (erreur) => {
          console.error('[Sujets] Erreur de modification :', erreur);
          this.messageErreur = 'La modification du sujet a échoué.';
          this.enregistrementEnCours = false;
        }
      });

      return;
    }

    const reference =
      `SUJ-${new Date().getFullYear()}-${Date.now()}`;

    const nouveauSujet: Sujet = {
      ...this.formulaire,
      id: 0,
      reference
    };

    this.sujetService.ajouter(nouveauSujet).subscribe({
      next: () => {
        this.enregistrementEnCours = false;
        this.fermerFormulaire();
        this.chargerSujets();
      },
      error: (erreur) => {
        console.error('[Sujets] Erreur de création :', erreur);
        this.messageErreur =
          'La création du sujet a échoué. Vérifiez les identifiants de l’enseignant et de la session.';
        this.enregistrementEnCours = false;
      }
    });
  }

  supprimer(id: number): void {
    if (!confirm('Voulez-vous vraiment supprimer ce sujet ?')) {
      return;
    }

    this.messageErreur = '';

    this.sujetService.supprimer(id).subscribe({
      next: () => {
        this.chargerSujets();
      },
      error: (erreur) => {
        console.error('[Sujets] Erreur de suppression :', erreur);
        this.messageErreur = 'La suppression du sujet a échoué.';
      }
    });
  }

  fermerFormulaire(): void {
    this.afficherFormulaire = false;
    this.sujetEnModification = null;
    this.formulaire = this.nouveauSujet();
    this.messageErreur = '';
  }
}
