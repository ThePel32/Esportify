import { NgxDaterangepickerMd } from 'ngx-daterangepicker-material';
import { Component, OnInit, ViewChild, HostListener } from '@angular/core';
import { RouterModule, RouterOutlet } from '@angular/router';
import { MatDrawer, MatSidenavModule } from '@angular/material/sidenav';
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
  isMobile: boolean = false;
  currentYear: number = new Date().getFullYear();

  constructor (
    private auth: AuthService,
    private cdRef: ChangeDetectorRef    
  ) {}

  @ViewChild('drawer') drawer!: MatDrawer;

  ngOnInit(): void {
    this.checkIfMobile();
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

  @HostListener('window:resize')
  onResize() {
    this.checkIfMobile();
  }

  checkIfMobile() {
    this.isMobile = window.innerWidth <= 768;
  }

  toggleDrawer() {
    if (this.drawer) {
      this.drawer.toggle();
    }
  }

  logout() {
    this.auth.logout();
    this.isLoggedIn = false;
    this.pseudo = '';
  }
}