import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Candidature, StatutCandidature } from '../models/candidature.model';

@Injectable({
  providedIn: 'root'
})
export class CandidatureService {
  private readonly apiUrl = `${environment.apiUrl}/candidatures`;

  constructor(private http: HttpClient) {}

  creer(candidature: Partial<Candidature>, etudiantId: number, sujetId: number, sessionId: number): Observable<Candidature> {
    return this.http.post<Candidature>(
      `${this.apiUrl}?etudiantId=${etudiantId}&sujetId=${sujetId}&sessionId=${sessionId}`,
      candidature
    );
  }

  getToutes(): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(this.apiUrl);
  }

  getParId(id: number): Observable<Candidature> {
    return this.http.get<Candidature>(`${this.apiUrl}/${id}`);
  }

  getParEtudiant(etudiantId: number): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/etudiant/${etudiantId}`);
  }

  getParSujet(sujetId: number): Observable<Candidature[]> {
    return this.http.get<Candidature[]>(`${this.apiUrl}/sujet/${sujetId}`);
  }

  changerStatut(id: number, statut: StatutCandidature): Observable<Candidature> {
    return this.http.patch<Candidature>(`${this.apiUrl}/${id}/statut?valeur=${statut}`, {});
  }

  supprimer(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  compter(): Observable<{ nombreCandidatures: number }> {
    return this.http.get<{ nombreCandidatures: number }>(`${this.apiUrl}/statistiques/nombre`);
  }
}
