import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Affectation } from '../models/affectation.model';

@Injectable({
  providedIn: 'root'
})
export class AffectationService {
  private readonly apiUrl = `${environment.apiUrl}/affectations`;

  constructor(private http: HttpClient) {}

  creer(candidatureId: number): Observable<Affectation> {
    return this.http.post<Affectation>(`${this.apiUrl}?candidatureId=${candidatureId}`, {});
  }

  getToutes(): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(this.apiUrl);
  }

  getParId(id: number): Observable<Affectation> {
    return this.http.get<Affectation>(`${this.apiUrl}/${id}`);
  }

  getParSujet(sujetId: number): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(`${this.apiUrl}/sujet/${sujetId}`);
  }

  getParEtudiant(etudiantId: number): Observable<Affectation[]> {
    return this.http.get<Affectation[]>(`${this.apiUrl}/etudiant/${etudiantId}`);
  }

  compter(): Observable<{ nombreAffectations: number }> {
    return this.http.get<{ nombreAffectations: number }>(`${this.apiUrl}/statistiques/nombre`);
  }
}
