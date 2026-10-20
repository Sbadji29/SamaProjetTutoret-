import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../services/auth.service';

export const authGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isAuthenticated()) {
    return true;
  }

  return router.createUrlTree(['/connexion']);
};

export const roleGuard = (allowedRoles: string[]): CanActivateFn => {
  return () => {
    const authService = inject(AuthService);
    const router = inject(Router);

    if (!authService.isAuthenticated()) {
      return router.createUrlTree(['/connexion']);
    }

    const user = authService.currentUser();
    if (user && allowedRoles.includes(user.role)) {
      return true;
    }

    switch (user?.role) {
      case 'ADMIN':
        return router.createUrlTree(['/admin/tableau-de-bord']);
      case 'ENSEIGNANT':
        return router.createUrlTree(['/enseignant/dashboard']);
      case 'RESPONSABLE':
        return router.createUrlTree(['/responsable/dashboard']);
      case 'ETUDIANT':
      default:
        return router.createUrlTree(['/tableau-de-bord']);
    }
  };
};

export const guestGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return true;
  }

  const user = authService.currentUser();
  switch (user?.role) {
    case 'ADMIN':
      return router.createUrlTree(['/admin/tableau-de-bord']);
    case 'ENSEIGNANT':
      return router.createUrlTree(['/enseignant/dashboard']);
    case 'RESPONSABLE':
      return router.createUrlTree(['/responsable/dashboard']);
    case 'ETUDIANT':
    default:
      return router.createUrlTree(['/tableau-de-bord']);
  }
};

export const rootRedirectGuard: CanActivateFn = () => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (!authService.isAuthenticated()) {
    return router.createUrlTree(['/connexion']);
  }

  const user = authService.currentUser();
  switch (user?.role) {
    case 'ADMIN':
      return router.createUrlTree(['/admin/tableau-de-bord']);
    case 'ENSEIGNANT':
      return router.createUrlTree(['/enseignant/dashboard']);
    case 'RESPONSABLE':
      return router.createUrlTree(['/responsable/dashboard']);
    case 'ETUDIANT':
    default:
      return router.createUrlTree(['/tableau-de-bord']);
  }
};
