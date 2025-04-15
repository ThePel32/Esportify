import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
@Injectable({
    providedIn: 'root'
})
export class FavoritesService {
    private apiUrl = 'http://localhost:3000/api/favorites';

    constructor(private http: HttpClient) {}

    addFavorite(userId: number, eventId: number): Observable<any> {
        return this.http.post(this.apiUrl, { user_id: userId, event_id: eventId });
    }

    removeFavorite(userId: number, eventId: number): Observable<any> {
        return this.http.request('delete', this.apiUrl, { body: { user_id: userId, event_id: eventId } });
    }

    getFavoritesByUser(userId: number): Observable<number[]> {
        return this.http.get<number[]>(`${this.apiUrl}/${userId}`);
    }
}