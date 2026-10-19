import { CommonModule } from '@angular/common';
import { Component, Input, OnInit } from '@angular/core';
import { RouterModule } from '@angular/router';
import { ROLE_CONFIGS, RoleConfig, UserRole } from './sidebar.model';
import { AuthService } from '../../core/services/auth.service';
import { CandidatureService } from '../../core/services/candidature.service';

@Component({
  selector: 'app-sidebar',
  imports: [CommonModule, RouterModule],
  templateUrl: './sidebar.html',
  styleUrl: './sidebar.css',
})
export class Sidebar implements OnInit {
  @Input() role?: UserRole;
  isSidebarOpen: boolean = false;
  candidaturesEnAttente: number = 0;

  constructor(
    private authService: AuthService,
    private candidatureService: CandidatureService
  ) {}

  ngOnInit(): void {
    this.candidatureService.getToutes().subscribe({
      next: (cands) => {
        if (cands) {
          this.candidaturesEnAttente = cands.filter(c => c.statut === 'EN_ATTENTE').length;
        }
      },
      error: () => {}
    });
  }

  get effectiveRole(): UserRole {
    if (this.role) {
      return this.role;
    }
    const user = this.authService.currentUser();
    if (user) {
      switch (user.role) {
        case 'ETUDIANT': return 'etudiant';
        case 'ENSEIGNANT': return 'enseignant';
        case 'RESPONSABLE': return 'responsable';
        case 'ADMIN': return 'admin';
      }
    }
    return 'etudiant';
  }

  get config(): RoleConfig {
    const base = ROLE_CONFIGS[this.effectiveRole] || ROLE_CONFIGS.etudiant;
    const user = this.authService.currentUser();

    const userName = user ? `${user.prenom} ${user.nom}` : base.user.name;
    const userInitials = user
      ? `${user.prenom.charAt(0)}${user.nom.charAt(0)}`.toUpperCase()
      : (base.user.initials || 'U');

    let userRoleTitle = base.user.role;
    if (user) {
      switch (user.role) {
        case 'ETUDIANT': userRoleTitle = 'Étudiant M2 Informatique'; break;
        case 'ENSEIGNANT': userRoleTitle = 'Enseignant-Chercheur (UFR SAT)'; break;
        case 'RESPONSABLE': userRoleTitle = 'Responsable M2 Informatique'; break;
        case 'ADMIN': userRoleTitle = 'Administrateur Système'; break;
      }
    }

    const sections = base.sections.map(sec => ({
      ...sec,
      items: sec.items.map(item => {
        if (this.effectiveRole === 'responsable' && item.route === '/responsable/arbitrage' && this.candidaturesEnAttente > 0) {
          return { ...item, badge: `${this.candidaturesEnAttente} en attente` };
        }
        if (this.effectiveRole === 'enseignant' && item.route === '/enseignant/candidatures' && this.candidaturesEnAttente > 0) {
          return { ...item, badge: this.candidaturesEnAttente };
        }
        return item;
      })
    }));

    return {
      subtitle: base.subtitle,
      sections: sections,
      user: {
        name: userName,
        role: userRoleTitle,
        initials: userInitials,
        avatarBgColor: base.user.avatarBgColor || '#14532d',
        showConnectedStatus: true
      }
    };
  }

  toggleSidebar(): void {
    this.isSidebarOpen = !this.isSidebarOpen;
  }

  closeSidebar(): void {
    this.isSidebarOpen = false;
  }

  onLogout(): void {
    this.authService.deconnecter();
  }
}
