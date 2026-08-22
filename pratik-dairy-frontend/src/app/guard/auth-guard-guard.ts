import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/login/auth-service';
import { StorageService } from '../core/services/storage.service';

/**
 * Admin-only guard.
 *
 * SSR note: on the server there is no sessionStorage, so the guard used to
 * always fail and the pre-rendered HTML was a redirect. We let the server pass
 * and re-evaluate in the browser, which is where the session actually lives.
 */
export const authGuardGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const storage = inject(StorageService);

  if (!storage.isBrowser) return true;

  if (authService.isLoggedIn() && authService.isAdmin()) return true;

  if (!authService.isLoggedIn()) {
    return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
  }

  // Logged in but not an admin.
  return router.createUrlTree(['/home']);
};
