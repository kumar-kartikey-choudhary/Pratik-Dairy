import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { AuthService } from '../../service/login/auth-service'; // Assuming this path is correct

@Component({
  selector: 'app-login',
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  standalone: true,
  imports: [RouterLink, FormsModule]
})
export class Login { 
  
  constructor(private authService: AuthService, private router: Router) {}
  
  // Must be initialized to avoid runtime errors
  loginForm = { username: '', password: '' };
  
  onLogin(): void {
    // CRITICAL FIX: Subscribe to the Observable returned by authService.login()
    this.authService.login(this.loginForm as any).subscribe({
        next: (response) => {
            // Success: Token and Role are stored in AuthService.
            // CRITICAL: Call the service method to handle role-based redirection.
            this.authService.navigateBasedOnRole(); 
        },
        error: (error) => {
            console.error('Login error:', error);
            // In a real application, you might extract a specific message from the error object
            alert('Login Failed: Invalid credentials or server error.');
        }
    });
  }
}