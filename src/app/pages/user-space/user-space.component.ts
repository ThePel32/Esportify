import { CommonModule } from '@angular/common';
import { AuthService } from './../../service/auth.service';
import { UserService } from './../../service/user.service';
import { Component, OnInit } from '@angular/core';

@Component({
  selector: 'app-user-space',
  imports: [CommonModule],
  templateUrl: './user-space.component.html',
  styleUrl: './user-space.component.css'
})
export class UserSpaceComponent implements OnInit {
  users: any[] = [];
  isAdmin: boolean = false;

  constructor(private userService: UserService, private authService: AuthService) {}

  ngOnInit(): void {
    
    this.checkAdminRole();

    if (this.isAdmin) {
        this.loadUsers();
    }
}


  checkAdminRole(): void {
    const role = this.authService.getRole();
    this.isAdmin = role ? role.toLowerCase() === "admin" : false;
  }

  loadUsers(): void {
    this.userService.getAllUsers().subscribe(
      (data) => {
        this.users = data;
      },
      (error) => {
        console.error("Erreur lors du chargement des utilisateurs:", error);
      }
    );
}


changeRole(user: any, event: Event): void {
  const newRole = (event.target as HTMLSelectElement).value;
  console.log(`Changement de rôle pour l'utilisateur ${user.id} vers ${newRole}`);

  this.userService.updateUserRole(user.id, { role: newRole }).subscribe(
      (response) => {
          console.log("Rôle mis à jour avec succès:", response);
          user.role = newRole;
      },
      (error) => {
          console.error("Erreur lors de la mise à jour du rôle:", error);
      }
  );
}

  deleteUser(userId: number): void {
    console.log(`Suppression de l'utilisateur: ${userId}`);
    this.userService.deleteUser(userId).subscribe(
      () => {
        console.log('Utilisateur supprimé avec succès');
        this.users = this.users.filter(user => user.id !== userId);
      },
      (error) => {
        console.error('Erreur lors de la suppression:', error);
      }
    );
  }
  
}
