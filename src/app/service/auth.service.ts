import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userProfile: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(
        private http: HttpClient,
        private router: Router
    ) {
        this.loadUserFromLocalStorage();
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('current-user');
    }

    getRole(): string {
        if (this.userProfile.value) {
            return this.userProfile.value.role || '';
        }
    
        const user = JSON.parse(localStorage.getItem('current-user') || '{}');
        return user.role || '';
    }
    
    hasRole(role: string): boolean {
        return this.getRole() === role;
    }

    isAuthenticated(): boolean {
        return !!this.userProfile.value;
    }

    saveUserToLocalStorage(user: any) {
        localStorage.setItem('current-user', JSON.stringify(user));
        this.userProfile.next(user);
    }

    loadUserFromLocalStorage(): void {
        const fromLocalStorage = localStorage.getItem('current-user');

        if (fromLocalStorage) {
            const userInfo = JSON.parse(fromLocalStorage);
            this.userProfile.next(userInfo);
        }
    }

    getUserProfile(): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get(`${this.apiUrl}/profile`, {
            headers: { Authorization: `Bearer ${token}` }
        }).pipe(
            tap((user: any) => {
                this.userProfile.next(user);
            })
        );
    }
    
    signin(data: { email: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/login`, data).pipe(
            tap((response: any) => {
                if (response.user && response.token) {
                    this.saveUserToLocalStorage(response.user);  
                    localStorage.setItem('token', response.token);
                }
            })
        );
    }
    
    signup(data: { username: string; email: string; password: string }): Observable<any> {
        return this.http.post(`${this.apiUrl}/signup`, data);
    }

    logout() {
        localStorage.removeItem('current-user');
        localStorage.removeItem('token');
        this.userProfile.next(null);
        this.router.navigate(['/home']);
    }
}