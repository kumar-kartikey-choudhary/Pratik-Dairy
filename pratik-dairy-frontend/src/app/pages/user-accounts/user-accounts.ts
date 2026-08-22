import { environment } from '../../../environments/environment';
import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { HttpClient } from '@angular/common/http';
import { AuthService } from '../../service/login/auth-service';
import type { UserDto } from '../../model';

@Component({
  selector: 'app-user-account',
  templateUrl: './user-accounts.html',
  styleUrls: ['./user-accounts.css'],
  standalone: true,
  imports: [CommonModule, FormsModule],
})
export class UserAccounts implements OnInit {
  profile: UserDto | null = null;
  isLoading = true;
  errorMsg = '';
  successMsg = '';
  isEditing = false;
  editData: Partial<UserDto> = {};

  private userUrl = `${environment.apiBaseUrl}/users`;

  constructor(
    private http: HttpClient,
    private authService: AuthService,
  ) {}

  ngOnInit(): void {
    this.loadProfile();
  }

  loadProfile(): void {
    const username = this.authService.getUsername();
    this.http.get<UserDto[]>(`${this.userUrl}/admin/findAll`).subscribe({
      next: (users) => {
        this.profile = users.find((u) => u.username === username) || null;
        if (this.profile) {
          this.editData = { ...this.profile };
        }
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Profile load nahi ho saka.';
        this.isLoading = false;
      },
    });
  }

  saveProfile(): void {
    if (!this.profile?.id) return;
    this.http.put(`${this.userUrl}/update/${this.profile.id}`, this.editData).subscribe({
      next: () => {
        this.successMsg = 'Profile update ho gaya!';
        this.isEditing = false;
        this.loadProfile();
      },
      error: () => {
        this.errorMsg = 'Profile update nahi ho saka.';
      },
    });
  }

  startEdit(): void {
    this.editData = { ...this.profile };
    this.isEditing = true;
    this.successMsg = '';
    this.errorMsg = '';
  }

  cancelEdit(): void {
    this.isEditing = false;
    this.editData = { ...this.profile };
  }
}