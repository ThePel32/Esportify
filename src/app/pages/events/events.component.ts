import { Component } from '@angular/core';
import { AddEventComponent } from '../../components/add-event/add-event.component';

@Component({
  selector: 'app-events',
  imports: [AddEventComponent],
  templateUrl: './events.component.html',
  styleUrl: './events.component.css'
})
export class EventsComponent {

}
