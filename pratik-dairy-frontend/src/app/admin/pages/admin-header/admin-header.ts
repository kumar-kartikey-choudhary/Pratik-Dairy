import { Component } from '@angular/core';
import { AuthService } from '../../../service/login/auth-service';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';

@Component({
  selector: 'app-admin-header',
  imports: [
    RouterLink,
    RouterLinkActive
  ],
  templateUrl: './admin-header.html',
  styleUrl: './admin-header.css'
})
export class AdminHeader {

   navLinks = [
    { label: 'Home', link: 'admin/dashboard' },
    { label: 'Product Management', link: 'admin/product' },
    { label: 'User Management', link: 'admin/users' },
    { label: 'Order Management', link: 'admin/orders' }
  ];

  constructor(public authservice : AuthService , private router : Router){}

  // State variables for menu toggles
  isMenuOpen: boolean = false;

  toggleMenu(): void {
    this.isMenuOpen = !this.isMenuOpen;
  }

  onLogOut() {
    this.authservice.logout();
    this.router.navigate(['/login'])
  }

}
