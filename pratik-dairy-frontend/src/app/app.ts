import { Component, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { Header } from "./header/header";
import { Footer } from "./footer/footer";
import { AuthService } from './service/login/auth-service';
import { AdminHeader } from "./admin/pages/admin-header/admin-header"; 
import { CommonModule } from '@angular/common';
import { filter } from 'rxjs/operators';

@Component({
  selector: 'app-root',
  imports: [RouterOutlet, Header, Footer, AdminHeader, CommonModule],
  templateUrl: './app.html',
  styleUrl: './app.css',
  standalone: true
})
export class App {
  protected readonly title = signal('pratik-dairy-frontend');

  isAdminRoute = false;
  isAuthRoute = false;

  constructor(public router: Router, private authService: AuthService) {
    // URL change hone par har baar check karo
    this.router.events
      .pipe(filter(event => event instanceof NavigationEnd))
      .subscribe((event: NavigationEnd) => {
        const url = event.urlAfterRedirects;
        this.isAdminRoute = url.startsWith('/admin');
        this.isAuthRoute = url === '/login' || url === '/signup';
      });
  }

  // Sirf /admin/* routes pe AND admin logged in ho
  showAdminHeader(): boolean {
    return this.isAdminRoute && this.authService.isLoggedIn() 
           && this.authService.getUserRole() === 'ADMIN';
  }

  // Customer header: na admin route, na login/signup page
  showCustomerHeader(): boolean {
    return !this.isAdminRoute && !this.isAuthRoute;
  }

  showFooter(): boolean {
    return !this.isAdminRoute && !this.isAuthRoute;
  }
}