import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../service/auth.service';
import { map } from 'rxjs';
import { Router } from '@angular/router';
import { CommonModule } from '@angular/common';

export class SigninErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}

@Component({
  selector: 'app-signin',
  imports: [
    CommonModule,
    MatFormFieldModule,
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule,        
  ],
  templateUrl: './signin.component.html',
  styleUrl: './signin.component.css'
})

export class SigninComponent {
  constructor (
    private auth: AuthService,
    private router: Router 
  ) {}

  loginEmailFormControl = new FormControl('', [
      Validators.required,
      Validators.email
    ])
    
  loginPasswordFormControl = new FormControl('', [
    Validators.required
  ])
    matcher = new SigninErrorStateMatcher();

    signin(): void {
      this.auth.signin({
        email: this.loginEmailFormControl.getRawValue() as string, 
        password: this.loginPasswordFormControl.getRawValue() as string
      }).pipe(
        map((response) => {
          this.auth.saveUserToLocalStorage(response);
          this.auth.userProfile.next(response);
          this.router.navigate(["home"]);
        })
      ).subscribe({
        next: response => {
          console.log('Connexion réussie', response);
        },
        error: err => {
          console.error('Erreur lors de la connexion', err);
    
          if (err.status === 401) {
            this.loginPasswordFormControl.setErrors({ invalidPassword: true });
          }
        }
      });
    }
    
}

