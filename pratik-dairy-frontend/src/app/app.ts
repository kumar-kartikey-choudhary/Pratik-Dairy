// src/app/app.component.ts

import { Component, signal } from '@angular/core';
import { Router, RouterOutlet } from '@angular/router'; // <-- IMPORT Router HERE
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
// Import the Auth service to handle logout logic in the template (optional, but good practice)
import { AuthService } from './service/login/auth-service';
import { AdminHeader } from "./admin/pages/admin-header/admin-header"; 
import { CommonModule } from '@angular/common';
// import { AppRoutingModule } from './app.routes';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AdminHeader,CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App {
  protected readonly title = signal('pratik-dairy-frontend');

 constructor(public router: Router, private authService: AuthService) { } 
    
    // Check if the current route is the public login page
    isAuthRoute(): boolean {
        // Check if the URL starts with /login or /signup
        return this.router.url.includes('/login') || this.router.url.includes('/signup'); 
    }

    // Check if the user is logged in AND is an admin
    isAdminLoggedIn(): boolean {
        // This relies on the JWT having been set in local storage
        return this.authService.isLoggedIn() && this.authService.getUserRole() === 'ADMIN'; 
    }
    
    // Check if the user is a standard customer/user
    isCustomerLoggedIn(): boolean {
        return this.authService.isLoggedIn() && this.authService.getUserRole() === 'CUSTOMER'; 
    }
}