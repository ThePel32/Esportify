import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../service/event.service';
import { AuthService } from '../../service/auth.service';
import { Event } from '../../models/event.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatDialog } from '@angular/material/dialog';
import { MatSnackBar } from '@angular/material/snack-bar';
import { ScoreService } from '../../service/score.service';
import { ScoreEntryDialogComponent } from '../score-entry-dialog/score-entry-dialog.component';
import { ParticipantActionDialogComponent } from '../participant-action-dialog/participant-action-dialog.component';
import { Score } from '../../models/score.model';
import { GameService } from '../../service/game.service';
import { FavoritesService } from '../../service/favorites.service';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'app-event-room',
  standalone: true,
  templateUrl: './event-room.component.html',
  styleUrls: ['./event-room.component.css'],
  imports: [
    CommonModule, 
    FormsModule, 
    NgIf, 
    NgFor,
    MatIconModule,
  ]
})
export class EventRoomComponent implements OnInit {
  eventId!: number;
  eventData!: Event;
  isLoading = true;
  isBanned = false;
  userId: number | null = null;
  isAdmin = false;
  isOrganizer = false;
  gameType = '';
  score: any = {};
  showScoreOverlay = false;
  userScore: Score | null = null;
  topScores: Score[] = [];
  eventScores: any[] = [];
  isFavorite: boolean = false;
  gameKey: string = '';

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private authService: AuthService,
    private dialog: MatDialog,
    private scoreService: ScoreService,
    public router: Router,
    private snackBar: MatSnackBar,
    private gameService: GameService,
    private favoritesService: FavoritesService,
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = this.authService.userProfile.value?.id || null;
    

