import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Enseignant } from '../models/enseignant.model';

@Injectable({
  providedIn: 'root'
})
export class EnseignantService {
  private readonly apiUrl = `${environment.apiUrl}/enseignants`;

  constructor(private http: HttpClient) {}

  obtenirTous(): Observable<Enseignant[]> {
    return this.http.get<Enseignant[]>(this.apiUrl);
  }

  obtenirParId(id: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/${id}`);
  }

  obtenirParUtilisateur(utilisateurId: number): Observable<Enseignant> {
    return this.http.get<Enseignant>(`${this.apiUrl}/utilisateur/${utilisateurId}`);
  }

  creer(enseignant: Enseignant, utilisateurId: number): Observable<Enseignant> {
    return this.http.post<Enseignant>(`${this.apiUrl}?utilisateurId=${utilisateurId}`, enseignant);
  }

  modifier(id: number, donnees: Partial<Enseignant>): Observable<Enseignant> {
    return this.http.put<Enseignant>(`${this.apiUrl}/${id}`, donnees);
  }

  supprimer(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  compter(): Observable<{ nombreEnseignants: number }> {
    return this.http.get<{ nombreEnseignants: number }>(`${this.apiUrl}/statistiques/nombre`);
  }
}
