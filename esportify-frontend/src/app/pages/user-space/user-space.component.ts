import { CommonModule } from '@angular/common';
import { Component, OnInit } from '@angular/core';
import { AuthService } from './../../service/auth.service';
import { UserService } from './../../service/user.service';
import { HttpClient } from '@angular/common/http';
import { RouterModule } from '@angular/router';
import { GameService } from '../../service/game.service';
import { MatTabsModule } from '@angular/material/tabs';
import { MatCardModule } from '@angular/material/card';
import { MatFormFieldModule } from '@angular/material/form-field';
import { FormsModule } from '@angular/forms';
import { MatInputModule } from '@angular/material/input';
import { FavoritesService } from '../../service/favorites.service';
import { registerLocaleData } from '@angular/common';
import { MatSnackBar, MatSnackBarModule } from '@angular/material/snack-bar';
import localeFr from '@angular/common/locales/fr';
import { environment } from '../../../environments/environment';

registerLocaleData(localeFr);

@Component({
  selector: 'app-user-space',
  standalone: true,
  imports: [
    CommonModule, 
    RouterModule,
    MatTabsModule,
    MatCardModule,
    MatFormFieldModule,
    FormsModule,
    MatInputModule,
    MatSnackBarModule
  ],
  templateUrl: './user-space.component.html',
  styleUrls: ['./user-space.component.css']
})
export class UserSpaceComponent implements OnInit {
  private apiUrl = environment.apiUrl;


  users: any[] = [];
  bannedUsers: any[] = [];
  favoriteGames: any[] = [];
  userProfile: any;
  newPassword: string = '';
  confirmPassword: string = '';

  isAdmin: boolean = false;
  isOrganizer: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private http: HttpClient,
    private gameService: GameService,
    private favoritesService: FavoritesService,
    private snackBar: MatSnackBar,
  ) {}

  ngOnInit(): void {
    this.authService.getUserProfile().subscribe({
      next: (user) => {
        this.userProfile = user;
        this.checkRoles();
        this.loadFavorites();
        this.loadBannedUsers();
        if (this.isAdmin) {
          this.loadUsers();
        }
      },
      error: (err) => {
        console.error('Erreur chargement profil:', err);
      }
    });

    this.checkRoles();
    this.loadFavorites();
    this.loadBannedUsers();

    if (this.isAdmin) {
      this.loadUsers();
    }
  }

  checkRoles(): void {
    const role = this.authService.getRole();
    this.isAdmin = role?.toLowerCase() === "admin";
    this.isOrganizer = role?.toLowerCase() === "organizer";
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe({
      next: (data) => this.users = data,
      error: (err) => console.error("Erreur chargement utilisateurs:", err)
    });
  }

  changeRole(user: any, event: Event): void {
    const newRole = (event.target as HTMLSelectElement).value;
    this.userService.updateUserRole(user.id, { role: newRole }).subscribe({
      next: () => user.role = newRole,
      error: (err) => console.error("Erreur mise à jour rôle:", err)
    });
  }

  deleteUser(userId: number): void {
    this.userService.deleteUser(userId).subscribe({
      next: () => {
        this.users = this.users.filter(u => u.id !== userId);
        this.snackBar.open("Utilisateur supprimé avec succès", "Fermer", {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
      },
      error: (err) => {
        console.error("Erreur suppression utilisateur:", err);
        console.log("Contenu error.error :", err.error);
        const msg = err?.error?.message || err?.message || 'Erreur inconnue.';
        this.snackBar.open(msg, 'Fermer', {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }

  loadFavorites(): void {
    const userId = this.userProfile?.id;
    if (!userId) return;
  
    this.favoritesService.getFavoritesByUser().subscribe({
      next: (games) => {
        const gameMap = this.gameService.getAllGames();
        this.favoriteGames = games.map(gameKey => ({
          key: gameKey,
          name: gameMap[gameKey]?.name || gameKey,
          image: gameMap[gameKey]?.image
        }));
      },
      error: (err) => console.error('Erreur chargement favoris', err)
    });
  }
  
  removeFromFavorites(gameKey: string): void {
    this.favoritesService.removeFavorite(gameKey).subscribe({
      next: () => {
        this.favoriteGames = this.favoriteGames.filter(f => f.key !== gameKey);
      },
      error: (err) => console.error('Erreur suppression favori', err)
    });
  }
  
  loadBannedUsers(): void {
    this.http.get<any[]>(`${this.apiUrl}/event-bans`).subscribe({
      next: (res) => this.bannedUsers = res,
      error: (err) => console.error("Erreur chargement bannis:", err)
    });
  }

  unbanUser(userId: number, eventId: number): void {
    this.http.delete(`${this.apiUrl}/event-bans/${eventId}/unban/${userId}`).subscribe({
      next: () => {
        this.bannedUsers = this.bannedUsers.filter(b => b.user_id !== userId || b.event_id !== eventId);
      },
      error: (err) => console.error("Erreur débannissement:", err)
    });
  }

  changePassword(): void {
    const userId = this.userProfile?.id;
    if (this.newPassword !== this.confirmPassword) {
      this.snackBar.open("Les mots de passe ne correspondent pas.", "Fermer", {
        duration: 3000,
        panelClass: ['snackbar-error']
      });
      return;
    }

    this.http.patch(`${this.apiUrl}/users/${userId}/password`, {
      password: this.newPassword
    }).subscribe({
      next: () => {
        this.snackBar.open("Mot de passe mis à jour avec succès !", "Fermer", {
          duration: 3000,
          panelClass: ['snackbar-success']
        });
        this.newPassword = '';
        this.confirmPassword = '';
      },
      error: (err) => {
        console.error("Erreur MAJ mot de passe", err);
        this.snackBar.open("Erreur lors de la mise à jour du mot de passe.", "Fermer", {
          duration: 3000,
          panelClass: ['snackbar-error']
        });
      }
    });
  }
}