import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, throwError } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../service/login/auth-service';
import { StorageService } from '../core/services/storage.service';
import { ToastService } from '../core/services/toast.service';

/**
 * Attaches the bearer token and handles auth failures.
 *
 * BUGFIX: the original implementation returned `next(cloned)` early whenever a
 * token was present, so the 401 handling below it only ever ran for
 * *unauthenticated* requests — exactly the ones that cannot expire. Expired
 * sessions therefore left the user stuck on a broken page. Now every request
 * goes through the same error pipeline.
 */
export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const router = inject(Router);
  const authService = inject(AuthService);
  const storage = inject(StorageService);
  const toast = inject(ToastService);

  let request = req;

  if (storage.isBrowser) {
    const token = authService.getToken();
    if (token && !authService.isTokenExpired(token)) {
      request = req.clone({ setHeaders: { Authorization: `Bearer ${token}` } });
    } else if (token) {
      // Token present but expired — drop it instead of sending a dead header.
      authService.logout();
    }
  }

  return next(request).pipe(
    catchError((error: HttpErrorResponse) => {
      if (error.status === 401) {
        authService.logout();
        router.navigate(['/login'], {
          queryParams: { sessionExpired: true, returnUrl: router.url },
        });
      } else if (error.status === 403) {
        toast.error('You do not have permission to perform this action.');
      }
      return throwError(() => error);
    }),
  );
};
