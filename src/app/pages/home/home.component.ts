import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { EventService } from '../../service/event.service';
import { Event } from '../../models/event.model';

@Component({
  selector: 'app-home',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './home.component.html',
  styleUrls: ['./home.component.css']
})

export class HomeComponent implements OnInit {
  upcomingEvents: Event[] = [];
  ongoingEvents: Event[] = [];
slideImages: string[] = [
  'img/Balatro.jpg',
  'img/CS2.png',
  'img/fifa.png',
  'img/LoL.png',
  'img/rocketLeague.png',
  'img/starcraft2.png',
  'img/valorant.png',
  'img/pubg.jpg',
  'img/supermeatboy.jpg'
];
clonedSlideImages: string[] = [];
currentSlideIndex = 0;
slideInterval: any;
  

  constructor(private eventService: EventService) {}

  ngOnInit(): void {
    this.clonedSlideImages = [...this.slideImages, ...this.slideImages];
    this.startSlider();
    
    this.eventService.getEventsByState('validated').subscribe((events: Event[]) => {
      const now = new Date();
      this.upcomingEvents = events.filter((event: Event) => new Date(event.date_time) > now);
      this.ongoingEvents = events.filter((event: Event) => {
        const eventDate = new Date(event.date_time);
        const endDate = new Date(eventDate.getTime() + event.duration * 60 * 60 * 1000);
        console.log("now", now, "event", event.date_time, "end", endDate);
        return eventDate <= now && now < endDate;

      });
    });
    
  }

  startSlider(): void {
    const totalSlides = this.slideImages.length;
    this.slideInterval = setInterval(() => {
      this.currentSlideIndex++;
      if (this.currentSlideIndex >= this.clonedSlideImages.length) {
        this.currentSlideIndex = totalSlides;
      }
    }, 3000);
  }
}
