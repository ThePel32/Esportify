import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    userProfile: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromLocalStorage();

        const token = localStorage.getItem('token');
        if (token && !this.userProfile.value) {
        this.getUserProfile().subscribe({
            error: () => this.logout()
        });
        }
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    getRole(): string {
        const current = this.userProfile.value || JSON.parse(localStorage.getItem('current-user') || 'null');
        return current?.role || '';
    }

    hasRole(role: string): boolean {
        return this.getRole() === role;
    }

    isAuthenticated(): boolean {
        return !!this.userProfile.value && !!localStorage.getItem('token');
    }

    private saveUserToLocalStorage(user: any) {
        localStorage.setItem('current-user', JSON.stringify(user));
        this.userProfile.next(user);
    }

    private loadUserFromLocalStorage(): void {
        const raw = localStorage.getItem('current-user');
        if (raw) {
        try { this.userProfile.next(JSON.parse(raw)); } catch {}
        }
    }

    getUserProfile(): Observable<any> {
        const token = localStorage.getItem('token');
        return this.http.get<{ user: any } | any>(`${this.apiUrl}/profile`, {
        headers: token ? { Authorization: `Bearer ${token}` } : {}
        }).pipe(
        tap((res: any) => {
            const user = res?.user ?? res;
            this.saveUserToLocalStorage(user);
        })
        );
    }

    signin(data: { email: string; password: string }): Observable<any> {
        return this.http.post<{ token: string; user: any }>(`${this.apiUrl}/login`, data).pipe(
        tap((response) => {
            if (response?.user && response?.token) {
            localStorage.setItem('token', response.token);
            this.saveUserToLocalStorage(response.user);
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
