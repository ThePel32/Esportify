import { FavoritesService } from './../../service/favorites.service';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../service/event.service';
import { GameService } from '../../service/game.service';
import { AuthService } from '../../service/auth.service';
import { Event } from '../../models/event.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';

@Component({
  selector: 'app-user-historic',
  standalone: true,
  imports: [
    CommonModule,
    RouterModule,
    NgFor,
    NgIf,
    MatCardModule,
    MatFormFieldModule,
    MatSelectModule,
    FormsModule,
    MatCheckboxModule,
  ],
  templateUrl: './user-historic.component.html',
  styleUrls: ['./user-historic.component.css']
})
export class UserHistoricComponent implements OnInit {
  userEvents: Event[] = [];
  allEndedEvents: Event[] = [];
  userId: number | null = null;
  selectedGames: string[] = [];
  selectedGenres: string[] = [];
  onlyFavorites: boolean = false;
  originalUserEvents: Event[] = [];
  originalAllEndedEvents: Event[] = [];

  gamesList: [string, { name: string; image: string; genre: string }][] = [];

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    public gameService: GameService,
    private favoritesService: FavoritesService,
    
  ) {}

  ngOnInit(): void {
    this.gamesList = Object.entries(this.gameService.getAllGames());
    this.userId = this.authService.userProfile.value?.id || null;
  
    if (this.userId) {
      Promise.all([
        this.eventService.getHistoricForUser(this.userId).toPromise(),
        this.eventService.getAllEndedEvents().toPromise(),
        this.favoritesService.getFavoritesByUser().toPromise()
      ]).then(([userEvents, allEvents, favorites]) => {
  
        this.originalUserEvents = this.markFavorites(userEvents || [], favorites || []);
        this.originalAllEndedEvents = this.markFavorites(allEvents || [], favorites || []);
  
        this.userEvents = [...this.originalUserEvents];
        this.allEndedEvents = [...this.originalAllEndedEvents];
  
        this.applyFilter();
      }).catch(() => {
        console.error("Erreur lors du chargement de l'historique ou des favoris.");
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString().padStart(2, '0')}-${date.getFullYear()} à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  uniqueGenres(): string[] {
    const all = Object.values(this.gameService.getAllGames()).map(g => g.genre);
    return Array.from(new Set(all));
  }

  applyFilter(): void {
    const selectedGamesSet = new Set(this.selectedGames);
    const selectedGenresSet = new Set(this.selectedGenres);

    const filterFn = (event: Event) => {
      const gameKey = this.gameService.getGameKeyFromTitle(event.title.toLowerCase());
      const genre = this.gameService.getGenre(gameKey);
      const isGameMatch = selectedGamesSet.size === 0 || selectedGamesSet.has(gameKey);
      const isGenreMatch = selectedGenresSet.size === 0 || selectedGenresSet.has(genre);
      const isFavoriteMatch = !this.onlyFavorites || event.isFavorite;

      return isGameMatch && isGenreMatch && isFavoriteMatch;
    };

    this.userEvents = this.originalUserEvents.filter(filterFn);
    this.allEndedEvents = this.originalAllEndedEvents.filter(filterFn);
  }

  getGameKeyFromTitle(title: string): string {
    return this.gameService.getGameKeyFromTitle(title);
  }
  private markFavorites(events: Event[], favorites: string[]): Event[] {
    return events.map(event => {
      const gameKey = this.gameService.getGameKeyFromTitle(event.title.toLowerCase());
      return { ...event, isFavorite: favorites.includes(gameKey) };
    });
  }
}
