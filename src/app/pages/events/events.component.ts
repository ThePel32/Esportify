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
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';

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
    AddEventComponent,
    FormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    RouterModule,
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})
export class EventsComponent implements OnInit {
  upcomingEvents: Event[] = [];
  ongoingEvents: Event[] = [];
  pendingEvents: Event[] = [];
  validatedEvents: Event[] = [];
  userId: number | null = null;
  isAdmin: boolean = false;
  isOrganizer: boolean = false;
  hasJoined: boolean = false;
  selectedGames: string[] = [];
  selectedGenres: string[] = [];
  eventsToStart: Event[] = [];
  genreOptions: string[] = [
    'FPS/TPS',
    'Sport',
    'MOBA',
    'RTS',
    'Cartes',
    'Plateforme'
  ];

  gameOptions: { [key: string]: string } = {
    balatro: 'img/Balatro.jpg',
    Cs2: 'img/CS2.png',
    fifa: 'img/fifa.png',
    lol: 'img/LoL.png',
    rocketleague: 'img/rocketLeague.png',
    starcraft2: 'img/starcraft2.png',
    supermeatboy: 'img/supermeatboy.jpg',
    valorant: 'img/valorant.png',
    pubg: 'img/pubg.jpg'
  };

  gameNames: { [key: string]: string } = {
    balatro: "Balatro",
    Cs2: "Counter Strike 2",
    fifa: "Fifa 24",
    lol: "League of Legends",
    rocketleague: "Rocket League",
    starcraft2: "Starcraft 2",
    supermeatboy: "Super Meat Boy",
    valorant: "Valorant",
    pubg: "PUBG"
  };

  GameGenres: { [key: string]: string } = {
    cs2: 'FPS/TPS',
    valorant: 'FPS/TPS',
    pubg: 'FPS/TPS',
    fifa: 'Sport',
    rocketleague: 'Sport',
    lol: 'MOBA',
    starcraft2: 'RTS',
    balatro: 'Cartes',
    supermeatboy: 'Plateforme'
  };

