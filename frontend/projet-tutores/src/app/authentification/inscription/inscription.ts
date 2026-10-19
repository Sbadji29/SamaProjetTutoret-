import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-inscription',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './inscription.html',
  styleUrl: './inscription.css',
})
export class Inscription {
  nomComplet: string = '';
  email: string = '';
  roleChoisi: 'ETUDIANT' | 'ENSEIGNANT' | 'RESPONSABLE' | '' = '';
  motDePasse: string = '';
  confirmationMotDePasse: string = '';
  accepteConditions: boolean = false;

  erreur: string = '';
  succes: string = '';
  chargement: boolean = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.nomComplet || !this.email || !this.roleChoisi || !this.motDePasse) {
      this.erreur = 'Veuillez remplir tous les champs obligatoires.';
      return;
    }

    if (this.motDePasse.length < 8) {
      this.erreur = 'Le mot de passe doit comporter au moins 8 caractères.';
      return;
    }

    if (this.motDePasse !== this.confirmationMotDePasse) {
      this.erreur = 'Les mots de passe ne correspondent pas.';
      return;
    }

    if (!this.accepteConditions) {
      this.erreur = 'Veuillez accepter les conditions d\'utilisation.';
      return;
    }

    const parties = this.nomComplet.trim().split(' ');
    let prenom = parties[0];
    let nom = parties.slice(1).join(' ');
    if (!nom) {
      nom = prenom;
    }

    this.erreur = '';
    this.chargement = true;

    this.authService.inscrire({
      prenom: prenom,
      nom: nom,
      email: this.email.trim(),
      motDePasse: this.motDePasse,
      role: this.roleChoisi
    }).subscribe({
      next: (reponse) => {
        this.chargement = false;
        this.succes = 'Compte créé avec succès ! Redirection en cours...';
        setTimeout(() => {
          switch (reponse.role) {
            case 'ETUDIANT':
              this.router.navigate(['/tableau-de-bord']);
              break;
            case 'ENSEIGNANT':
              this.router.navigate(['/enseignant/dashboard']);
              break;
            case 'RESPONSABLE':
              this.router.navigate(['/responsable/dashboard']);
              break;
            default:
              this.router.navigate(['/tableau-de-bord']);
              break;
          }
        }, 1200);
      },
      error: (err) => {
        this.chargement = false;
        if (err.status === 0) {
          this.erreur = 'Impossible de contacter le serveur Spring Boot.';
        } else if (err.error && err.error.message) {
          this.erreur = err.error.message;
        } else {
          this.erreur = 'Une erreur est survenue lors de la création du compte.';
        }
      }
    });
  }
}
