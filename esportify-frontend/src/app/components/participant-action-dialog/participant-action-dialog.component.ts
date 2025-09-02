import { Component, Inject } from '@angular/core';
import { MAT_DIALOG_DATA, MatDialogRef } from '@angular/material/dialog';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';

@Component({
  selector: 'app-participant-action-dialog',
  standalone: true,
  templateUrl: './participant-action-dialog.component.html',
  styleUrls: ['./participant-action-dialog.component.css'],
  imports: [CommonModule, MatButtonModule]
})
export class ParticipantActionDialogComponent {
  constructor(
    @Inject(MAT_DIALOG_DATA) public data: { userId: number; username: string; canModerate: boolean },
    private dialogRef: MatDialogRef<ParticipantActionDialogComponent>
  ) {}

  kick(): void {
    this.dialogRef.close({ action: 'kick', userId: this.data.userId });
  }

  ban(): void {
    this.dialogRef.close({ action: 'ban', userId: this.data.userId });
  }

  close(): void {
    this.dialogRef.close();
  }
}