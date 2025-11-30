import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/login/auth-service';
import { inject } from '@angular/core';

export const authGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true; // Admin access granted
  } else {
    // Redirect to home (if logged in as a regular user) or to login page
    return router.createUrlTree(['/home']); 
  }
};
