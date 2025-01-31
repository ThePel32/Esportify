import { ChangeDetectionStrategy, Component } from '@angular/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MAT_DATE_LOCALE } from '@angular/material/core';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatCardModule } from '@angular/material/card';
import { provideNativeDateAdapter } from '@angular/material/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-add-event',
  providers: [
    {provide: MAT_DATE_LOCALE, useValue: 'fr-FR'},
    provideNativeDateAdapter()
  ],
  imports: [
    CommonModule,
    MatFormFieldModule,
    MatInputModule,
    MatSelectModule,
    MatDatepickerModule,
    MatTimepickerModule,
    ReactiveFormsModule,
    MatCardModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css'
})
export class AddEventComponent {
  eventForm: FormGroup;
  submittedEvent: any = null;

  gameOptions: { [key: string]: string } = {
    balatro: 'img/Balatro.jpg',
    Cs2: 'img/CS2.png',
    fifa: 'img/fifa.png',
    lol: 'img/LoL.png',
    rocketleague: 'img/rocketLeague.png',
    starcraft2: 'img/starcraft2.png',
    supermeatboy: 'img/supermeatboy.jpg',
    valorant: 'img/valorant.png',
    pubg: 'img/pubg.jpg',
  }

  gameNames: { [key: string]: string } = {
    balatro: "Balatro", 
    Cs2: "Counter Strike 2", 
    fifa: "Fifa 24", 
    lol: "League of Legends", 
    rocketleague: "Rocket League", 
    starcraft2: "Starcraft 2", 
    valorant: "Valorant", 
    supermeatboy: "Super Meat Boy", 
    pubg: "PUBG",
  }
  

  participantsOptions: number [] = [2, 4, 6, 8, 10, 12, 14, 16, 18, 20];

  eventTypeOptions: string [] = [
    "Speedrun", 
    "1 vs 1", 
    "2 vs 2", 
    "3 vs 3", 
    "4 vs 4", 
    "5 vs 5", 
    "Battle Royale",
  ]

  constructor(
    private fb: FormBuilder
  ) {
    this.eventForm = this.fb.group({
      jeu:['', Validators.required],
      nbParticipants: ['', Validators.required],
      type: ['', Validators.required],
      dateDebut: ['', Validators.required],
      heureDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      heureFin: ['', Validators.required],
    })
  }

  

  onSubmit() {
    if (this.eventForm.valid) {
      
      this.submittedEvent = { ...this.eventForm.value};
      console.log("Événement soumis :", this.submittedEvent);
    }
  }
}