// // src/app/pages/signup/signup.component.ts

// import { Component } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms'; // For ngModel and form handling
// import { CommonModule } from '@angular/common'; // For NgIf, NgClass

// @Component({
//   selector: 'app-signup',
//   templateUrl: './signup.html',
//   styleUrls: ['./signup.css'],
//   standalone: true,
//   imports: [RouterLink, FormsModule, CommonModule] 
// })
// export class Signup {

//   // Model to hold form data, matching your backend UserDto fields
//   user = {
//     firstName: '',
//     middleName: '',
//     lastName: '',
//     username: '',
//     email: '',
//     password: '',
//     confirmPassword: '', // Added for client-side password confirmation
//     role: 'CUSTOMER' // Default role for signup
//   };

//   passwordMismatch: boolean = false;
  
//   constructor() { }

//   // Method to handle form submission
//   onSubmit(): void {
//     this.passwordMismatch = false; // Reset mismatch status

//     if (this.user.password !== this.user.confirmPassword) {
//       this.passwordMismatch = true;
//       console.error('Password and Confirm Password do not match.');
//       return; // Prevent submission if passwords don't match
//     }

//     // In a real application, you would send this 'user' object to your
//     // Spring Boot User Microservice /api/users/auth/register endpoint.
//     // Example: this.authService.register(this.user).subscribe(...)

//     console.log('Signup form submitted:', this.user);
//     alert(`Registration successful for ${this.user.username}! (Mock API call)`);

//     // You might want to navigate to a login page or dashboard after successful signup
//     // this.router.navigate(['/login']); 
//   }
// }



// updated ts

// src/app/pages/signup/signup.component.ts (INTEGRATED)

import { Component } from '@angular/core';
import { RouterLink, Router } from '@angular/router'; // Import Router
import { FormsModule } from '@angular/forms'; 
import { CommonModule } from '@angular/common';
import { SignupService } from '../../service/signup/signup-service'; // <-- NEW SERVICE IMPORT

@Component({
  selector: 'app-signup',
  templateUrl: './signup.html',
  styleUrls: ['./signup.css'],
  standalone: true,
  imports: [RouterLink, FormsModule, CommonModule] 
})
export class Signup {

    // Model to hold form data, matching your backend UserDto fields
    user = {
        firstName: '',
        middleName: '',
        lastName: '',
        username: '',
        email: '',
        password: '',
        confirmPassword: '', 
        role: 'CUSTOMER' // Default role for signup
    };

    passwordMismatch: boolean = false;
    
    // Inject Router and the new SignupService
    constructor(private router: Router, private signupService: SignupService) { } 

    // Method to handle form submission
    onSubmit(): void {
        this.passwordMismatch = false; 

        if (this.user.password !== this.user.confirmPassword) {
            this.passwordMismatch = true;
            return; // Stop submission
        }

        // --- NEW: API CALL LOGIC ---
        // Construct the payload, excluding the temporary 'confirmPassword' field
        const payload = {
            firstName: this.user.firstName,
            middleName: this.user.middleName,
            lastName: this.user.lastName,
            username: this.user.username,
            email: this.user.email,
            password: this.user.password,
            role: this.user.role 
        };

        this.signupService.onSignUp(payload as any).subscribe({
            next: (response) => {
                console.log('Registration Success:', response);
                alert(`Welcome, ${response.username}! Account created. Please log in.`);
                this.router.navigate(['/login']); // Redirect to login after success
            },
            error: (err) => {
                console.error('Registration failed:', err);
                alert(`Registration failed. Username/Email may already exist.`);
            }
        });
    }
}