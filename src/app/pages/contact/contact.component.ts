import { MatSnackBar } from '@angular/material/snack-bar';
import { Component, OnInit } from '@angular/core';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatInputModule } from '@angular/material/input';
import { MatFormFieldModule } from '@angular/material/form-field';
import { Observable, of } from 'rxjs';
import { CommonModule } from '@angular/common';
import { ContactService } from '../../service/contact.service';
import {
  FormControl,
  FormGroupDirective,
  NgForm,
  Validators,
  FormsModule,
  ReactiveFormsModule,
  } from '@angular/forms';

export class ContactErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));    
  }
};
@Component({
  selector: 'app-contact',
  standalone: true,
  imports: [
    CommonModule,
    MatInputModule,
    MatFormFieldModule,
    FormsModule,
    ReactiveFormsModule,
  ],
  templateUrl: './contact.component.html',
  styleUrls: ['./contact.component.css']
})

export class ContactComponent implements OnInit {
  emailFormControl = new FormControl('', [Validators.required,Validators.email]);
  messageFormControl = new FormControl('', [Validators.required]);
  user$: Observable<any> | undefined;

  constructor(
    private contactService: ContactService, 
    private snackBar: MatSnackBar
  ) {}

  sendMessage() {
    if (this.emailFormControl.valid && this.messageFormControl.valid) {
      const formData = {
        email: this.emailFormControl.value ?? '',
        message: this.messageFormControl.value ?? ''
      };

      this.contactService.sendMessage(formData).subscribe({
        next: () => {
          this.snackBar.open('Message envoyé avec succès !', 'Fermer', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        },
        error: (err) => {
          this.snackBar.open('Erreur lors de l\'envoi du message.', 'Fermer', {
            duration: 3000,
            verticalPosition: 'top',
            horizontalPosition: 'center',
          });
        },
      });
    } else {
    }
  }
  
  ngOnInit(): void {
    const userData = { name: '', email: '' };
    this.user$ = of(userData);
  }
  
  matcher = new ContactErrorStateMatcher();
}