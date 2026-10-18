
import { Component } from '@angular/core';
import {
  Router,
  RouterLink,
  RouterLinkActive,
  RouterOutlet
} from '@angular/router';

@Component({
  selector: 'app-enseignant-layout',
  standalone: true,
  imports: [
    RouterLink,
    RouterLinkActive,
    RouterOutlet
  ],
  templateUrl: './enseignant-layout.html',
  styleUrl: './enseignant-layout.css'
})
export class EnseignantLayoutComponent {

  constructor(private router: Router) {}

  get titrePage(): string {
    const url = this.router.url.split('?')[0];

    if (url.startsWith('/enseignant/dashboard')) {
      return 'Tableau de bord';
    }

    if (url.startsWith('/enseignant/sujets')) {
      return 'Mes sujets proposés';
    }

    if (url.startsWith('/enseignant/candidatures')) {
      return 'Candidatures reçues';
    }

    if (url.startsWith('/enseignant/catalogue')) {
      return 'Catalogue des sujets';
    }

    return 'Espace Enseignant';
  }
}
