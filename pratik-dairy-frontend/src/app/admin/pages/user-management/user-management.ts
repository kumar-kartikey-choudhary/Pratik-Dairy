// src/app/admin/pages/user-management/user-management.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, DatePipe } from '@angular/common';

interface User {
  id: number;
  name: string;
  email: string;
  phone: string;
  registeredDate: Date;
  totalOrders: number;
  status: 'Active' | 'Blocked';
}

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css'],
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, DatePipe]
})
export class UserManagement {
  
  // Mock User Data
  allUsers: User[] = [
    { id: 1001, name: 'Priya Sharma', email: 'priya@test.com', phone: '9876543210', registeredDate: new Date('2025-08-15'), totalOrders: 5, status: 'Active' },
    { id: 1002, name: 'Rahul Kirti', email: 'rahul@test.com', phone: '9988776655', registeredDate: new Date('2025-09-01'), totalOrders: 0, status: 'Active' },
    { id: 1003, name: 'Mohan Das', email: 'mohan@test.com', phone: '9000011111', registeredDate: new Date('2025-07-20'), totalOrders: 12, status: 'Active' },
    { id: 1004, name: 'Blocked User X', email: 'block@test.com', phone: '9111122222', registeredDate: new Date('2025-10-01'), totalOrders: 1, status: 'Blocked' },
  ];
  
  // State for Filtering
  searchTerm: string = '';
  selectedStatus: string = 'Active';
  
  statusOptions = ['Active', 'Blocked', 'All'];

  // Getter for filtered users
  get filteredUsers(): User[] {
    let users = this.allUsers;
    const term = this.searchTerm.toLowerCase().trim();

    // 1. Filter by Status
    if (this.selectedStatus !== 'All') {
      users = users.filter(user => user.status === this.selectedStatus);
    }

    // 2. Filter by Search Term (Name or Email)
    if (term) {
      users = users.filter(user => 
        user.name.toLowerCase().includes(term) || 
        user.email.toLowerCase().includes(term) ||
        user.phone.includes(term)
      );
    }
    
    // Sort by registration date (newest first)
    return users.sort((a, b) => b.registeredDate.getTime() - a.registeredDate.getTime());
  }

  // Placeholder action methods
  blockUser(id: number): void {
    alert(`User #${id} has been blocked.`);
    // In a real app, this would update the user's status in the database
  }
}