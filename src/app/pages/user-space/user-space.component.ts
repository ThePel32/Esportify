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
  ],
  templateUrl: './user-space.component.html',
  styleUrls: ['./user-space.component.css']
})
export class UserSpaceComponent implements OnInit {
  users: any[] = [];
  bannedUsers: any[] = [];
  favoriteGames: any[] = [];
  userProfile: any;
  newPassword: string = '';

  isAdmin: boolean = false;
  isOrganizer: boolean = false;

  constructor(
    private userService: UserService,
    private authService: AuthService,
    private http: HttpClient,
    private gameService: GameService
  ) {}

  ngOnInit(): void {
    this.userProfile = this.authService.userProfile.value;
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

  /** --- Liste des utilisateurs (admin) --- */
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
      next: () => this.users = this.users.filter(u => u.id !== userId),
      error: (err) => console.error("Erreur suppression utilisateur:", err)
    });
  }

  /** --- Favoris --- */
  loadFavorites(): void {
    const userId = this.userProfile?.id;
    if (!userId) return;
  
    this.http.get<string[]>(`http://localhost:3000/api/favorites`).subscribe({
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
    this.http.request('delete', `http://localhost:3000/api/favorites`, {
      body: { event_id: gameKey }
    }).subscribe({
      next: () => {
        this.favoriteGames = this.favoriteGames.filter(f => f.key !== gameKey);
      },
      error: (err) => console.error('Erreur suppression favori', err)
    });
  }
  


  /** --- Liste des bannis --- */
  loadBannedUsers(): void {
    this.http.get<any[]>(`http://localhost:3000/api/event-bans`).subscribe({
      next: (res) => this.bannedUsers = res,
      error: (err) => console.error("Erreur chargement bannis:", err)
    });
  }

  unbanUser(userId: number, eventId: number): void {
    this.http.delete(`http://localhost:3000/api/event-bans/${eventId}/${userId}`).subscribe({
      next: () => {
        this.bannedUsers = this.bannedUsers.filter(b => b.user_id !== userId || b.event_id !== eventId);
      },
      error: (err) => console.error("Erreur débannissement:", err)
    });
  }

  /** --- Changement de mot de passe --- */
  changePassword(): void {
    const userId = this.userProfile?.id;
    this.http.patch(`http://localhost:3000/api/users/${userId}/password`, {
      password: this.newPassword
    }).subscribe({
      next: () => alert("Mot de passe mis à jour !"),
      error: (err) => console.error("Erreur MAJ mot de passe", err)
    });
  }
}
