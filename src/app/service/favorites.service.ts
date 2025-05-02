import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class FavoritesService {
  private apiUrl = 'http://localhost:3000/api/favorites';

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