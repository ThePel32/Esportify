import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './service/auth.service';
import { CommonModule } from '@angular/common';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [
    RouterModule,
    RouterOutlet,
    MatSidenavModule,
    MatToolbarModule, 
    MatButtonModule, 
    MatIconModule,
    CommonModule,   
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  isLoggedIn$: any; 
  constructor (
    private auth: AuthService,
    
  ) {}
  ngOnInit(): void {
    this.isLoggedIn$ = this.auth.loadUserFromLocalStorage();
  }
}