  selectedTabIndex: number = 0;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private eventBus: EventBusService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute
  ) {}

  ngOnInit() {
    this.route.queryParams.subscribe(params => {
      const tabParam = params['tab'];
      if (tabParam === 'liste') {
        this.selectedTabIndex = 3;
      }
    });

    this.authService.userProfile.subscribe(profile => {
      this.userId = profile?.id || null;
      this.isAdmin = this.authService.hasRole('admin');
      this.isOrganizer = this.authService.hasRole('organizer');
      this.loadEvents();
    });
    
    this.eventBus.refreshEvents$.subscribe(() => {
      this.loadEvents();
    });
    
  }

  get isConnected(): boolean {
    return this.authService.isLoggedIn();
  }

  isEventStarted(event: Event): boolean {
    return event.started === true;
  }

  loadEvents() {
    const now = new Date();
  
    this.eventService.getEvents('validated').subscribe((events: Event[]) => {
      const banChecks = events.map(e =>
        this.eventService.isUserBanned(e.id, this.userId!).pipe(
          catchError(() => of({ banned: false })),
          map(res => ({
            ...e,
            participants: e.participants || [],
            isBanned: (typeof res === 'object' && 'banned' in res) ? res.banned : false

          }))
        )
      );
      
  
      forkJoin(banChecks).subscribe(allEvents => {
        const nonTermines = allEvents.filter(event => {
          const start = new Date(event.date_time);
          const end = new Date(start.getTime() + event.duration * 60 * 60 * 1000);
          return end > now;
        });
  
        this.upcomingEvents = nonTermines.filter(e => new Date(e.date_time) > now);
        this.ongoingEvents = nonTermines.filter(e => {
          const start = new Date(e.date_time);
          const end = new Date(start.getTime() + e.duration * 60 * 60 * 1000);
          const inProgress = e.started && start <= now && end > now;
  
          return inProgress;
        });
  
        this.eventsToStart = nonTermines.filter(e => {
          const eventTime = new Date(e.date_time);
          const diffInMs = eventTime.getTime() - now.getTime();
          return !e.started && diffInMs <= 30 * 60 * 1000 && diffInMs >= 0;
        });
  
        if (this.selectedGames.length && !this.selectedGames.includes('ALL')) {
          this.upcomingEvents = this.upcomingEvents.filter(e => this.selectedGames.includes(e.title));
          this.ongoingEvents = this.ongoingEvents.filter(e => this.selectedGames.includes(e.title));
        }
  
        if (this.selectedGenres.length && !this.selectedGenres.includes('ALL')) {
          this.upcomingEvents = this.upcomingEvents.filter(e => this.selectedGenres.includes(this.GameGenres[e.title.toLowerCase()]));
          this.ongoingEvents = this.ongoingEvents.filter(e => this.selectedGenres.includes(this.GameGenres[e.title.toLowerCase()]));
        }
      });
    });
  
    if (this.isAdmin) {
      this.eventService.getEvents('pending').subscribe((events: Event[]) => {
        this.pendingEvents = events;
      });
    }
  }
  

  showStartButton(dateTime: string): boolean {
    const now = new Date();
    const start = new Date(dateTime);
    const diff = start.getTime() - now.getTime();
    return diff <= 30 * 60 * 1000 && diff >= 0;
  }

  startEvent(eventId: number) {
    this.eventService.startEvent(eventId).subscribe({
      next: () => {
        this.snackBar.open("Événement démarré avec succès !", "Fermer", { duration: 3000 });
        this.loadEvents();
      },
      error: () => {
        this.snackBar.open("Erreur lors du démarrage de l'événement.", "Fermer", { duration: 3000 });
      }
    });
  }

  applyFilter() {
    this.loadEvents();
  }

  getActionButtonType(event: Event): 'register' | 'join' | null {
    const hasStarted = new Date(event.date_time) <= new Date();
    const isRegistered = this.isUserRegistered(event);
    if (!hasStarted && !isRegistered) return 'register';
    if (hasStarted && isRegistered) return 'join';
    return null;
  }

  trackById(index: number, event: Event): number {
    return event.id;
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1).toString().padStart(2, '0')}-${date.getFullYear()} à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  validateEvent(eventId: number) {
    this.eventService.validateEvent(eventId).subscribe(() => {
      this.snackBar.open('Événement validé !', 'Fermer', { duration: 3000 });
      setTimeout(() => this.loadEvents(), 500);
    });
  }

  deleteEvent(eventId: number) {
    this.eventService.deleteEvent(eventId).subscribe(() => {
      this.snackBar.open('Événement supprimé !', 'Fermer', { duration: 3000 });
      setTimeout(() => this.loadEvents(), 500);
    });
  }

  isUserRegistered(event: Event): boolean {
    return event.participants?.some(p => p.id === this.userId) || false;
  }

  getParticipantsCount(event: Event): string {
    return `${event.participants?.length ?? 0}/${event.max_players}`;
  }

  getParticipantsOnly(event: Event): number {
    return event.participants?.length ?? 0;
  }

  hasStarted(dateTime: string): boolean {
    return new Date(dateTime) <= new Date();
  }

  joinEvent(eventId: number) {
    this.eventService.joinEvent(eventId).subscribe({
      next: () => {
        this.snackBar.open('Inscription réussie !', 'Fermer', { duration: 3000 });
        this.loadEvents();
      },
      error: (err) => {
        if (err.message === 'Vous êtes banni de cet événement.') {
          this.snackBar.open('Vous avez été banni de cet événement.', 'Fermer', { duration: 4000 });
        } else if (err.status === 409) {
          this.snackBar.open('Déjà inscrit à cet événement.', 'Fermer', { duration: 3000 });
        } else {
          this.snackBar.open('Erreur lors de l’inscription.', 'Fermer', { duration: 3000 });
        }
      }
    });
  }
  

  leaveEvent(eventId: number) {
    this.eventService.leaveEvent(eventId).subscribe(() => {
      this.snackBar.open('Désinscription réussie !', 'Fermer', { duration: 3000 });
      this.loadEvents();
    });
  }

  confirmPresence(eventId: number) {
    this.eventService.confirmJoin(eventId).subscribe(() => {
      this.snackBar.open('Présence confirmée !', 'Fermer', { duration: 3000 });
      this.loadEvents();
    });
  }

  hasUserJoined(event: Event): boolean {
    return event.participants?.some(p => p.id === this.userId && p.has_joined == true) || false;
  }

  getConfirmedCount(event: Event): number {
    return event.participants?.filter(p => p.has_joined === true).length || 0;
  }

  get canAddEvent(): boolean {
    return this.authService.hasRole('admin') || this.authService.hasRole('organizer');
  }
  
}
