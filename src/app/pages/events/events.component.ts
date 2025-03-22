import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { MatTabsModule } from '@angular/material/tabs';
import { NgFor, NgIf } from '@angular/common';
import { AddEventComponent } from '../../components/add-event/add-event.component';
import { EventService } from '../../service/event.service';
import { AuthService } from '../../service/auth.service';
import { MatSnackBar } from '@angular/material/snack-bar';
import { Event } from '../../models/event.model';
import { EventBusService } from '../../service/event-bus.service';

@Component({
  selector: 'app-events',
  standalone: true,
  imports: [
    CommonModule,
    MatCardModule,
    MatButtonModule,
    MatTabsModule,
    NgFor,
    NgIf,
    AddEventComponent
  ],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent implements OnInit {
  upcomingEvents: Event[] = [];
  ongoingEvents: Event[] = [];
  pendingEvents: Event[] = [];
  validatedEvents: Event[] = [];
  selectedEvent: Event | null = null;
  userId: number | null = null;
  isAdmin: boolean = false;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private eventBus: EventBusService,
    private snackBar: MatSnackBar
  ) {}

  ngOnInit() {
    this.userId = this.authService.userProfile.value?.id || null;
    this.isAdmin = this.authService.hasRole('admin');
    this.loadEvents();
    this.eventBus.refreshEvents$.subscribe(() => {
      this.loadEvents();
    });
  }

  loadEvents() {
    this.eventService.getEvents('validated').subscribe((events: Event[]) => {
      console.log('Événements validés reçus :', events);
    
      this.upcomingEvents = events.map(event => ({
        ...event,
        participants: event.participants || []
      }));
    
      this.ongoingEvents = this.upcomingEvents.filter(event => new Date(event.date_time) <= new Date());
      this.upcomingEvents = this.upcomingEvents.filter(event => !this.ongoingEvents.includes(event));
    });
    
    


    if (this.isAdmin) {
        this.eventService.getEvents('pending').subscribe((events: Event[]) => {
            console.log('Événements en attente reçus :', events); 
            this.pendingEvents = events;
        });
    }
}

trackById(index: number, event: Event): number {
  return event.id;
}


showDetails(event: Event) {
  this.selectedEvent = event;
}

closeDetails() {
  this.selectedEvent = null;
}

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate()
    .toString().padStart(2, '0')}-${(date.getMonth() + 1)
    .toString().padStart(2, '0')}-${date.getFullYear()} à ${date.getHours()
    .toString().padStart(2, '0')}:${date.getMinutes()
    .toString().padStart(2, '0')}`;
  }

  validateEvent(eventId: number) {
    this.eventService.validateEvent(eventId).subscribe(() => {
      this.snackBar.open('Événement validé !', 'Fermer', { duration: 3000 });
  
      setTimeout(() => {
        this.loadEvents();
      }, 500);
    });
  }
  
  deleteEvent(eventId: number) {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.snackBar.open('Événement supprimé !', 'Fermer', { duration: 3000 });
  
      setTimeout(() => {
        this.loadEvents();
      }, 500);
    });
  }
  

  isUserRegistered(event: Event): boolean {
    return event.participants?.some(p => p.id === this.userId) || false;
}

getParticipantsCount(event: Event): string {
  return `${event.participants?.length ?? 0}/${event.max_players}`;
}


joinEvent(eventId: number) {
  this.eventService.joinEvent(eventId).subscribe(() => {
    this.snackBar.open('Inscription réussie !', 'Fermer', { duration: 3000 });

    if (this.selectedEvent && this.selectedEvent.id === eventId) {
      this.selectedEvent.participants.push({
        id: this.userId!,
        username: this.authService.userProfile.value?.username
      });
    }

    this.loadEvents();
  });
}


  leaveEvent(eventId: number) {
    this.eventService.leaveEvent(eventId).subscribe(() => {
      this.snackBar.open('Désinscription réussie !', 'Fermer', { duration: 3000 });
      this.loadEvents();
      if (this.selectedEvent && this.selectedEvent.id === eventId) {
        this.selectedEvent.participants = this.selectedEvent.participants.filter(p => p.id !== this.userId);
      }
      
    });
  }

  confirmPresence(eventId: number) {
    this.snackBar.open('Présence confirmée !', 'Fermer', { duration: 3000 });
  }

  get canAddEvent(): boolean {
    return this.authService.hasRole('admin') || this.authService.hasRole('organizer');
  }
}


