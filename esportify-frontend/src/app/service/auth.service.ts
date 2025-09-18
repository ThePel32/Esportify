import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Router } from '@angular/router';
import { BehaviorSubject, Observable } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({ providedIn: 'root' })
export class AuthService {
    userProfile: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private apiUrl = `${environment.apiUrl}/users`;

    constructor(private http: HttpClient, private router: Router) {
        this.loadUserFromLocalStorage();

        const token = localStorage.getItem('token');
        if (token && !this.userProfile.value) {
        this.getUserProfile().subscribe({ error: () => this.logout() });
        }
    }

    isLoggedIn(): boolean {
        return !!localStorage.getItem('token');
    }

    getRole(): string {
        const current =
        this.userProfile.value ||
        JSON.parse(localStorage.getItem('current-user') || 'null');
        return current?.role || '';
    }

    hasRole(role: string): boolean {
        return (this.getRole() || '').toLowerCase() === role.toLowerCase();
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

        return new Observable<any>((observer) => {
        this.http.get<any>(`${this.apiUrl}/profile`, {
            headers: token ? { Authorization: `Bearer ${token}` } : {}
        }).subscribe({
            next: (res) => {
            const raw = res?.user ?? res;
            const user = {
                id: raw.id,
                username: raw.username ?? raw.pseudo ?? raw.name ?? '',
                pseudo:   raw.pseudo   ?? raw.username ?? '',
                email:    raw.email ?? '',
                role:     raw.role ?? '',
                created_at: raw.created_at ?? raw.createdAt ?? null,
                createdAt:  raw.createdAt  ?? raw.created_at ?? null,
            };
            this.saveUserToLocalStorage(user);
            observer.next(user);
            observer.complete();
            },
            error: (err) => observer.error(err),
        });
        });
    }

    signin(data: { email: string; password: string }): Observable<any> {
        return new Observable<any>((observer) => {
        this.http.post<any>(`${this.apiUrl}/login`, data).subscribe({
            next: (response) => {
            if (response?.user && response?.token) {
                localStorage.setItem('token', response.token);
                const raw = response.user;
                const user = {
                id: raw.id,
                username: raw.username ?? raw.pseudo ?? raw.name ?? '',
                pseudo:   raw.pseudo   ?? raw.username ?? '',
                email:    raw.email ?? '',
                role:     raw.role ?? '',
                created_at: raw.created_at ?? raw.createdAt ?? null,
                createdAt:  raw.createdAt  ?? raw.created_at ?? null,
                };
                this.saveUserToLocalStorage(user);
            }
            observer.next(response);
            observer.complete();
            },
            error: (err) => observer.error(err),
        });
        });
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
