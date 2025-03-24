import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError, switchMap } from 'rxjs/operators';


@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = 'http://localhost:3000/api/events';

    constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse) {
        if (error.status === 401) {
            return this.refreshTokenAndRetry(error);
        }
    
        console.error("❌ Erreur API :", error);
        return throwError(() => new Error('Erreur de connexion au serveur.'));
    }
    
    private refreshTokenAndRetry(error: HttpErrorResponse): Observable<any> {
        const oldToken = localStorage.getItem("token");
        if (!oldToken) return throwError(() => new Error("Token expiré et non récupérable."));
        return this.http.post<any>("http://localhost:3000/api/users/refresh-token", {}, {
            headers: new HttpHeaders({
                "Authorization": `Bearer ${oldToken}`
            })
        }).pipe(
            switchMap(response => {
                localStorage.setItem("token", response.token); 

                const storedToken = localStorage.getItem("token");

                const updatedHeaders = new HttpHeaders({
                    "Authorization": `Bearer ${response.token}`
                });

        const method = error.error.config.method;
        const url = error.error.config.url;
        const body = error.error.config.body;

        const updatedRequest = new HttpRequest<any>(method, url, body, {
            headers: updatedHeaders
        });

        return this.http.request(updatedRequest);
    }),
    catchError(err => {
        console.error("❌ Échec du rafraîchissement du token :", err);
        return throwError(() => new Error("Erreur lors du rafraîchissement du token."));
    })
);

    }

    getEvents(status?: string): Observable<any> {
        let url = this.apiUrl;
        if (status) url += `?state=${status}`;
        return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    getEventById(eventId: number): Observable<any> {
        return this.http.get<any>(`${this.apiUrl}/${eventId}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    addEvent(eventData: any): Observable<any> {
        return this.http.post<any>(this.apiUrl, eventData, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    updateEvent(eventId: number, eventData: any): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${eventId}`, eventData, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    validateEvent(eventId: number): Observable<any> {
        return this.http.put<any>(`${this.apiUrl}/${eventId}/validate`, {}, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    joinEvent(eventId: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${eventId}/join`, {}, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    leaveEvent(eventId: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${eventId}/leave`, {}, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    removeParticipant(eventId: number, userId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${eventId}/remove/${userId}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    deleteEvent(eventId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${eventId}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error("❌ Aucun token trouvé dans localStorage !");
        }
    
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        });
    }
    
}
