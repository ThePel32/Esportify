import { Injectable } from '@angular/core';
import { io, Socket } from 'socket.io-client';
import { environment } from '../../environments/environments';

@Injectable({
    providedIn: 'root'
})
export class SocketService {
    private socket: Socket | null = null;

    constructor() {}

    connect(): void {
        const socketUrl = environment.apiUrl.replace('/api', '');
        this.socket = io(socketUrl);
    }

    disconnect(): void {
        if (this.socket) {
            this.socket.disconnect();
        }
    }

    sendMessage(message: { user: string, content: string }): void {
        this.socket?.emit('chatMessage', message);
    }

    onReceiveMessage(callback: (message: any) => void): void {
        this.socket?.on('receiveMessage', callback);
    }
}
