// src/app/footer/footer.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


@Component({
  selector: 'app-footer',
  templateUrl: './footer.html',
  styleUrls: ['./footer.css'],
  standalone: true,
  imports: [RouterLink]
})
export class Footer {
  
  quickLinks = [
    { label: 'Home', link: '/' },
    { label: 'Products Hub', link: '/products' },
    { label: 'Sweets Menu', link: '/products/sweets' },
    { label: 'Dairy Products', link: '/products/dairy' },
    { label: 'About Us', link: '/about' },
  ];

  utilityLinks = [
    { label: 'My Account', link: '/account' },
    { label: 'My Orders', link: '/orders' },
    { label: 'Shopping Cart', link: '/cart' },
    { label: 'Contact/Support', link: '/contact' },
    { label: 'Bulk Inquiry', link: '/contact' },
  ];
}