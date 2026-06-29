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
  
  private readonly AUTH_API_URL = 'http://localhost:8080/users'; // FIX: Base URL set to port 8080
  
  private readonly TOKEN_KEY = 'AUTH_TOKEN';
  private readonly USER_ROLE_KEY = 'USER_ROLE';
  private readonly USERNAME_KEY = 'USERNAME';

  constructor(private http: HttpClient, private router: Router) {
    // Note: The state is primarily checked via the token in local storage
  }

  // CRITICAL FIX: Implementation of the isAdmin check
  isAdmin(): boolean {
    const role = this.getUserRole();
    return role === 'ROLE_ADMIN'; 
  }

  /**
   * Sends login credentials to the Spring Boot backend and processes the JWT response.
   */
  login(credentials: LoginRequest): Observable<JwtResponse> {
    const url = `${this.AUTH_API_URL}/login`;
    
    return this.http.post<JwtResponse>(url, credentials).pipe(
      tap(response => {
        this.saveAuthData(response);
      })
    );
  }

  // ✅ FIX: localStorage → sessionStorage
  // sessionStorage tab band hone pe clear ho jaata hai — localStorage ki tarah persist nahi karta
  // XSS attack mein window.open se dusre tab mein token nahi milega
  private saveAuthData(response: JwtResponse): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.setItem(this.TOKEN_KEY,     response.token);
      sessionStorage.setItem(this.USER_ROLE_KEY, response.role);
      sessionStorage.setItem(this.USERNAME_KEY,  response.username);
    }
  }
  
  /**
   * Reads the stored role and navigates the user to the correct protected page.
   */
  public navigateBasedOnRole(): void {
    const role = this.getUserRole();
    console.log(role)

    if (role === 'ROLE_ADMIN') {
      this.router.navigate(['/admin/dashboard']); 
    } else if (role === 'ROLE_CUSTOMER') {
      this.router.navigate(['/home']); 
    } else {
      console.log("error")
      this.router.navigate(['/login']); 
    }
  }


  // ... (logout, isLoggedIn, getUserRole, getUserInitial methods remain the same) ...
  logout(): void {
    if (typeof sessionStorage !== 'undefined') {
      sessionStorage.removeItem(this.TOKEN_KEY);
      sessionStorage.removeItem(this.USER_ROLE_KEY);
      sessionStorage.removeItem(this.USERNAME_KEY);
    }
  }

  isLoggedIn(): boolean {
    if (typeof sessionStorage !== 'undefined') {
      return !!sessionStorage.getItem(this.TOKEN_KEY);
    }
    return false;
  }

  getUserRole(): string | null {
    if (typeof sessionStorage !== 'undefined') {
      return sessionStorage.getItem(this.USER_ROLE_KEY);
    }
    return null;
  }
  
  getUserInitial(): string {
    if (!this.isLoggedIn()) {
      return '👤'; 
    }
    if (typeof sessionStorage !== 'undefined') {
      const username = sessionStorage.getItem(this.USERNAME_KEY);
      return username ? username.charAt(0).toUpperCase() : 'U';
    }
    return 'U';
  }

  getUsername(): string | null {
  if (typeof sessionStorage !== 'undefined') {
    return sessionStorage.getItem(this.USERNAME_KEY);
  }
  return null;
}
}