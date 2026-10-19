import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { Router, RouterModule } from '@angular/router';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-connexion',
  standalone: true,
  imports: [CommonModule, FormsModule, RouterModule],
  templateUrl: './connexion.html',
  styleUrl: './connexion.css',
})
export class Connexion {
  email = '';
  motDePasse = '';
  erreur = '';
  chargement = false;

  constructor(private authService: AuthService, private router: Router) {}

  onSubmit(): void {
    if (!this.email || !this.motDePasse) {
      this.erreur = 'Veuillez renseigner votre email et mot de passe.';
      return;
    }

    this.erreur = '';
    this.chargement = true;

    this.authService.connecter({ email: this.email, motDePasse: this.motDePasse }).subscribe({
      next: (reponse) => {
        this.chargement = false;
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
          case 'ADMIN':
            this.router.navigate(['/admin/tableau-de-bord']);
            break;
          default:
            this.router.navigate(['/tableau-de-bord']);
            break;
        }
      },
      error: (err) => {
        this.chargement = false;
        if (err.status === 0) {
          this.erreur = 'Impossible de joindre le serveur. Assurez-vous que le backend Spring Boot est lancé.';
        } else if (err.error && err.error.message) {
          this.erreur = err.error.message;
        } else {
          this.erreur = 'Email ou mot de passe incorrect.';
        }
      }
    });
  }
}
