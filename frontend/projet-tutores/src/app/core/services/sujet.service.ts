import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Sujet } from '../models/sujet.model';

@Injectable({
  providedIn: 'root'
})
export class SujetService {
  private readonly apiUrl = `${environment.apiUrl}/sujets`;

  constructor(private http: HttpClient) {}

  getTous(): Observable<Sujet[]> {
    return this.http.get<Sujet[]>(this.apiUrl);
  }

  getDisponibles(): Observable<Sujet[]> {
    return this.http.get<Sujet[]>(`${this.apiUrl}/disponibilite?valeur=true`);
  }

  getParId(id: number): Observable<Sujet> {
    return this.http.get<Sujet>(`${this.apiUrl}/${id}`);
  }

  getParEnseignant(enseignantId: number): Observable<Sujet[]> {
    return this.http.get<Sujet[]>(`${this.apiUrl}/enseignant/${enseignantId}`);
  }

  creer(sujet: Sujet, enseignantId: number, sessionId: number): Observable<Sujet> {
    return this.http.post<Sujet>(`${this.apiUrl}?enseignantId=${enseignantId}&sessionId=${sessionId}`, sujet);
  }

  modifier(id: number, donnees: Partial<Sujet>): Observable<Sujet> {
    return this.http.put<Sujet>(`${this.apiUrl}/${id}`, donnees);
  }

  supprimer(id: number): Observable<{ message: string }> {
    return this.http.delete<{ message: string }>(`${this.apiUrl}/${id}`);
  }

  compter(): Observable<{ nombreSujets: number }> {
    return this.http.get<{ nombreSujets: number }>(`${this.apiUrl}/statistiques/nombre`);
  }
}
