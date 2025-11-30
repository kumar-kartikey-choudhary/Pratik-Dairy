import { NgFor, NgIf } from '@angular/common';
import { Component } from '@angular/core';
import { Router, RouterLink, RouterLinkActive } from '@angular/router';
import { AuthService } from '../service/login/auth-service';

@Component({
  selector: 'app-header',
  imports: [
    RouterLink,
    RouterLinkActive,
  ],
  templateUrl: './header.html',
  styleUrl: './header.css'
})
export class Header {
  
  navLinks = [
    { label: 'Home', link: '/' },
    { label: 'Products', link: '/products' },
    { label: 'About Us', link: '/about' },
    { label: 'Contact', link: '/contact' }
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
