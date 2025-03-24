import { Injectable } from "@angular/core";
import { HttpClient } from "@angular/common/http";
import { Observable } from "rxjs";

@Injectable({
    providedIn: 'root'
})

export class ContactService {
    private apiUrl = 'http://localhost:3000/api/message';

    constructor(private http: HttpClient) {}

    sendMessage(data: { email: string; message: string }): Observable<any> {
        return this.http.post('http://localhost:3000/api/message', data);
    }
}