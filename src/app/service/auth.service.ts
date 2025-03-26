import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { BehaviorSubject, Observable, tap } from 'rxjs';

@Injectable({
    providedIn: 'root'
})
export class AuthService {
    userProfile: BehaviorSubject<any> = new BehaviorSubject<any>(null);
    private apiUrl = 'http://localhost:3000/api/users';

    constructor(private http: HttpClient) {
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
            this.userProfile.next(userInfo.user);
        }
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
        this.userProfile.next(null);
    }
}
