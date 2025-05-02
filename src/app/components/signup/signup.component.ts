import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../service/auth.service';
import { Router } from '@angular/router';

export class SignupErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}

@Component({
  selector: 'app-signup',
  imports: [
      FormsModule, 
      MatFormFieldModule, 
      MatInputModule,
      ReactiveFormsModule,
  ],
  templateUrl: './signup.component.html',
  styleUrl: './signup.component.css'
})

export class SignupComponent {
  constructor (
    private auth: AuthService,
    private router: Router
  ){}

  signupUsernameFormControl = new FormControl('', [
    Validators.required,
  ]);

  signupEmailFormControl = new FormControl('', [
    Validators.required, 
    Validators.email
  ]);
  
  signupPasswordFormControl = new FormControl('', [
    Validators.required,
  ]);

  matcher = new SignupErrorStateMatcher();

  signup(): void {
    const username = this.signupUsernameFormControl.getRawValue() as string;
    const email = this.signupEmailFormControl.getRawValue() as string;
    const password = this.signupPasswordFormControl.getRawValue() as string;
  
    this.auth.signup({
      username,
      email,
      password
    }).subscribe({
      next: () => {
        this.auth.signin({ email, password }).subscribe({
          next: (loginResponse) => {
            this.auth.saveUserToLocalStorage(loginResponse.user);
            this.auth.userProfile.next(loginResponse.user);
            this.router.navigate(['home']);
          },
          error: (loginErr) => {
            console.error('Erreur lors de la connexion après inscription', loginErr);
          }
        });
      },
      error: (err) => {
        console.error('Erreur lors de l\'inscription', err);
      }
    });
  }
}