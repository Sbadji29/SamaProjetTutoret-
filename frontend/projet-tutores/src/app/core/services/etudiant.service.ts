import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Etudiant } from '../models/etudiant.model';

@Injectable({
  providedIn: 'root'
})
export class EtudiantService {
  private readonly apiUrl = `${environment.apiUrl}/etudiants`;

  constructor(private http: HttpClient) {}

  obtenirTous(): Observable<Etudiant[]> {
    return this.http.get<Etudiant[]>(this.apiUrl);
  }

  obtenirParId(id: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/${id}`);
  }

  obtenirParUtilisateur(utilisateurId: number): Observable<Etudiant> {
    return this.http.get<Etudiant>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }

  creer(etudiant: Etudiant, utilisateurId: number): Observable<Etudiant> {
    return this.http.post<Etudiant>(`${this.apiUrl}?utilisateurId=${utilisateurId}`, etudiant);
  }

  modifier(id: number, donnees: Partial<Etudiant>): Observable<Etudiant> {
    return this.http.put<Etudiant>(`${this.apiUrl}/${id}`, donnees);
  }

  supprimer(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  compter(): Observable<{ nombreEtudiants: number }> {
    return this.http.get<{ nombreEtudiants: number }>(`${this.apiUrl}/statistiques/nombre`);
  }
}
