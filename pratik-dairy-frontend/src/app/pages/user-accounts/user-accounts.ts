// src/app/pages/user-account/user-account.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

@Component({
  selector: 'app-user-account',
  templateUrl: './user-accounts.html',
  styleUrls: ['./user-accounts.css'],
  standalone: true,
  imports: [RouterLink, FormsModule] // FormsModule for input binding
})
export class UserAccounts {
  
}