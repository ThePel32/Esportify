import { Component, OnInit } from '@angular/core';
import { EventService } from '../../service/event.service';
import { AuthService } from '../../service/auth.service';
import { Event } from '../../models/event.model';
import { CommonModule, NgFor, NgIf } from '@angular/common';
import { MatCardModule } from '@angular/material/card';
import { RouterModule } from '@angular/router';


@Component({
  selector: 'app-user-historic',
  imports: [
    CommonModule,
    RouterModule,
    NgFor,
    NgIf,
    MatCardModule,
  ],
  templateUrl: './user-historic.component.html',
  styleUrls: ['./user-historic.component.css']
})
export class UserHistoricComponent implements OnInit{
  userEvents: Event[] = [];
  allEndedEvents: Event[] = [];
  userId: number | null = null;

  constructor(
    private eventService: EventService,
    private authService: AuthService,
  ) {}


    ngOnInit(): void {
      this.userId = this.authService.userProfile.value?.id || null;

      if (this.userId) {
        this.eventService.getHistoricForUser(this.userId).subscribe({
          next: (events) => {
            this.userEvents = events;
            console.log('Événements de l\'utilisateur :', this.userEvents);
          },
          error: () => {
            console.error("Erreur lors du chargement de l'historique d'événements.");
          }
        });

        this.eventService.getAllEndedEvents().subscribe({
          next: (events) => {
            this.allEndedEvents = events;
            console.log('Tous les événments terminés :', this.allEndedEvents);
          },
          error: () => {
            console.error("Erreur lors du chargement de tous les événments terminés.");
          }
        });
      }
    }

    formatDate(dateString: string): string {
      const date = new Date(dateString);
      return `${date.getDate().toString().padStart(2, '0')}-${(date.getMonth() + 1)
        .toString().padStart(2, '0')}-${date.getFullYear()} à ${date.getHours().toString().padStart(2, '0')}:${date.getMinutes().toString().padStart(2, '0')}`;
    }
}
