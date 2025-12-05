// src/app/admin/pages/user-management/user-management.component.ts

import { Component, inject, signal } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, DatePipe } from '@angular/common';
import { AdminService } from '../../service/admin-service';

interface User{
    id: number;
    firstName : string;
    LastName : string;
    email : string;
    username: string;
    role : string; 
  }

@Component({
  selector: 'app-user-management',
  templateUrl: './user-management.html',
  styleUrls: ['./user-management.css'],
  standalone: true,
  imports: [ FormsModule, ]
})
export class UserManagement {
 private adminService = inject(AdminService);
   
  // Signals for state management
  users = signal<User[]>([]);
  isLoading = signal(false);
  error = signal<string | null>(null);

  // Load all users immediately on initialization
  constructor() {
    this.loadAllUsers();
  }

  /**
   * Loads all users using the dedicated service method.
   */
  loadAllUsers(): void {
    this.isLoading.set(true);
    this.error.set(null);
    this.users.set([]); 

    this.adminService.getAllUsers().subscribe(
      (data) => {
        const filteredData = data.filter(user => user.role !== 'ADMIN');
        this.users.set(filteredData);
        this.isLoading.set(false);
      },
      (err) => {
        console.error('Failed to fetch all users:', err);
        this.error.set(`Failed to load all users from Is the backend running?`);
        this.isLoading.set(false);
      }
    );
  }
}









// to display number of user add last three days 



// src/app/admin/pages/user-management/user-management.component.ts

// import { Component, inject, signal, OnInit } from '@angular/core'; // Add OnInit
// import { RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { NgFor } from '@angular/common';
// import { AdminService, User } from '../../service/admin-service'; 
// // Note: User interface must include 'registeredDate' as a string field.

// @Component({
//   selector: 'app-user-management',
//   templateUrl: './user-management.html',
//   styleUrls: ['./user-management.css'],
//   standalone: true,
//   imports: [ FormsModule, NgFor, RouterLink] // Added RouterLink back for actions
// })
// export class UserManagement implements OnInit { // Implements OnInit
//   private adminService = inject(AdminService);
    
//   // Signals for state management
//   users = signal<User[]>([]);
//   newUsersCount = signal(0); // NEW: To display count on the dashboard
//   isLoading = signal(false);
//   error = signal<string | null>(null);

//   // Filter state (if you want to show only new users)
//   filterNewUsers = signal(false);

//   // Load all users immediately on initialization
//   ngOnInit() {
//     this.loadAllUsers();
//   }
  
//   /**
//    * Helper function to determine if a user registered within the last 3 days.
//    * Assumes dateString is in ISO format (e.g., "2025-11-29T00:00:00Z").
//    */
//   isNewUser(dateString: string): boolean {
//       if (!dateString) return false;

//       // 1. Convert the input string date to a Date object
//       const registrationDate = new Date(dateString);
//       const today = new Date();
      
//       // 2. Calculate the difference in milliseconds
//       const timeDifference = today.getTime() - registrationDate.getTime();
      
//       // 3. Define 3 days in milliseconds (3 days * 24 hours * 60 minutes * 60 seconds * 1000 ms)
//       const threeDaysInMs = 3 * 24 * 60 * 60 * 1000;
      
//       // 4. Check if the registration date is within the last 3 days
//       return timeDifference <= threeDaysInMs;
//   }

//   /**
//    * Loads all users and filters out Admin users.
//    */
//   loadAllUsers(): void {
//     this.isLoading.set(true);
//     this.error.set(null);
//     this.users.set([]); 

//     this.adminService.getAllUsers().subscribe(
//       (data) => {
//         // 1. Filter out Admin accounts
//         const customerUsers = data.filter(user => user.role !== 'ADMIN');
        
//         // 2. Calculate the count of new users
//         const newUsers = customerUsers.filter(user => this.isNewUser(user.registeredDate));
        
//         this.users.set(customerUsers);
//         this.newUsersCount.set(newUsers.length);
//         this.isLoading.set(false);
//       },
//       (err) => {
//         console.error('Failed to fetch all users:', err);
//         this.error.set(`Failed to load all users.`);
//         this.isLoading.set(false);
//       }
//     );
//   }
  
//   /**
//    * Getter to apply the 'New User' visual filter on the table.
//    */
//   get visibleUsers(): User[] {
//       if (this.filterNewUsers()) {
//           // If the filter toggle is ON, show only users registered in the last 3 days
//           return this.users().filter(user => this.isNewUser(user.registeredDate));
//       }
//       return this.users();
//   }
  
//   // Placeholder methods for actions (needed for HTML buttons)
//   blockUser(id: number): void {
//       alert(`Blocking user #${id}...`);
//   }
// }