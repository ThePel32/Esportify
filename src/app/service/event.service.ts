import { Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse, HttpHeaders, HttpRequest } from '@angular/common/http';
import { Observable, of, throwError, forkJoin } from 'rxjs';
import { catchError, map, switchMap } from 'rxjs/operators';
import { Event } from '../models/event.model';
import { environment } from '../../environments/environment';


@Injectable({
    providedIn: 'root'
})
export class EventService {
    private apiUrl = `${environment.apiUrl}/events`;

    constructor(private http: HttpClient) {}

    private handleError(error: HttpErrorResponse) {
        if (error.status === 401) {
            return this.refreshTokenAndRetry(error);
        }
    
        console.error("Erreur API :", error);
        return throwError(() => new Error('Erreur de connexion au serveur.'));
    }
    
    private refreshTokenAndRetry(error: HttpErrorResponse): Observable<any> {
        const oldToken = localStorage.getItem("token");
        if (!oldToken) return throwError(() => new Error("Token expiré et non récupérable."));
        return this.http.post<any>(`${environment.apiUrl}/users/refresh-token`, {}, {
            headers: new HttpHeaders({
                "Authorization": `Bearer ${oldToken}`
            })
        }).pipe(
            switchMap(response => {
                localStorage.setItem("token", response.token); 
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
                console.error("Échec du rafraîchissement du token :", err);
                return throwError(() => new Error("Erreur lors du rafraîchissement du token."));
            })
        );
    }

    getEvents(status?: string): Observable<Event[]> {
        let url = this.apiUrl;
        if (status) url += `?state=${status}`;
        return this.http.get<any>(url, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    getEventById(eventId: number): Observable<Event> {
        return this.http.get<any>(`${this.apiUrl}/${eventId}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    getEventsByState(state: string): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}?state=${state}`);
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

    startEvent(eventId: number) {
        return this.http.patch(`${this.apiUrl}/${eventId}/start`, {});
    }

    stopEvent(eventId: number): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${eventId}/stop`, {}, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    joinEvent(eventId: number, gameKey: string, userId: number): Observable<any> {
        const bannedGameUrl = `${environment.apiUrl.replace('/events', '')}/event-bans/is-banned-game/${gameKey}/${userId}`;
        const bannedEventUrl = `${environment.apiUrl.replace('/events', '')}/event-bans/${eventId}/is-banned/${userId}`;

        return forkJoin([
            this.http.get<{ banned: boolean }>(bannedGameUrl, { headers: this.getAuthHeaders() }).pipe(
                catchError(() => of({ banned: false }))
            ),
            this.http.get<{ banned: boolean }>(bannedEventUrl, { headers: this.getAuthHeaders() }).pipe(
                catchError(() => of({ banned: false }))
            )
        ]).pipe(
            switchMap(([gameBan, eventBan]) => {
                if (gameBan.banned) {
                    return throwError(() => new Error("Vous êtes banni de ce jeu. Impossible de rejoindre l'événement."));
                }
                if (eventBan.banned) {
                    return throwError(() => new Error("Vous êtes banni de cet événement."));
                }
                return this.http.post<any>(
                    `${this.apiUrl}/${eventId}/join`,
                    {},
                    { headers: this.getAuthHeaders() }
                );
            }),
            catchError((error: HttpErrorResponse) => this.handleError(error))
        );
    }

    isUserBanned(eventId: number, userId: number) {
        return this.http.get<{ banned: boolean }>(`${environment.apiUrl.replace('/events', '')}/event-bans/${eventId}/is-banned/${userId}`);
    }

    isUserBannedFromGame(gameKey: string, userId: number) {
        return this.http.get<{ banned: boolean }>(`${environment.apiUrl.replace('/events', '')}/event-bans/is-banned-game/${gameKey}/${userId}`);
    }

    leaveEvent(eventId: number): Observable<any> {
        return this.http.post<any>(`${this.apiUrl}/${eventId}/leave`, {}, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    kickParticipant(eventId: number, userId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${eventId}/kick/${userId}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    deleteEvent(eventId: number): Observable<any> {
        return this.http.delete<any>(`${this.apiUrl}/${eventId}`, { headers: this.getAuthHeaders() }).pipe(catchError(this.handleError));
    }

    confirmJoin(eventId: number) {
        const token = localStorage.getItem('token');
        const headers = new HttpHeaders().set('Authorization', `Bearer ${token}`);

        return this.http.post(`${this.apiUrl}/${eventId}/confirm-join`, {}, { headers });
    }

    getUserHistory(userId: number): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/history/user/${userId}`, {
            headers: this.getAuthHeaders()
        }).pipe(catchError(this.handleError));
    }

    getAllHistory(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/history/all`, {
            headers: this.getAuthHeaders()
        }).pipe(catchError(this.handleError));
    }

    getHistoricForUser(userId: number): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/history/user/${userId}`, { headers: this.getAuthHeaders() });
    }

    getAllEndedEvents(): Observable<Event[]> {
        return this.http.get<Event[]>(`${this.apiUrl}/history/all`, { headers: this.getAuthHeaders() });
    }

    banUser(eventId: number, userId: number): Observable<any> {
        return this.http.post(`${this.apiUrl.replace('/events', '')}/event-bans/${eventId}/ban/${userId}`, {}, { headers: this.getAuthHeaders() });
    }
    
    getMessages(eventId: number) {
        return this.http.get<any[]>(`${environment.apiUrl.replace('/events', '')}/chat/messages/${eventId}`, {
            headers: this.getAuthHeaders()
        });
    }
    

    saveMessage(messageData: any) {
        return this.http.post(`${environment.apiUrl.replace('/events', '')}/chat/send-message`, messageData, { headers: this.getAuthHeaders() });
    }

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
    
        if (!token) {
            console.error("Aucun token trouvé dans localStorage !");
        }
    
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': token ? `Bearer ${token}` : ''
        });
    }
}
