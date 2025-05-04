import { ChangeDetectionStrategy, Component, EventEmitter, Input, Output, OnChanges, SimpleChanges } from '@angular/core';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { CommonModule } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatSelectModule } from '@angular/material/select';
import { MatDatepickerModule } from '@angular/material/datepicker';
import { MatTimepickerModule } from '@angular/material/timepicker';
import { MatCardModule } from '@angular/material/card';
import { MAT_DATE_LOCALE, DateAdapter } from '@angular/material/core';
import { MatSnackBar } from '@angular/material/snack-bar';
import { provideNativeDateAdapter } from '@angular/material/core';
import { EventService } from '../../service/event.service';
import { AuthService } from '../../service/auth.service';
import { EventBusService } from '../../service/event-bus.service';

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
    MatCardModule,
    ReactiveFormsModule
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './add-event.component.html',
  styleUrl: './add-event.component.css'
})
export class AddEventComponent implements OnChanges {
  @Input() eventToEdit: any = null;
  @Output() eventAdded = new EventEmitter<void>();

  eventForm: FormGroup;
  submittedEvent: any = null;
  currentParticipants: number = 0;
  minDate: Date = new Date();
  hourOptions: string[] = [];
  durationOptions: number[] = [];

  gameOptions: { [key: string]: string } = {
    balatro: 'assets/img/Balatro.jpg',
    Cs2: 'assets/img/CS2.png',
    fifa: 'assets/img/fifa.png',
    lol: 'assets/img/LoL.png',
    rocketleague: 'assets/img/rocketLeague.png',
    starcraft2: 'assets/img/starcraft2.png',
    supermeatboy: 'assets/img/supermeatboy.jpg',
    valorant: 'assets/img/valorant.png',
    pubg: 'assets/img/pubg.jpg',
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

  participantOptions: number[] = [];

  constructor(
    private fb: FormBuilder, 
    private snackBar: MatSnackBar, 
    private eventService: EventService,
    private authService: AuthService,
    private dateAdapter: DateAdapter<Date>,
    private eventBus: EventBusService,
  ) {
    this.dateAdapter.setLocale('fr-FR');

    this.eventForm = this.fb.group({
      jeu: ['', Validators.required],
      nbParticipants: ['', Validators.required],
      description: ['', Validators.required],
      date: ['', [Validators.required, this.dateValidator.bind(this)]],
      heureDebut: ['', [Validators.required, this.hourValidator.bind(this)]],
      duration: ['', Validators.required],
    });

    this.participantOptions = this.generateParticipantsOptions();
    this.durationOptions = this.generateDurationOptions();
    this.generateHourOptions();
  }

  ngOnChanges(changes: SimpleChanges): void {
    if (changes['eventToEdit'] && this.eventToEdit) {
      const event = this.eventToEdit;

      const eventDate = new Date(event.date_time);
      const heureDebut = `${eventDate.getHours().toString().padStart(2, '0')}:${eventDate.getMinutes().toString().padStart(2, '0')}`;

      this.eventForm.patchValue({
        jeu: event.title,
        nbParticipants: event.max_players,
        description: event.description,
        date: eventDate,
        heureDebut,
        duration: event.duration,
      });
    }
  }

  generateHourOptions() {
    for (let h = 0; h < 24; h++) {
      for (let m of [0, 30]) {
        const hour = h.toString().padStart(2, '0');
        const min = m.toString().padStart(2, '0');
        this.hourOptions.push(`${hour}:${min}`);
      }
    }
  }

  generateDurationOptions(): number[] {
    const options: number[] = [];
    for (let i = 1; i <= 24; i++) {
      options.push(i);
    }
    return options;
  }

  generateParticipantsOptions(): number[] {
    const options: number[] = [];
    for (let i = 2; i <= 20; i++) options.push(i);
    for (let i = 30; i <= 100; i += 10) options.push(i);
    return options;
  }

  dateValidator(control: any) {
    if (!control.value) return null;
    const selectedDate = new Date(control.value);
    const today = new Date();
    today.setHours(0, 0, 0, 0);
    return selectedDate >= today ? null : { invalidDate: true };
  }

  hourValidator(control: any) {
    if (!control.value || !this.eventForm.get('date')?.value) return null;
    const selectedDate = new Date(this.eventForm.get('date')?.value);
    const today = new Date();
    if (selectedDate.toDateString() === today.toDateString()) {
      const [selectedHour, selectedMinute] = control.value.split(':').map(Number);
      const now = new Date();
      now.setHours(now.getHours() + 1);
      const selectedTime = new Date();
      selectedTime.setHours(selectedHour, selectedMinute, 0);
      return selectedTime >= now ? null : { invalidHour: true };
    }
    return null;
  }

  get canAddEvent(): boolean {
    return this.authService.hasRole('admin') || this.authService.hasRole('organizer');
  }

  onSubmit() {
    if (this.eventForm.valid) {
      const selectedGame = this.eventForm.value.jeu;
      const gameImage = this.gameOptions[selectedGame];

      const dateOnly = new Date(this.eventForm.value.date);
      const [hours, minutes] = this.eventForm.value.heureDebut.split(':').map(Number);

      const localDateTime = new Date(
        dateOnly.getFullYear(),
        dateOnly.getMonth(),
        dateOnly.getDate(),
        hours,
        minutes,
        0,
        0
      );

      const pad = (n: number) => n.toString().padStart(2, '0');
      const formattedDateTime = `${localDateTime.getFullYear()}-${pad(localDateTime.getMonth() + 1)}-${pad(localDateTime.getDate())} ${pad(localDateTime.getHours())}:${pad(localDateTime.getMinutes())}:00`;

      const formData = {
        title: selectedGame,
        description: this.eventForm.value.description,
        date_time: formattedDateTime,
        max_players: this.eventForm.value.nbParticipants,
        state: 'pending',
        images: gameImage,
        duration: this.eventForm.value.duration,
        organizer_id: this.authService.userProfile.value?.id || null
      };

      if (this.eventToEdit) {
        this.eventService.updateEvent(this.eventToEdit.id, formData).subscribe({
          next: () => {
            this.snackBar.open('Événement modifié avec succès !', 'Fermer', { duration: 3000 });
            this.eventBus.emitRefreshEvents();
          },
          error: () => {
            this.snackBar.open('Erreur lors de la modification.', 'Fermer', { duration: 3000 });
          }
        });
      } else {
        this.eventService.addEvent(formData).subscribe({
          next: () => {
            this.snackBar.open('Événement soumis avec succès !', 'Fermer', { duration: 3000 });
            this.eventForm.reset();
            this.eventAdded.emit();
            this.eventBus.emitRefreshEvents();
          },
          error: () => {
            this.snackBar.open('Erreur lors de l\'ajout de l\'événement.', 'Fermer', { duration: 3000 });
          }
        });
      }
    }
  }
}
