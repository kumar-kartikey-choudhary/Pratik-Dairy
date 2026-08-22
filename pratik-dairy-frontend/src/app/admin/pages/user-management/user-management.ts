import { Component, computed, inject, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { LowerCasePipe, NgClass } from '@angular/common';
import { AdminService } from '../../service/admin-service';
import type { UserDto } from '../../../model/user.model';

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css'],
  standalone: true,
  imports: [FormsModule, NgClass, LowerCasePipe],
})
export class UserManagement {
  private adminService = inject(AdminService);

  users = signal<UserDto[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);
  query = signal('');

  filteredUsers = computed(() => {
    const q = this.query().trim().toLowerCase();
    if (!q) return this.users();
    return this.users().filter((u) =>
      [u.username, u.firstName, u.lastName, u.email, u.role]
        .filter(Boolean)
        .some((v) => String(v).toLowerCase().includes(q)),
    );
  });

  constructor() {
    this.loadAllUsers();
  }

  loadAllUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.users.set([]);

    this.adminService.getAllUsers().subscribe({
      next: (data: UserDto[]) => {
        this.users.set(data.filter((user) => user.role !== 'ADMIN'));
        this.isLoading.set(false);
      },
      error: (err) => {
        console.error('Failed to fetch all users:', err);
        this.error.set('Failed to load users. Is the backend running?');
        this.isLoading.set(false);
      },
    });
  }

  getInitials(username: string): string {
    return username?.trim().charAt(0).toUpperCase() || '?';
  }

  viewHistory(user: UserDto): void {
    console.log('View history for', user.id);
  }
}