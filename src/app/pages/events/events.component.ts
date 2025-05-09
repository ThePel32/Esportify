import { Component, HostListener, OnInit } from '@angular/core';
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
import { MatNativeDateModule, MatOptionModule } from '@angular/material/core';
import { ActivatedRoute, RouterModule } from '@angular/router';
import { forkJoin, of } from 'rxjs';
import { map, catchError } from 'rxjs/operators';
import { FavoritesService } from '../../service/favorites.service';
import { MatIconModule } from '@angular/material/icon';
import { GameService } from '../../service/game.service';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatInputModule } from '@angular/material/input';
import { UserService } from '../../service/user.service';

type ExtendedEvent = Event & {
  isBanned?: boolean;
  isGameBanned?: boolean;
  images?: string;
};

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
    MatIconModule,
    MatCheckboxModule,
    MatDatepickerModule,
    MatNativeDateModule,
    MatInputModule,
  ],
  templateUrl: './events.component.html',
  styleUrls: ['./events.component.css']
})

export class EventsComponent implements OnInit {
  favorites: string[] = [];
  upcomingEvents: ExtendedEvent[] = [];
  ongoingEvents: ExtendedEvent[] = [];
  pendingEvents: ExtendedEvent[] = [];
  validatedEvents: ExtendedEvent[] = [];
  eventsToStart: ExtendedEvent[] = [];
  userId: number | null = null;
  isAdmin: boolean = false;
  isOrganizer: boolean = false;
  hasJoined: boolean = false;
  allEvents: ExtendedEvent[] = [];
  organizers: { id: number; username: string }[] = [];

  selectedGames: string[] = [];
  selectedGenres: string[] = [];
  genreOptions: string[] = [];
  gamesList: { key: string, name: string }[] = [];

  selectedTabIndex: number = 0;
  selectedFavorites: boolean = false;
  selectedOrganizer: string = '';
  sortByPlayers: 'none' | 'asc' | 'desc' = 'none';


  
  isMobileView = false;
  mobileEventTabIndex = 0;
  showFilters = false;

  editEventData: Event | null = null;
  selectedDate: Date | null = null;



  constructor(
    private eventService: EventService,
    private authService: AuthService,
    private eventBus: EventBusService,
    private snackBar: MatSnackBar,
    private route: ActivatedRoute,
    private favoritesService: FavoritesService,
    private userService: UserService,
    public gameService: GameService,
  ) {}

  ngOnInit() {
    if (this.authService.isLoggedIn()) {
      this.loadOrganizers();
    }

    const allGames = this.gameService.getAllGames();

    this.isMobileView = window.innerWidth <= 768;
    window.addEventListener('resize', () => {
    this.isMobileView = window.innerWidth <= 768;
  });

    this.gamesList = Object.entries(allGames).map(([key, data]) => ({
      key,
      name: data.name
    }));

    this.genreOptions = [...new Set(Object.values(allGames).map(g => g.genre))];

    this.route.queryParams.subscribe(params => {
      const tabParam = params['tab'];
      if (tabParam === 'liste') {
        this.selectedTabIndex = 3;
      }
    });

    this.authService.userProfile.subscribe(profile => {
      this.userId = profile?.id || null;
      if (this.userId) {
        this.loadFavorites();
      }
      this.isAdmin = this.authService.hasRole('admin');
      this.isOrganizer = this.authService.hasRole('organizer');
      this.loadEvents();
    });

    this.eventBus.refreshEvents$.subscribe(() => {
      this.loadEvents();
    });
  }

  @HostListener('document:click', ['$event'])
  onClickOutside(event: MouseEvent): void {
  const target = event.target as HTMLElement;
  if (!target.closest('.mobile-filters-toggle-wrapper') && !target.closest('.mobile-filters-panel')) {
    this.showFilters = false;
  }
}

loadOrganizers() {
  this.userService.getAllOrganizers().subscribe({
      next: (data) => {
          this.organizers = data;
      },
      error: (err) => {
          console.error('Erreur lors du chargement des organisateurs', err);
      }
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
      const banChecks = events.map(e => {
        const gameKey = e.title.toLowerCase();
  
        return forkJoin({
          eventBan: this.eventService.isUserBanned(e.id, this.userId!).pipe(catchError(() => of(false))),
          gameBan: this.eventService.isUserBannedFromGame(gameKey, this.userId!).pipe(catchError(() => of(false)))
        }).pipe(
          map(({ eventBan, gameBan }) => {
            const isBanned = typeof eventBan === 'object' ? eventBan.banned : eventBan;
            const isGameBanned = typeof gameBan === 'object' ? gameBan.banned : gameBan;
  
            return {
              ...e,
              participants: e.participants || [],
              isBanned,
              isGameBanned,
              images: this.gameService.getGame(gameKey)?.image
            } as ExtendedEvent;
          })
        );
      });
  
      forkJoin(banChecks).subscribe((allEvents: ExtendedEvent[]) => {
        this.allEvents = allEvents;
        this.filterEvents();
      });
    });
  
    if (this.isAdmin) {
      this.eventService.getEvents('pending').subscribe((events: Event[]) => {
        this.pendingEvents = events.map(e => ({
          ...e,
          images: this.gameService.getGame(e.title.toLowerCase())?.image
        })) as ExtendedEvent[];
      });
    }
  }

