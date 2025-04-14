import { EventService } from './../../service/event.service';
import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { FormBuilder, FormGroup, Validators, ReactiveFormsModule } from '@angular/forms';
import { ScoreService } from '../../service/score.service';
import { CommonModule, NgFor } from '@angular/common';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatSelectModule } from '@angular/material/select';
import { MatOptionModule } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatRadioModule } from '@angular/material/radio';

@Component({
  selector: 'app-score-entry-dialog',
  templateUrl: './score-entry-dialog.component.html',
  styleUrls: ['./score-entry-dialog.component.css'],
  standalone: true,
  imports: [
    CommonModule,
    ReactiveFormsModule,
    MatFormFieldModule,
    MatSelectModule,
    MatOptionModule,
    MatInputModule,
    MatButtonModule,
    MatRadioModule,
    NgFor,
  ]
})
export class ScoreEntryDialogComponent {
  scoreForm!: FormGroup;
  participants: any[] = [];

  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { eventId: number, gameType: string },
    public dialogRef: MatDialogRef<ScoreEntryDialogComponent>,
    private fb: FormBuilder,
    private scoreService: ScoreService,
    private eventService: EventService
  ) {
    this.initForm();
    this.loadParticipants();
  }

  initForm() {
    const baseControls = {
      user_id: [null, Validators.required],
      result: ['win', Validators.required],
    };

    const gameControls: { [key: string]: any } = {
      'fifa': {
        score: ['', Validators.required],
        score_opponent: ['', Validators.required],
      },
      'rocketleague': {
        score: ['', Validators.required],
        score_opponent: ['', Validators.required],
      },
      'cs2': {
        kills: [0, Validators.required],
        score: ['', Validators.required],
        score_opponent: ['', Validators.required],
      },
      'valorant': {
        kills: [0, Validators.required],
        score: ['', Validators.required],
        score_opponent: ['', Validators.required],
      },
      'supermeatboy': {
        time: ['', Validators.required],
      },
      'pubg': {
        kills: [0, Validators.required],
        place: [0, Validators.required],
      },
      'lol': {
        kills: [0, Validators.required],
        assists: [0, Validators.required],
        deaths: [0, Validators.required],
      },
      'starcraft2': {}, // seulement result
      'balatro': {
        points: [0, Validators.required],
      },
    };

    const controls = {
      ...baseControls,
      ...(gameControls[this.data.gameType] || {})
    };

    this.scoreForm = this.fb.group(controls);
  }

  loadParticipants() {
    this.eventService.getEventById(this.data.eventId).subscribe({
      next: (event) => {
        this.participants = event.participants || [];
      },
      error: () => {
        console.error("Erreur lors du chargement des participants");
      }
    });
  }

  getScoreFromForm(): number {
    const values = this.scoreForm.value;
    const type = this.data.gameType;

    if (['fifa', 'rocketleague'].includes(type)) {
      return parseInt(values.score, 10) || 0;
    }

    if (['cs2', 'valorant'].includes(type)) {
      return parseInt(values.score, 10) || 0;
    }

    if (type === 'supermeatboy') {
      return this.timeToSeconds(values.time);
    }

    if (type === 'pubg' || type === 'lol') {
      return values.kills;
    }

    if (type === 'balatro') {
      return values.points;
    }

    return 0;
  }

  timeToSeconds(timeStr: string): number {
    const [minutes, seconds] = timeStr.split(':').map(Number);
    return (minutes || 0) * 60 + (seconds || 0);
  }

  onSubmit() {
    if (this.scoreForm.invalid) return;

    const formValues = this.scoreForm.value;
    const metadata = { ...formValues };
    delete metadata.user_id;
    delete metadata.result;

    const payload = {
      user_id: formValues.user_id,
      event_id: this.data.eventId,
      score: this.getScoreFromForm(),
      result: formValues.result,
      metadata,
    };

    this.scoreService.addScore(payload).subscribe({
      next: () => this.dialogRef.close('success'),
      error: () => alert('Erreur lors de l’enregistrement du score.')
    });
  }

  onCancel(): void {
    this.dialogRef.close();
  }
}
