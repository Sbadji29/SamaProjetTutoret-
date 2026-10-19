import { CommonModule } from '@angular/common';
import { Component, Input } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROLE_CONFIGS, RoleConfig, UserRole } from './sidebar.model';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar {
  @Input() role: UserRole = 'etudiant';
  isSidebarOpen: boolean = false;

  get config(): RoleConfig {
    return ROLE_CONFIGS[this.role] || ROLE_CONFIGS.etudiant;
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  onLogout(): void {
    console.log('Action de déconnexion');
  }
}
