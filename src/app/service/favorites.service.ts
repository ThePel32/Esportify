import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = `${environment.apiUrl}/favorites`;

  constructor(private http: HttpClient) {}

  addFavorite(eventId: number): Observable<any> {
    return this.http.post(this.apiUrl, { event_id: eventId });
  }
  
  removeFavorite(gameKey: string): Observable<any> {
    return this.http.delete(`${this.apiUrl}/${gameKey}`);
  }
  
  getFavoritesByUser(): Observable<string[]> {
    return this.http.get<string[]>(this.apiUrl);
  }
}
