// src/app/pages/contact/contact.component.ts

import { Component } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';
import { RouterLink } from '@angular/router';

@Component({
  selector: 'app-contact',
  templateUrl: './contact.html',
  styleUrls: ['./contact.css'],
  standalone: true,
  imports: [] // No need for FormsModule yet, as the form is static/mocked
})
export class Contact {
  storeInfo = {
    addressLine1: 'Dindayal Chouk, rampayli road waraseroni',
    city: 'Waraseroni, India - 481331',
    phone: '+91 7000628291',
    email: 'info@pratikdairysweets.com',
    hours: 'Mon - Sat: 7:00 AM - 10:00 PM',
    
    // Raw URL used for sanitization (Use the actual embed link from Google Maps)
    rawMapUrl: 'https://maps.google.com/maps?q=Pratik+Dairy+and+Sweets+Waraseoni&output=embed' 
  };

  // Public property to hold the sanitized URL
  safeMapUrl: SafeResourceUrl; 

  // 1. Inject the DomSanitizer service
  constructor(private sanitizer: DomSanitizer) {
    // 2. Mark the URL as safe for use in an iframe's src attribute
    this.safeMapUrl = this.sanitizer.bypassSecurityTrustResourceUrl(this.storeInfo.rawMapUrl);
  }  
}