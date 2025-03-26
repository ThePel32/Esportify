import { Component, OnInit } from '@angular/core';
import { ActivatedRoute, Router } from '@angular/router';
import { EventService } from '../../service/event.service';
import { Event } from '../../models/event.model';
import { MatCardModule } from '@angular/material/card';
import { MatButtonModule } from '@angular/material/button';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-events-details',
  standalone: true,
  templateUrl: './events-details.component.html',
  styleUrls: ['./events-details.component.css'],
  imports: [CommonModule, MatCardModule, MatButtonModule]
})
export class EventsDetailsComponent implements OnInit {
  event: Event | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventService: EventService,
    private router: Router
  ) {}

  ngOnInit() {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.loadEventsDetails(parseInt(eventId, 10));
    }
  }

  loadEventsDetails(eventId: number) {
    this.eventService.getEventById(eventId).subscribe((event) => {
      this.event = event;
    });
  }

  goBack() {
    this.router.navigate(['/events']);
  }
}