  startEdit(event: Event) {
    this.editEventData = event;
    this.selectedTabIndex = 0;
  }
  

  filterEvents() {
    const now = new Date();
  
    let filtered = this.allEvents.filter(event => {
      const start = new Date(event.date_time);
      const end = new Date(start.getTime() + event.duration * 60 * 60 * 1000);
      return end > now;
    });
  
    if (this.selectedGames.length && !this.selectedGames.includes('ALL')) {
      filtered = filtered.filter(e => {
        const gameKey = this.gameService.getGameKeyFromTitle(e.title);
        return this.selectedGames.includes(gameKey);
      });
    }
  
    if (this.selectedGenres.length && !this.selectedGenres.includes('ALL')) {
      filtered = filtered.filter(e => {
        const genre = this.gameService.getGenre(e.title.toLowerCase());
        return this.selectedGenres.includes(genre);
      });
    }
  
    if (this.selectedFavorites) {
      filtered = filtered.filter(e => this.isFavorite(this.gameService.getGameKeyFromTitle(e.title)));
    }

    if (this.selectedDate) {
      filtered = filtered.filter(e => {
        const eventDate = new Date(e.date_time);
        return eventDate.toDateString() === this.selectedDate!.toDateString();
      });
    }
    
    if (this.selectedOrganizer.trim() !== '') {
      filtered = filtered.filter(e => {
        const organizer = e.organizer_name?.toLowerCase() || '';
        return organizer.includes(this.selectedOrganizer.toLowerCase());
      });
    }

    if (this.sortByPlayers === 'asc') {
      filtered = filtered.sort((a, b) => (a.participants?.length || 0) - (b.participants?.length || 0));
    } else if (this.sortByPlayers === 'desc') {
      filtered = filtered.sort((a, b) => (b.participants?.length || 0) - (a.participants?.length || 0));
    }

    
  
  
    this.upcomingEvents = filtered.filter(e => new Date(e.date_time) > now);
    this.ongoingEvents = filtered.filter(e => {
      const start = new Date(e.date_time);
      const end = new Date(start.getTime() + e.duration * 60 * 60 * 1000);
      return e.started && start <= now && end > now;
    });
  
    this.eventsToStart = filtered.filter(e => {
      const eventTime = new Date(e.date_time);
      const diffInMs = eventTime.getTime() - now.getTime();
      return !e.started && diffInMs <= 30 * 60 * 1000 && diffInMs >= 0;
    });
  }

  setSort(order: 'asc' | 'desc') {
    if (this.sortByPlayers === order) {
      this.sortByPlayers = 'none';
    } else {
      this.sortByPlayers = order;
    }
    this.applyFilter();
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

  loadFavorites(): void {
    this.favoritesService.getFavoritesByUser().subscribe({
      next: (res) => (this.favorites = res.map(game => game.toLowerCase())),
      error: () => (this.favorites = [])
    });
  }

  toggleFavorite(event: Event): void {
    const gameKey = event.title.toLowerCase();
    const isFav = this.favorites.includes(gameKey);

    const obs = isFav
      ? this.favoritesService.removeFavorite(gameKey)
      : this.favoritesService.addFavorite(event.id);

    obs.subscribe({
      next: () => {
        if (isFav) {
          this.favorites = this.favorites.filter(key => key !== gameKey);
        } else {
          this.favorites.push(gameKey);
        }
      }
    });
  }

  isFavorite(gameKey: string): boolean {
    return this.favorites.includes(gameKey.toLowerCase());
  }

  applyFilter() {
    this.filterEvents();
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

  isUserBanned(event: ExtendedEvent): boolean {
    return event.isBanned === true || event.isGameBanned === true;
  }

  joinEvent(event: ExtendedEvent) {
    if (this.isUserBanned(event)) {
      this.snackBar.open('Vous êtes banni de cet événement ou de ce jeu.', 'Fermer', { duration: 4000 });
      return;
    }

    if (!this.userId) return;

    const gameKey = event.title.toLowerCase();

    this.eventService.joinEvent(event.id, gameKey, this.userId).subscribe({
      next: () => {
        this.snackBar.open('Inscription réussie !', 'Fermer', { duration: 3000 });
        this.loadEvents();
      },
      error: (err) => {
        if (err.message === 'Vous êtes banni de ce jeu. Impossible de rejoindre l\'événement.') {
          this.snackBar.open(err.message, 'Fermer', { duration: 4000 });
        } else if (err.message === 'Vous êtes banni de cet événement.') {
          this.snackBar.open(err.message, 'Fermer', { duration: 4000 });
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