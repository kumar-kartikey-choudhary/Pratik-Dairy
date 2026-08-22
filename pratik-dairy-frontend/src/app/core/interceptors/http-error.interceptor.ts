import { HttpErrorResponse, HttpInterceptorFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { catchError, finalize, retry, throwError, timer } from 'rxjs';
import { LoadingService } from '../services/loading.service';
import { ToastService } from '../services/toast.service';

/** Human readable message for an HTTP failure. */
function messageFor(error: HttpErrorResponse): string {
  if (error.status === 0) return 'Cannot reach the server. Please check your connection.';
  if (error.status === 400)
    return error.error?.message ?? 'Invalid request. Please check the form.';
  if (error.status === 404) return 'The requested item could not be found.';
  if (error.status >= 500) return 'Something went wrong on our side. Please try again shortly.';
  return error.error?.message ?? 'Unexpected error. Please try again.';
}

/**
 * Global HTTP concerns: progress indication, one retry with backoff for idempotent
 * reads, and a single user-visible error message instead of scattered
 * `console.error` calls.
 */
export const httpErrorInterceptor: HttpInterceptorFn = (req, next) => {
  const loading = inject(LoadingService);
  const toast = inject(ToastService);

  loading.start();

  return next(req).pipe(
    retry({
      count: req.method === 'GET' ? 2 : 0,
      delay: (error: HttpErrorResponse, retryCount) =>
        error.status === 0 || error.status >= 500
          ? timer(retryCount * 600)
          : throwError(() => error),
    }),
    catchError((error: HttpErrorResponse) => {
      // 401/403 are already reported by the auth interceptor.
      if (error.status !== 401 && error.status !== 403) {
        toast.error(messageFor(error));
      }
      return throwError(() => error);
    }),
    finalize(() => loading.stop()),
  );
};
