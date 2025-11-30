import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router'; // <-- CRITICAL IMPORT

// Define interfaces for clarity
interface LoginRequest {
  username: string;
  password: string;
}

interface JwtResponse {
  token: string;
  id: number;
  username: string;
  role: string; // Expected to be 'ADMIN' or 'CUSTOMER'
  tokenType: string;
}

@Injectable({
  providedIn: 'root'
})
export class AuthService {
  
  private readonly AUTH_API_URL = 'http://localhost:8081'; // FIX: Base URL set to port 8081
  
  private readonly TOKEN_KEY = 'AUTH_TOKEN';
  private readonly USER_ROLE_KEY = 'USER_ROLE';
  private readonly USERNAME_KEY = 'USERNAME';

  constructor(private http: HttpClient, private router: Router) {
    // Note: The state is primarily checked via the token in local storage
  }

  // CRITICAL FIX: Implementation of the isAdmin check
  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'ADMIN'; 
  }

  /**
   * Sends login credentials to the Spring Boot backend and processes the JWT response.
   */
  login(credentials: LoginRequest): Observable<JwtResponse> {
    const url = `${this.AUTH_API_URL}/auth/login`; // FIX: Corrected path
    
    return this.http.post<JwtResponse>(url, credentials).pipe(
      tap(response => {
        this.saveAuthData(response);
      })
    );
  }

  /**
   * Saves the JWT and user data to browser storage upon successful login.
   */
  private saveAuthData(response: JwtResponse): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.setItem(this.TOKEN_KEY, response.token);
      localStorage.setItem(this.USER_ROLE_KEY, response.role);
      localStorage.setItem(this.USERNAME_KEY, response.username);
    }
  }
  
  /**
   * Reads the stored role and navigates the user to the correct protected page.
   */
  public navigateBasedOnRole(): void {
    const role = this.getUserRole();

    if (role === 'ADMIN') {
      this.router.navigate(['/admin/dashboard']); 
    } else if (role === 'CUSTOMER') {
      this.router.navigate(['/home']); 
    } else {
      this.router.navigate(['/login']); 
    }
  }


  // ... (logout, isLoggedIn, getUserRole, getUserInitial methods remain the same) ...
  logout(): void {
    if (typeof localStorage !== 'undefined') {
      localStorage.removeItem(this.TOKEN_KEY);
      localStorage.removeItem(this.USER_ROLE_KEY);
      localStorage.removeItem(this.USERNAME_KEY);
    }
  }

  isLoggedIn(): boolean {
    if (typeof localStorage !== 'undefined') {
      return !!localStorage.getItem(this.TOKEN_KEY);
    }
    return false;
  }

  getUserRole(): string | null {
    if (typeof localStorage !== 'undefined') {
      return localStorage.getItem(this.USER_ROLE_KEY);
    }
    return null;
  }
  
  getUserInitial(): string {
    if (!this.isLoggedIn()) {
      return '👤'; 
    }
    if (typeof localStorage !== 'undefined') {
      const username = localStorage.getItem(this.USERNAME_KEY);
      return username ? username.charAt(0).toUpperCase() : 'U';
    }
    return 'U';
  }
}