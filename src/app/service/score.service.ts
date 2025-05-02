import { HttpClient, HttpHeaders } from "@angular/common/http";
import { Injectable } from "@angular/core";
import { Observable } from "rxjs";
import { Score } from "../models/score.model";

@Injectable({
    providedIn: 'root'
})
export class ScoreService {
    private apiUrl = 'http://localhost:3000/api/scores';
    
    constructor(private http: HttpClient) {}

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token? `Bearer ${token}` : ''
        });
    }

    addScore(scoreData: any): Observable<any> {
        return this.http.post(`${this.apiUrl}`, scoreData, { headers: this.getAuthHeaders() });
    }

    getScoresForEvent(eventId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/event/${eventId}`, { headers: this.getAuthHeaders() });
    }

    getTopScoresForEvent(eventId: number): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/event/${eventId}/top`, { headers: this.getAuthHeaders() });
    }

    getScoreForUser(eventId: number, userId: number): Observable<Score | null> {
        return this.http.get<Score | null>(`${this.apiUrl}/event/${eventId}/user/${userId}`, {
            headers: this.getAuthHeaders()
        });
    }
}