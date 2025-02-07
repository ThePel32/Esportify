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
import { MatSnackBar } from '@angular/material/snack-bar';



@Component({
  selector: 'app-add-event',
  providers: [
    { provide: MAT_DATE_LOCALE, useValue: 'fr-FR' },
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
    MatCardModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css'
})
export class AddEventComponent {
  eventForm: FormGroup;
  submittedEvent: any = null;
  currentParticipants: number = 0;

  allParticipantsOptions: number[] = this.generateParticipantsOptions();
  filteredParticipantsOptions: number[] = [];
  eventTypeOptions: string[] = [
    "Speedrun",
    "1 vs 1",
    "2 vs 2",
    "3 vs 3",
    "4 vs 4",
    "5 vs 5",
    "Battle Royale",
  ];

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
  };

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
  };

  today = new Date();

  constructor(private fb: FormBuilder, private snackBar: MatSnackBar) {
    this.eventForm = this.fb.group({
      jeu: ['', Validators.required],
      nbParticipants: ['', Validators.required],
      type: ['', Validators.required],
      dateDebut: ['', Validators.required],
      heureDebut: ['', Validators.required],
      dateFin: ['', Validators.required],
      heureFin: ['', Validators.required],
    },
    // { validators: this.validateEndTime }
    );

    this.eventForm.get('type')?.valueChanges.subscribe(type => {
      this.updateParticipantsOptions(type);
    });

    this.eventForm.get('dateDebut')?.valueChanges.subscribe(() => {
      this.updateEndDateConstraints();
    });

    this.eventForm.get('dateFin')?.valueChanges.subscribe(() => {
      this.updateEndTimeConstraints();
    });
  }

  generateParticipantsOptions(): number[] {
    const participants = [];
    
    for (let i = 2; i <= 20; i += 1) {
      participants.push(i);
    }
    
    for (let i = 30; i <= 100; i += 10) {
      participants.push(i);
    }
    
    return participants;
  }

  dateFilter = (d: Date | null): boolean => {
    const date = (d || new Date());
    return date >= this.today;
  };

  updateParticipantsOptions(type: string) {
    if (!type) return;

    if (type === "Battle Royale") {
      this.filteredParticipantsOptions = [...this.allParticipantsOptions];
    } else if (type === "Speedrun"){
      this.filteredParticipantsOptions = [...this.allParticipantsOptions];
    } else if (type === "1 vs 1") {
      this.filteredParticipantsOptions = this.allParticipantsOptions.filter(n => n % 2 === 0);
    } else {
      const playersPerTeam = parseInt(type.split(' ')[0], 10);
      const totalPlayersRequired = playersPerTeam * 2;
      this.filteredParticipantsOptions = this.allParticipantsOptions.filter(n => n % totalPlayersRequired === 0);
    }

    if (!this.filteredParticipantsOptions.includes(this.eventForm.get('nbParticipants')?.value)) {
      this.eventForm.get('nbParticipants')?.setValue('');
    }
  }

  updateEndDateConstraints() {
    const dateDebut = this.eventForm.get('dateDebut')?.value;
    if (dateDebut) {
      this.eventForm.get('dateFin')?.setValidators([
        Validators.required,
        (control) => new Date(control.value) < new Date(dateDebut) ? { invalidEndDate: true } : null
      ]);
      this.eventForm.get('dateFin')?.updateValueAndValidity();
    }
  }

  updateEndTimeConstraints() {
    const dateDebut = this.eventForm.get('dateDebut')?.value;
    const heureDebut = this.eventForm.get('heureDebut')?.value;

    if (dateDebut && heureDebut) {
      this.eventForm.get('heureFin')?.setValidators([
        Validators.required,
        (control) => control.value <= heureDebut ? { invalidEndTime: true } : null
      ]);
      this.eventForm.get('heureFin')?.updateValueAndValidity();
    }
  }

  validateTournament(group: FormGroup) {
    const type = group.get('type')?.value;
    const nbParticipants = group.get('nbParticipants')?.value;

    if (!type || !nbParticipants) return null;
    if (type.includes('vs')) {
      const playersPerTeam = parseInt(type.split(' ')[0], 10);
      const totalPlayersRequired = playersPerTeam * 2;

      if (nbParticipants % totalPlayersRequired !== 0) {
        return { invalidParticipants: true };
      }
    } else if (type === "1 vs 1" && nbParticipants % 2 !== 0) {
      return { invalidParticipants: true };
    }
    return null;
  }

  onSubmit() {
    if (this.eventForm.valid) {
      this.submittedEvent = { ...this.eventForm.value };
      this.snackBar.open('Événement soumis avec succès !', 'Fermer', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    } else {
      this.snackBar.open('Erreur de validation. Veuillez vérifier les champs.', 'Fermer', {
        duration: 3000,
        verticalPosition: 'top',
        horizontalPosition: 'center'
      });
    }
  }
}
