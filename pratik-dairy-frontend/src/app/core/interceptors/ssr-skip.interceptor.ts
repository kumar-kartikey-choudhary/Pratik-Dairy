import { HttpInterceptorFn } from '@angular/common/http';
import { PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';
import { EMPTY } from 'rxjs';

/**
 * Skips API calls during server-side rendering / prerendering.
 *
 * Why: the app renders 20 routes at build time and each page component fires
 * its own product/cart request in `ngOnInit`. On the server there is no
 * session and (at build time) usually no API at all, so every one of those
 * requests failed, filled the build log with errors and slowed prerendering
 * down. Since hydration is disabled, the browser fetches the data again
 * anyway — so the server-side call is pure waste.
 *
 * If real SSR data-fetching is added later, replace this with
 * `TransferState` caching instead of removing it outright.
 */
export const ssrSkipInterceptor: HttpInterceptorFn = (req, next) => {
  const isBrowser = isPlatformBrowser(inject(PLATFORM_ID));
  if (!isBrowser) {
    return EMPTY;
  }
  return next(req);
};
