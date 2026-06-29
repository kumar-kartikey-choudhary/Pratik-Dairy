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
        confirmPassword: ''
    };

    passwordMismatch: boolean = false;
    isLoading : boolean = false;
    errorMessage = '';

    // Inject Router and the new SignupService
    constructor(private router: Router, private signupService: SignupService) { }


    // Method to handle form submission
    onSubmit(): void {
        this.passwordMismatch = false;

        if (this.user.password !== this.user.confirmPassword) {
            this.passwordMismatch = true;
            return; // Stop submission
        }

        this.isLoading = true;

        // --- NEW: API CALL LOGIC ---
        // Construct the payload, excluding the temporary 'confirmPassword' field
        const payload = {
            firstName: this.user.firstName,
            middleName: this.user.middleName,
            lastName: this.user.lastName,
            username: this.user.username,
            email: this.user.email,
            password: this.user.password
        };

        this.signupService.onSignUp(payload as any).subscribe({
            next: (response) => {
                this.isLoading = false;
                alert(`Welcome, ${response.username}! Account created. Please log in.`);
                this.router.navigate(['/login']); // Redirect to login after success
            },
            error: (err) => {
                this.isLoading = false;
                // ✅ FIX: console.error hataaya, user-facing error dikhao
                if (err.status === 409 || err.error?.message?.includes('already exists')) {
                    this.errorMessage = 'Username ya Email already registered hai. Doosra try karein.';
                } else {
                    this.errorMessage = 'Registration fail ho gayi. Dobara try karein.';
                }
            }
        });
    }
}