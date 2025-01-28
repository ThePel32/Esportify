import { Injectable } from '@angular/core';
// import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable } from 'rxjs';

// const API_LOGIN = 'http://localhost:3000/api/users';
@Injectable({
providedIn: 'root'
})
export class AuthService {
    userProfile: BehaviorSubject<any> = new BehaviorSubject<any>({
        id: 0,
        email: '',
        password: '',
    });

    private apiUrl = '/api/users';


    // constructor(private http: HttpClient) {}

    isAutheticated() {
        return !!localStorage.getItem('current-user');
    }
    loadUserFromLocalStorage(): any {
        if (this.userProfile.value.id == 0) {
        let fromLocalStorage = localStorage.getItem('current-user');
        if (fromLocalStorage) {
            let userInfo = JSON.parse(fromLocalStorage);
            this.userProfile.next(userInfo);
        }
        }
        return this.userProfile.value;
    }

//     signup(data: { username: any; email: string; password: any;}): Observable<any> {
//         return this.http.post(`${this.apiUrl}/users/signup`, data);
//     }

//     login(data: { email: any; password: any}): Observable<any> {
//         return this.http.post(`${this.apiUrl}/users/login`, data);
//     }
}