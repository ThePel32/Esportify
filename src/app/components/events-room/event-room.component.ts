import { SocketService } from './../../service/socket.service';
import { ChangeDetectorRef, Component, OnInit } from '@angular/core';
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
import { ViewChild, ElementRef } from '@angular/core';

type ExtendedScore = Score & {
  displayScore?: string;
};

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
  userScore: Score | null = null;
  topScores: ExtendedScore[] = [];
  eventScores: any[] = [];
  isFavorite: boolean = false;
  gameKey: string = '';
  messages: { user: string; content: string }[] = [];
  newMessage: string = '';
  isChatOpen = false;
  isMobileView = window.innerWidth <= 768;

  @ViewChild('chatMessagesContainer') chatMessagesContainer!: ElementRef;

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
    private cdr: ChangeDetectorRef,
    private SocketService: SocketService
  ) {}

  ngOnInit(): void {
    this.eventId = Number(this.route.snapshot.paramMap.get('id'));
    this.userId = this.authService.userProfile.value?.id || null;
  
    this.SocketService.connect();
    this.loadMessages();

    this.SocketService.onReceiveMessage((message: any) => {
      this.messages.push(message);
      this.scrollToBottom();
    });
    
  
    window.addEventListener('beforeunload', () => {
      this.SocketService.disconnect();
    });
  
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

    window.addEventListener('resize', this.updateMobileView.bind(this));
    this.updateMobileView();
  }

  updateMobileView(): void {
    this.isMobileView = window.innerWidth <= 768;
  }
  
  ngOnDestroy(): void {
    this.SocketService.disconnect();
  }

  initRoom(): void {
    this.isAdmin = this.authService.hasRole('admin');
    this.isOrganizer = this.authService.hasRole('organizer');
    this.loadEvent();
    this.loadScores();
    this.loadTopScores(() => {
    this.loadUserScore();
    });

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
        this.cdr.detectChanges();
        this.gameType = event.title.toLowerCase();
        this.gameKey = this.gameType;
        this.eventData.images = this.gameService.getGameImage(this.gameType);
        this.loadFavoriteStatus();
        this.isLoading = false;
      }
    });
    this.loadTopScores();
  }
  
  isStarted(): boolean {
    return !!this.eventData?.started;
  }

  isUserRegistered(): boolean {
    return this.eventData?.participants?.some(p => p.id === this.userId) || false;
  }

  hasUserJoined(): boolean {
    return this.eventData?.participants?.some(p => p.id === this.userId && !!p.has_joined) || false;
  }

  isEventStarted(): boolean {
    const now = new Date();
    const start = new Date(this.eventData?.date_time);
    return now >= start && (this.eventData.started ?? false);
  }

  joinEvent(): void {
    if (!this.userId || !this.eventData) return;

    this.eventService.joinEvent(this.eventId, this.gameKey, this.userId).subscribe(() => {
      this.snackBar.open('Inscription réussie !', 'Fermer', { duration: 3000 });
      this.loadEvent();
    });
  }

  leaveEvent(): void {
    this.eventService.leaveEvent(this.eventId).subscribe(() => {
      this.snackBar.open('Désinscription réussie !', 'Fermer', { duration: 3000 });
      this.loadEvent();
    });
  }

  confirmPresence(): void {
    if (!this.eventId || !this.userId) return;

    this.eventService.confirmJoin(this.eventId).subscribe(() => {
      this.snackBar.open('Présence confirmée !', 'Fermer', { duration: 3000 });

      this.eventService.getEventById(this.eventId).subscribe((updatedEvent) => {
        this.eventData = {
          ...updatedEvent,
          participants: updatedEvent.participants || [],
          organizer_name: updatedEvent.organizer_name || 'Inconnu',
          images: this.gameService.getGameImage(updatedEvent.title.toLowerCase())
        };
        this.cdr.detectChanges();
      });
    });
  }

  getActionLabel(): string {
    if (!this.eventData || !this.userId) return '';

    if (!this.isEventStarted()) {
      return this.isUserRegistered() ? 'Se désinscrire' : "S'inscrire";
    } else {
      return this.hasUserJoined() ? 'Rejoint !' : 'Rejoindre';
    }
  }

  handleActionClick(): void {
    if (!this.eventData || !this.userId) return;

    if (!this.isEventStarted()) {
      this.isUserRegistered() ? this.leaveEvent() : this.joinEvent();
    } else {
      if (!this.hasUserJoined()) this.confirmPresence();
    }
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
    this.loadEvent();
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
        const rawScore = this.getMainScoreFromMetadata(metadata);
        const gameKey = this.gameType;
  
        const userScore: Score = {
          ...score,
          metadata,
          score: rawScore
        };
  
        let result: 'win' | 'lose' = 'lose';
  
        if (['fifa', 'rocketleague', 'cs2', 'valorant'].includes(gameKey)) {
          const playerScore = parseInt(metadata.score, 10) || 0;
          const opponentScore = parseInt(metadata.score_opponent, 10) || 0;
          result = playerScore > opponentScore ? 'win' : 'lose';
  
        } else if (gameKey === 'pubg') {
          result = metadata.place === 1 ? 'win' : 'lose';
  
        } else if (gameKey === 'supermeatboy') {
          const myTime = parseInt(userScore.score as any, 10);
          const best = Math.min(...this.topScores.map(s => parseInt(s.score as any, 10)));
          result = myTime <= best ? 'win' : 'lose';
  
        } else if (gameKey === 'lol') {
          const myScore = (metadata.kills || 0) + (metadata.assists || 0) - (metadata.deaths || 0);
          const best = Math.max(...this.topScores.map(s => {
            const m = s.metadata;
            return (m.kills || 0) + (m.assists || 0) - (m.deaths || 0);
          }));
          result = myScore >= best ? 'win' : 'lose';
  
        } else if (gameKey === 'balatro') {
          const best = Math.max(...this.topScores.map(s => s.score || 0));
          result = userScore.score >= best ? 'win' : 'lose';
          
        } else if (gameKey === 'starcraft2') {
          result = metadata.win ? 'win' : 'lose';
        }
        
        this.userScore = { ...userScore, result };
      },
      error: (err) => {
        console.error('Erreur récupération score utilisateur', err);
      }
    });
    this.loadEvent();
  }

  loadTopScores(callback?: () => void): void {
    this.scoreService.getTopScoresForEvent(this.eventId).subscribe({
      next: (scores) => {
        const type = this.gameType;
        const parsed: ExtendedScore[] = scores.map((s: any) => {
          const metadata = typeof s.metadata === 'string' ? JSON.parse(s.metadata) : s.metadata;
          const scoreValue = this.getMainScoreFromMetadata(metadata);
          let displayScore = '';
  
          if (type === 'supermeatboy') displayScore = this.formatSecondsToTime(scoreValue);
          else if (type === 'lol') displayScore = `${metadata.kills || 0}/${metadata.assists || 0}/${metadata.deaths || 0}`;
          else if (['fifa', 'rocketleague', 'cs2', 'valorant'].includes(type)) displayScore = `${metadata.score || 0} - ${metadata.score_opponent || 0}`;
          else if (type === 'pubg') displayScore = `Place : ${metadata.place || '?'}`;
          else if (type === 'balatro') displayScore = `${metadata.points || 0} pts`;
          else displayScore = scoreValue.toString();
  
          return { ...s, metadata, score: scoreValue, displayScore };
        });
  
        this.topScores = parsed.sort((a, b) => {
          if (['cs2', 'valorant'].includes(type)) return (b.metadata.roundsWon || 0) - (a.metadata.roundsWon || 0);
          if (type === 'starcraft2') return (b.metadata.win ? 1 : 0) - (a.metadata.win ? 1 : 0);
          if (type === 'pubg') return (a.metadata.place || 100) - (b.metadata.place || 100);
          if (type === 'supermeatboy') return a.score - b.score;
          if (type === 'lol') {
            const scoreA = (a.metadata.kills || 0) + (a.metadata.assists || 0) - (a.metadata.deaths || 0);
            const scoreB = (b.metadata.kills || 0) + (b.metadata.assists || 0) - (b.metadata.deaths || 0);
            return scoreB - scoreA;
          }
          return (b.score || 0) - (a.score || 0);
        });
  
        if (callback) callback();
      },
      error: (err) => {
        console.error('Erreur récupération top scores', err);
        if (callback) callback();
      }
    });
  }

  getMainScoreFromMetadata(metadata: any): number {
    const type = this.gameType;
  
    if (['cs2', 'valorant'].includes(type)) return metadata.roundsWon || 0;
  
    if (type === 'pubg') return metadata.place || 100;
  
    if (['fifa', 'rocketleague'].includes(type)) {
      return parseInt(metadata.score, 10) || 0;
    }
  
    if (type === 'supermeatboy') {
      const [min, sec] = (metadata.time || '0:0').split(':').map(Number);
      return (min || 0) * 60 + (sec || 0);
    }
  
    if (type === 'lol') {
      const kills = metadata.kills || 0;
      const assists = metadata.assists || 0;
      const deaths = metadata.deaths || 0;
      return kills + assists - deaths;
    }
  
    if (type === 'balatro') return metadata.points || 0;
    if (type === 'starcraft2') return metadata.win ? 1 : 0;
    return 0;
  }
  
  formatSecondsToTime(seconds: number): string {
    const min = Math.floor(seconds / 60);
    const sec = seconds % 60;
    return `${min.toString().padStart(2, '0')}:${sec.toString().padStart(2, '0')}`;
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

  allScoresEntered(): boolean {
    if (!this.eventData || !this.eventData.participants) return false;
    const participantIds = this.eventData.participants.map(p => p.id);
    const scoredUserIds = this.eventScores.map(s => s.user_id);
    return participantIds.every(id => scoredUserIds.includes(id));
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

  getOpponentReferenceScore(): number {
    return 0;
  }
  
  isBestTime(myTime: number): boolean {
    if (!this.allScoresEntered()) return false;
    return this.topScores.length > 0 && this.topScores[0].user_id === this.userId;
  }
  
  isHighestScore(myScore: number): boolean {
    if (!this.allScoresEntered()) return false;
    return this.topScores.length > 0 && this.topScores[0].user_id === this.userId;
  }
  
  isBestLoLScore(metadata: any): boolean {
    if (!this.allScoresEntered()) return false;
    const myScore = (metadata.kills || 0) + (metadata.assists || 0) - (metadata.deaths || 0);
    const topScore = this.topScores[0];
    const top = (topScore?.metadata?.kills || 0) + (topScore?.metadata?.assists || 0) - (topScore?.metadata?.deaths || 0);
    return topScore?.user_id === this.userId && myScore >= top;
  }

  loadMessages(): void {
    this.messages = [];
  
    this.eventService.getMessages(this.eventId).subscribe({
      next: (messages: any[]) => {
        this.messages = messages.map(m => ({
          user: m.username,
          content: m.content,
          send_at: m.send_at
        }));
        this.scrollToBottom();
      },
      error: (err) => {
        console.error('Erreur chargement messages', err);
      }
    });
  }
  
  sendMessage(): void {
    if (this.newMessage.trim()) {
      const messageData = {
        event_id: this.eventId,
        user_id: this.userId,
        user: this.authService.userProfile.value?.username,
        content: this.newMessage.trim()
      };
      this.SocketService.sendMessage(messageData);
      this.newMessage = '';
      this.scrollToBottom();
    }
  }
  
  scrollToBottom(): void {
    setTimeout(() => {
      if (this.chatMessagesContainer) {
        this.chatMessagesContainer.nativeElement.scrollTop = this.chatMessagesContainer.nativeElement.scrollHeight;
      }
    }, 0);
  }
}