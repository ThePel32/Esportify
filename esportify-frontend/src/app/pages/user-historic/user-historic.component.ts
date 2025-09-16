import { FavoritesService } from './../../service/favorites.service';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../service/event.service';
import { GameService } from '../../service/game.service';
import { ScoreService } from '../../service/score.service';
import { AuthService } from '../../service/auth.service';
import { Event } from '../../models/event.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatCheckboxModule } from '@angular/material/checkbox';
import { lastValueFrom } from 'rxjs';
import { MatTabsModule } from '@angular/material/tabs';
import { ViewChild, ElementRef } from '@angular/core';

type ExtendedEvent = Event & {
  isFavorite: boolean;
  userScore?: any;
};

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
    MatTabsModule
  ],
  templateUrl: './user-historic.component.html',
  styleUrls: ['./user-historic.component.css']
})

export class UserHistoricComponent implements OnInit {
  userEvents: ExtendedEvent[] = [];
  allEndedEvents: ExtendedEvent[] = [];
  userId: number | null = null;
  selectedGames: string[] = [];
  selectedGenres: string[] = [];
  onlyFavorites: boolean = false;
  originalUserEvents: ExtendedEvent[] = [];
  originalAllEndedEvents: ExtendedEvent[] = [];
  filteredHistoricEvents: any[] = [];
  selectedResult: 'all' | 'win' | 'lose' = 'all';
  isMobile = false;
  showFilters = false;

  gamesList: [string, { name: string; image: string; genre: string }][] = [];

  @ViewChild('filtersContainer') filtersRef!: ElementRef;
  @ViewChild('toggleFiltersBtn') toggleBtnRef!: ElementRef;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
    public gameService: GameService,
    private favoritesService: FavoritesService,
    private scoreService: ScoreService,
  ) {}

  ngOnInit(): void {
    this.gamesList = Object.entries(this.gameService.getAllGames());
    this.userId = this.authService.userProfile.value?.id || null;
    this.isMobile = window.innerWidth <= 768;

    window.addEventListener('resize', () => {
      this.isMobile = window.innerWidth <= 768;
    });

    if (this.userId) {
      Promise.all([
        lastValueFrom(this.eventService.getHistoricForUser(this.userId)),
        lastValueFrom(this.eventService.getAllEndedEvents()),
        lastValueFrom(this.favoritesService.getFavoritesByUser())
      ]).then(async ([userEvents, allEvents, favorites]) => {
        this.originalUserEvents = this.markFavorites(userEvents || [], favorites || []);
        this.originalAllEndedEvents = this.markFavorites(allEvents || [], favorites || []);

        await Promise.all(this.originalUserEvents.map(async (event: any) => {
          const score = await lastValueFrom(this.scoreService.getScoreForUser(event.id, this.userId!));
          if (score) {
            const metadata = typeof score.metadata === 'string' ? JSON.parse(score.metadata) : score.metadata;
            const gameKey = this.gameService.getGameKeyFromTitle(event.title.toLowerCase());

            let result = 'lose';

            if (['fifa', 'rocketleague', 'cs2', 'valorant'].includes(gameKey)) {
              const main = parseInt(metadata.score, 10) || 0;
              const opp = parseInt(metadata.score_opponent, 10) || 0;
              result = main > opp ? 'win' : 'lose';
            } else if (gameKey === 'pubg') {
              result = metadata.place === 1 ? 'win' : 'lose';
            } else if (gameKey === 'supermeatboy') {
              const userTime = score.score;
              const allScores = await lastValueFrom(this.scoreService.getScoresForEvent(event.id));
              const bestTime = Math.min(...allScores.map(s => s.score || 9999));
              result = userTime === bestTime ? 'win' : 'lose';
            } else if (gameKey === 'balatro') {
              const userPoints = metadata.points || 0;
              const allScores = await lastValueFrom(this.scoreService.getScoresForEvent(event.id));
              const bestPoints = Math.max(...allScores.map(s => {
                const meta = typeof s.metadata === 'string' ? JSON.parse(s.metadata) : s.metadata;
                return meta.points || 0;
              }));
              result = userPoints === bestPoints ? 'win' : 'lose';
            } else if (gameKey === 'lol') {
              const ratio = (metadata.kills || 0) + (metadata.assists || 0) - (metadata.deaths || 0);
              const allScores = await lastValueFrom(this.scoreService.getScoresForEvent(event.id));
              const bestRatio = Math.max(...allScores.map(s => {
                const meta = typeof s.metadata === 'string' ? JSON.parse(s.metadata) : s.metadata;
                return (meta.kills || 0) + (meta.assists || 0) - (meta.deaths || 0);
              }));
              result = ratio === bestRatio ? 'win' : 'lose';
            }

            event.userScore = { ...score, metadata, result };
          }
        }));

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
  
    const filterFn = (event: ExtendedEvent) => {
      const gameKey = this.gameService.getGameKeyFromTitle(event.title.toLowerCase());
      const genre = this.gameService.getGenre(gameKey);
      const isGameMatch = selectedGamesSet.size === 0 || selectedGamesSet.has(gameKey);
      const isGenreMatch = selectedGenresSet.size === 0 || selectedGenresSet.has(genre);
      const isFavoriteMatch = !this.onlyFavorites || event.isFavorite;
      const isResultMatch = 
        this.selectedResult === 'all' ||
        (event.userScore?.result === this.selectedResult);
  
      return isGameMatch && isGenreMatch && isFavoriteMatch && isResultMatch;
    };
  
    this.userEvents = this.originalUserEvents.filter(filterFn);
    this.allEndedEvents = this.originalAllEndedEvents.filter(filterFn);
  }
  
  getGameKeyFromTitle(title: string): string {
    return this.gameService.getGameKeyFromTitle(title);
  }

  private markFavorites(events: Event[], favorites: string[]): ExtendedEvent[] {
    return events.map(event => {
      const gameKey = this.gameService.getGameKeyFromTitle(event.title.toLowerCase());
      return { ...event, isFavorite: favorites.includes(gameKey) };
    });
  }
}