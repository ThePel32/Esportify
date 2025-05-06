import {Component} from '@angular/core';
import { SigninComponent } from '../../components/signin/signin.component';
import { SignupComponent } from '../../components/signup/signup.component';
import {MatDividerModule} from '@angular/material/divider';

@Component({
  selector: 'login.component',
  standalone: true,
  styleUrls: ['login.component.css'],
  templateUrl: 'login.component.html',
  imports: [
    SignupComponent,
    SigninComponent,
    MatDividerModule
  ],
})
export class LoginComponent {
}