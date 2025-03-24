import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { Component, OnInit } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatSidenavModule } from '@angular/material/sidenav';
import { MatIconModule } from '@angular/material/icon';
import { MatButtonModule } from '@angular/material/button';
import { MatToolbarModule } from '@angular/material/toolbar';
import { AuthService } from './service/auth.service';
import { CommonModule } from '@angular/common';
import { MatSnackBarModule } from '@angular/material/snack-bar';
import { ChangeDetectorRef } from '@angular/core';

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
    MatSnackBarModule,
    NgxDaterangepickerMd
  ],
  templateUrl: './app.component.html',
  styleUrl: './app.component.css'
})
export class AppComponent implements OnInit{
  isLoggedIn: any;
  pseudo: string = '';
  constructor (
    private auth: AuthService,
    private cdRef: ChangeDetectorRef    
  ) {}

  ngOnInit(): void {
    this.auth.userProfile.subscribe(user => {
      if (user) {
        this.isLoggedIn = this.auth.isAuthenticated();
        
        this.pseudo = user?.user?.username || user?.username || '';

      } else {
        this.isLoggedIn = false;
        this.pseudo = '';
      }

      this.cdRef.detectChanges();
    });

    this.auth.loadUserFromLocalStorage();
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.pseudo = '';
  }
}
