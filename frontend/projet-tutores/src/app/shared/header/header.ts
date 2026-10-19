import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { AuthService } from '../../core/services/auth.service';

@Component({
  selector: 'app-header',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './header.html',
  styleUrl: './header.css',
})
export class Header {
  @Input() filiere: string = 'Master Informatique';
  @Input() module: string = 'Projets Tutorés';
  @Input() session: string = 'Session 2024-2025';
  @Input() breadcrumbs?: string[];
  @Input() hasNotification: boolean = true;
  @Input() notificationCount: number = 0;
  @Input() userAvatar: string = '';
  @Input() userName: string = '';
  @Input() userRole: string = '';
  @Input() userInitials: string = '';

  constructor(private authService: AuthService) {}

  get displayName(): string {
    const user = this.authService.currentUser();
    if (user) {
      return `${user.prenom} ${user.nom}`;
    }
    return this.userName || 'Utilisateur';
  }

  get displayRole(): string {
    const user = this.authService.currentUser();
    if (user) {
      switch (user.role) {
        case 'ETUDIANT': return 'Étudiant M2 GI';
        case 'ENSEIGNANT': return 'Enseignant-Chercheur (UFR SAT)';
        case 'RESPONSABLE': return 'Responsable M2 Info';
        case 'ADMIN': return 'Administrateur Système';
      }
    }
    return this.userRole;
  }

  get initialDisplay(): string {
    if (this.userInitials && !this.authService.currentUser()) {
      return this.userInitials;
    }
    const name = this.displayName;
    const parts = name.split(' ');
    if (parts.length >= 2) {
      return `${parts[0].charAt(0)}${parts[1].charAt(0)}`.toUpperCase();
    }
    return name ? name.charAt(0).toUpperCase() : 'U';
  }

  deconnecter(): void {
    this.authService.deconnecter();
  }
}
