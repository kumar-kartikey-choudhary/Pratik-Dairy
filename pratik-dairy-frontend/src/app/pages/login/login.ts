import { Component, OnInit, inject, signal } from '@angular/core';
import { RouterLink, Router, ActivatedRoute } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { AuthService } from '../../service/login/auth-service';
import { ToastService } from '../../core/services/toast.service';

@Component({
  selector: 'app-login',
  standalone: true,
  templateUrl: './login.html',
  styleUrls: ['./login.css'],
  imports: [RouterLink, FormsModule],
})
export class Login implements OnInit {
  private readonly authService = inject(AuthService);
  private readonly router = inject(Router);
  private readonly route = inject(ActivatedRoute);
  private readonly toast = inject(ToastService);

  loginForm = { username: '', password: '' };

  /** Disables the submit button and shows progress while the request is in flight. */
  readonly submitting = signal(false);
  readonly errorMessage = signal<string | null>(null);

  private returnUrl: string | null = null;

  ngOnInit(): void {
    const params = this.route.snapshot.queryParamMap;
    this.returnUrl = params.get('returnUrl');
    if (params.get('sessionExpired')) {
      this.toast.info('Your session expired. Please sign in again.');
    }
    // Already signed in? Don't show the form again.
    if (this.authService.isLoggedIn()) {
      this.authService.navigateAfterLogin(this.returnUrl);
    }
  }

  onLogin(): void {
    const username = this.loginForm.username.trim();
    const password = this.loginForm.password;

    if (!username || !password) {
      this.errorMessage.set('Please enter both your username and password.');
      return;
    }
    if (this.submitting()) return;

    this.submitting.set(true);
    this.errorMessage.set(null);

    this.authService.login({ username, password }).subscribe({
      next: () => {
        this.submitting.set(false);
        this.toast.success(`Welcome back, ${username}!`);
        this.authService.navigateAfterLogin(this.returnUrl);
      },
      error: (error) => {
        this.submitting.set(false);
        this.errorMessage.set(
          error?.status === 401 || error?.status === 400
            ? 'Invalid username or password.'
            : 'Could not sign you in right now. Please try again.',
        );
      },
    });
  }
}
