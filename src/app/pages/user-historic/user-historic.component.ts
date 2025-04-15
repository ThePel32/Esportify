import { Component, OnInit } from '@angular/core';
import { EventService } from '../../service/event.service';
import { AuthService } from '../../service/auth.service';
import { Event } from '../../models/event.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { FormsModule } from '@angular/forms';
import { MatIconModule } from '@angular/material/icon';

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
    MatIconModule
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

  gameOptions: { [key: string]: string } = {
    balatro: 'img/Balatro.jpg',
    cs2: 'img/CS2.png',
    fifa: 'img/Fifa.png',
    lol: 'img/LoL.png',
    rocketLeague: 'img/rocketLeague.png',
    starcraft2: 'img/starcraft2.png',
    supermeatboy: 'img/supermeatboy.jpg',
    valorant: 'img/valorant.png',
    pubg: 'img/pubg.jpg',
  };

  gameNames: { [key: string]: string } = {
    balatro: 'Balatro',
    cs2: 'Counter Strike 2',
    fifa: 'Fifa 24',
    lol: 'League of Legends',
    rocketLeague: 'Rocket League',
    starcraft2: 'Starcraft 2',
    supermeatboy: 'Super meat boy',
    valorant: 'Valorant',
    pubg: 'PUBG'
  };

  gameGenres: { [key: string]: string } = {
    cs2: 'FPS/TPS',
    valorant: 'FPS/TPS',
    pubg: 'FPS/TPS',
    fifa: 'Sport',
    rocketLeague: 'Sport',
    lol: 'MOBA',
    starcraft2: 'RTS',
    balatro: 'Cartes',
    supermeatboy: 'Plateforme'
  }

  constructor(
    private eventService: EventService,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.userId = this.authService.userProfile.value?.id || null;

    if (this.userId) {
      this.eventService.getHistoricForUser(this.userId).subscribe({
        next: (events) => {
          this.originalUserEvents = events;
          this.userEvents = events;
        },
        error: () => {
          console.error("Erreur lors du chargement de l'historique d'événements.");
        }
      });

      this.eventService.getAllEndedEvents().subscribe({
        next: (events) => {
          this.originalAllEndedEvents = events;
          this.allEndedEvents = events;
        },
        error: () => {
          console.error("Erreur lors du chargement de tous les événements terminés.");
        }
      });
    }
  }

  formatDate(dateString: string): string {
    const date = new Date(dateString);
    return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
      .toString().padStart(2, '0')}-${date.getFullYear()} à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
  }

  uniqueGenres(): string[] {
    return Array.from(new Set(Object.values(this.gameGenres)));
  }

  applyFilter(): void {
    const selectedGamesSet = new Set(this.selectedGames);
    const selectedGenresSet = new Set(this.selectedGenres);

    const filterFn = (event: Event) => {
      const gameKey = this.getGameKeyFromTitle(event.title.toLowerCase());
      const genre = this.gameGenres[gameKey];
      const isGameMatch = selectedGamesSet.size === 0 || selectedGamesSet.has(gameKey);
      const isGenreMatch = selectedGenresSet.size === 0 || selectedGenresSet.has(genre);
      const isFavoriteMatch = !this.onlyFavorites || event.isFavorite;

      return isGameMatch && isGenreMatch && isFavoriteMatch;
    };

    this.userEvents = this.originalUserEvents.filter(filterFn);
    this.allEndedEvents = this.originalAllEndedEvents.filter(filterFn);
  }

  getGameKeyFromTitle(title: string): string {
    return Object.keys(this.gameNames).find(key =>
      this.gameNames[key].toLowerCase() === title.toLowerCase()
    ) || title;
  }
}
