import {Component} from '@angular/core';
import {MatInputModule} from '@angular/material/input';
import {MatFormFieldModule} from '@angular/material/form-field';
import { 
  FormControl, 
  FormGroupDirective, 
  FormsModule, 
  NgForm, 
  ReactiveFormsModule, 
  Validators } from '@angular/forms';
import { ErrorStateMatcher } from '@angular/material/core';
import { AuthService } from '../../service/auth.service';

export class LoginErrorStateMatcher implements ErrorStateMatcher {
  isErrorState(control: FormControl | null, form: FormGroupDirective | NgForm | null): boolean {
    const isSubmitted = form && form.submitted;
    return !!(control && control.invalid && (control.dirty || control.touched || isSubmitted));
  }
}
@Component({
  selector: 'login.component',
  styleUrl: 'login.component.css',
  templateUrl: 'login.component.html',
  imports: [
    FormsModule, 
    MatFormFieldModule, 
    MatInputModule,
    ReactiveFormsModule,
  ],
})
export class LoginComponent {
  signupEmailFormControl = new FormControl('', [
    Validators.required, 
    Validators.email
  ]);
  signupUsernameFormControl = new FormControl('', [
    Validators.required, 
    Validators.email
  ]);
  signupPasswordFormControl = new FormControl('', [
    Validators.required, 
    Validators.email
  ]);

  loginEmailFormControl = new FormControl('', [
    Validators.required,
    Validators.email
  ])

  matcher = new LoginErrorStateMatcher();
  
}
