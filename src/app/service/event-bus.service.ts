import { Injectable } from '@angular/core';
import { Subject } from 'rxjs';

@Injectable({
    providedIn: 'root',
})
export class EventBusService {
    private refreshEventsSource = new Subject<void>();
    refreshEvents$ = this.refreshEventsSource.asObservable();

    emitRefreshEvents() {
        this.refreshEventsSource.next();
    }
}
