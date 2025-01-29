import { Component } from '@angular/core';
import { FormControl, FormGroupDirective, FormsModule, NgForm, ReactiveFormsModule, Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { AuthService } from '../../service/auth.service';

export class SigninErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }

}

@Component({
  selector: 'app-signin',
  imports: [
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
    private auth: AuthService
  ) {

  }
  loginEmailFormControl = new FormControl('', [
      Validators.required,
      Validators.email
    ])
    
  loginPasswordFormControl = new FormControl('', [
    Validators.required
  ])
    matcher = new SigninErrorStateMatcher();

    signup(): void {
      this.auth.signin({
        email: this.loginEmailFormControl.getRawValue() as string, 
        password: this.loginPasswordFormControl.getRawValue() as string
      }).pipe().subscribe();
    }
}

