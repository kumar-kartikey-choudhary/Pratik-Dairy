// src/app/guards/customer-guard.guard.ts
import { CanActivateFn, Router } from '@angular/router';
import { AuthService } from '../service/login/auth-service';
import { inject } from '@angular/core';

export const customerGuard: CanActivateFn = (route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);

  if (authService.isLoggedIn()) {
    return true; // Both admin and customer can access
  }

  return router.createUrlTree(['/login'], {
    queryParams: { returnUrl: state.url }
  });
};