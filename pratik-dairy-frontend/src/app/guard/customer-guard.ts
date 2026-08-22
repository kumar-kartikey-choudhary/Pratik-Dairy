import { CanActivateFn, Router } from '@angular/router';
import { inject } from '@angular/core';
import { AuthService } from '../service/login/auth-service';
import { StorageService } from '../core/services/storage.service';

/** Any authenticated user (customer or admin). */
export const customerGuard: CanActivateFn = (_route, state) => {
  const authService = inject(AuthService);
  const router = inject(Router);
  const storage = inject(StorageService);

  if (!storage.isBrowser) return true;
  if (authService.isLoggedIn()) return true;

  return router.createUrlTree(['/login'], { queryParams: { returnUrl: state.url } });
};
