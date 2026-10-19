import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';

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
  @Input() userName: string = 'Utilisateur';
  @Input() userRole: string = '';
  @Input() userInitials: string = '';

  get initialDisplay(): string {
    if (this.userInitials) {
      return this.userInitials;
    }
    return this.userName ? this.userName.charAt(0).toUpperCase() : 'U';
  }
}
