import { Injectable, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { ConnexionReponse, ConnexionRequete, InscriptionRequete, RoleUtilisateur } from '../models/auth.model';

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  private readonly storageKey = 'uniprojet_utilisateur';
  private readonly apiUrl = `${environment.apiUrl}/utilisateurs`;

  currentUser = signal<ConnexionReponse | null>(this.getStoredUser());

  constructor(private http: HttpClient, private router: Router) {}

  private getStoredUser(): ConnexionReponse | null {
    try {
      const item = localStorage.getItem(this.storageKey);
      return item ? JSON.parse(item) : null;
    } catch {
      return null;
    }
  }

  connecter(requete: ConnexionRequete): Observable<ConnexionReponse> {
    return this.http.post<ConnexionReponse>(`${this.apiUrl}/connexion`, requete).pipe(
      tap((reponse) => {
        localStorage.setItem(this.storageKey, JSON.stringify(reponse));
        this.currentUser.set(reponse);
      })
    );
  }

  inscrire(requete: InscriptionRequete): Observable<ConnexionReponse> {
    return this.http.post<ConnexionReponse>(`${this.apiUrl}/inscription`, requete).pipe(
      tap((reponse) => {
        localStorage.setItem(this.storageKey, JSON.stringify(reponse));
        this.currentUser.set(reponse);
      })
    );
  }

  deconnecter(): void {
    localStorage.removeItem(this.storageKey);
    this.currentUser.set(null);
    this.router.navigate(['/connexion']);
  }

  isAuthenticated(): boolean {
    return this.currentUser() !== null;
  }

  hasRole(role: RoleUtilisateur): boolean {
    const user = this.currentUser();
    return user !== null && user.role === role;
  }
}
