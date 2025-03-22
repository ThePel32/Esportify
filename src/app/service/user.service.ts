import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable, throwError } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { environment } from '../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class UserService {
    private apiUrl = environment.apiUrl + '/users';

    constructor(private http: HttpClient) {}

    private getAuthHeaders(): HttpHeaders {
        const token = localStorage.getItem('token');
        return new HttpHeaders({
            'Content-Type': 'application/json',
            'Authorization': `Bearer ${token}` 
        });
    }

    getAllUsers(): Observable<any[]> {
        return this.http.get<any[]>(`${this.apiUrl}/all`, { headers: this.getAuthHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    updateUser(id: number, data: any): Observable<any> {
        return this.http.put(`${this.apiUrl}/${id}`, data, { headers: this.getAuthHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    updateUserRole(userId: number, data: any): Observable<any> {
        return this.http.patch(`${this.apiUrl}/${userId}/role`, data, { headers: this.getAuthHeaders() })
        .pipe(catchError(this.handleError));
    }

    deleteUser(id: number): Observable<any> {
        return this.http.delete(`${this.apiUrl}/${id}`, { headers: this.getAuthHeaders() }).pipe(
            catchError(this.handleError)
        );
    }

    private handleError(error: any): Observable<never> {
        alert(`Erreur API: ${error.status} - ${error.message}`);
        return throwError(error);
    }
}