    if (this.userId) {
      this.eventService.isUserBanned(this.eventId, this.userId).subscribe({
        next: (res) => {
          this.isBanned = typeof res === 'object' && 'banned' in res ? res.banned : !!res;
          if (this.isBanned) {
            this.snackBar.open('Vous avez été banni de cet événement.', 'Fermer', { duration: 4000 });
            this.router.navigate(['/events'], { queryParams: { tab: 'liste' } });
          } else {
            this.initRoom();
          }
        },
        error: (err) => {
          console.error("Erreur lors de la vérification du bannissement :", err);
          this.initRoom();
        }
      });
    }
  }

  initRoom(): void {
    this.isAdmin = this.authService.hasRole('admin');
    this.isOrganizer = this.authService.hasRole('organizer');
    this.loadEvent();
    this.loadScores();
    this.loadUserScore();
    this.loadTopScores();
  }

  loadFavoriteStatus(): void {
    this.favoritesService.getFavoritesByUser().subscribe({
      next: (favorites) => {
        this.isFavorite = favorites.includes(this.gameKey);
      },
      error: () => {
        this.isFavorite = false;
      }
    });
  }
  
  toggleFavorite(): void {
    const obs = this.isFavorite
      ? this.favoritesService.removeFavorite(this.gameKey)
      : this.favoritesService.addFavorite(this.eventId);
  
    obs.subscribe({
      next: () => {
        this.isFavorite = !this.isFavorite;
        this.snackBar.open(
          this.isFavorite ? 'Ajouté aux favoris !' : 'Retiré des favoris.',
          'Fermer',
          { duration: 3000 }
        );
      },
      error: () => {
        this.snackBar.open("Erreur lors de la mise à jour des favoris", 'Fermer', { duration: 3000 });
      }
    });
  }
  

  loadEvent(): void {
    this.eventService.getEventById(this.eventId).subscribe({
      next: (event) => {

        this.eventData = {
          ...event,
          participants: event.participants || [],
          organizer_name: event.organizer_name || 'Inconnu'
        };

        this.gameType = event.title.toLowerCase();
        this.gameKey = this.gameType;
        this.eventData.images = this.gameService.getGameImage(this.gameType);
        this.loadFavoriteStatus();
        this.isLoading = false;
        
      }
    });
  }

  loadScores(): void {
    this.scoreService.getScoresForEvent(this.eventId).subscribe({
      next: (scores: any[]) => {
        this.eventScores = scores;
      },
      error: (err: any) => {
        console.error('Erreur lors du chargement des scores :', err);
      }
    });
  }

  loadUserScore(): void {
    if (!this.userId) return;
    this.scoreService.getScoreForUser(this.eventId, this.userId).subscribe({
      next: (score) => {
        if (!score) {
          this.userScore = null;
          return;
        }

        const metadata = typeof score.metadata === 'string' ? JSON.parse(score.metadata) : score.metadata;
        this.userScore = {
          ...score,
          metadata,
          score: this.getMainScoreFromMetadata(metadata)
        } as Score;
      },
      error: (err) => {
        console.error('Erreur récupération score utilisateur', err);
      }
    });
  }

  loadTopScores(): void {
    this.scoreService.getTopScoresForEvent(this.eventId).subscribe({
      next: (scores) => {
        this.topScores = scores
          .map((s: any) => {
            const metadata = typeof s.metadata === 'string' ? JSON.parse(s.metadata) : s.metadata;
            return {
              ...s,
              metadata,
              score: this.getMainScoreFromMetadata(metadata)
            } as Score;
          })
          .sort((a, b) => {
            if (['cs2', 'valorant'].includes(this.gameType)) {
              return (b.metadata.roundsWon || 0) - (a.metadata.roundsWon || 0);
            }
            return (b.score || 0) - (a.score || 0);
          });
      },
      error: (err) => {
        console.error('Erreur récupération top scores', err);
      }
    });
  }

  getMainScoreFromMetadata(metadata: any): number {
    const type = this.gameType;
    if (['cs2', 'valorant'].includes(type)) return metadata.roundsWon || 0;
    if (type === 'pubg') return metadata.place || 100;
    if (['fifa', 'rocketleague'].includes(type)) {
      const parts = (metadata.score || '').split('-');
      return parseInt(parts[0], 10) || 0;
    }
    if (type === 'supermeatboy') {
      const [min, sec] = (metadata.time || '0:0').split(':').map(Number);
      return (min || 0) * 60 + (sec || 0);
    }
    if (type === 'lol') return metadata.kills || 0;
    if (type === 'balatro') return metadata.points || 0;
    return 0;
  }

  getGameType(): string {
    return this.gameType;
  }

  isOver(): boolean {
    if (!this.eventData) return false;
    const start = new Date(this.eventData.date_time);
    const end = new Date(start.getTime() + this.eventData.duration * 60 * 60 * 1000);
    return new Date() > end;
  }

  get canEnterScore(): boolean {
    return this.isAdmin || this.isOrganizer;
  }

  openScoreDialog(): void {
    const dialogRef = this.dialog.open(ScoreEntryDialogComponent, {
      width: '400px',
      data: {
        eventId: this.eventId,
        gameType: this.gameType,
      }
    });

    dialogRef.afterClosed().subscribe((result: string | undefined) => {
      if (result === 'success') this.loadScores();
    });
  }

  openParticipantMenu(participant: any): void {
    const dialogRef = this.dialog.open(ParticipantActionDialogComponent, {
      width: '300px',
      data: {
        userId: participant.id,
        username: participant.username,
        canModerate: this.canEnterScore
      }
    });

    dialogRef.afterClosed().subscribe(result => {
      if (result?.action === 'kick') {
        this.eventService.kickParticipant(this.eventId, result.userId).subscribe(() => {
          this.eventData.participants = this.eventData.participants.filter(p => p.id !== result.userId);
        });
      } else if (result?.action === 'ban') {
        this.eventService.banUser(this.eventId, result.userId).subscribe(() => {
          this.eventData.participants = this.eventData.participants.filter(p => p.id !== result.userId);
        });
      }
    });
  }

  openScoreOverlay(): void {
    this.showScoreOverlay = true;
  }

  closeScoreOverlay(): void {
    this.showScoreOverlay = false;
  }

  submitScore(): void {
    this.closeScoreOverlay();
  }
}
