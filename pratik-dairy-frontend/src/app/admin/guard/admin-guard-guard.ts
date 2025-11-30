import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../../service/login/auth-service';
import { inject } from '@angular/core';

export const adminGuardGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  // Check if the user is logged in AND has the 'admin' role
  if (authService.isLoggedIn() && authService.isAdmin()) {
    return true; // Access granted
  } else {
    // Access denied: Redirect to home page or login
    return router.createUrlTree(['/login']); 
  }
};
