import {
  ApplicationConfig,
  provideBrowserGlobalErrorListeners,
  provideZoneChangeDetection,
  isDevMode,
} from '@angular/core';
import {
  provideRouter,
  withComponentInputBinding,
  withInMemoryScrolling,
  withRouterConfig,
} from '@angular/router';

import { routes } from './app.routes';
import { provideHttpClient, withFetch, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './interceptor/auth.interceptor';
import { httpErrorInterceptor } from './core/interceptors/http-error.interceptor';
import { ssrSkipInterceptor } from './core/interceptors/ssr-skip.interceptor';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch(),
      // Order matters: auth runs first (adds the token / handles 401),
      // the error interceptor wraps it with retries, loading state and toasts.
      withInterceptors([ssrSkipInterceptor, httpErrorInterceptor, authInterceptor]),
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(
      routes,
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled',
        anchorScrolling: 'enabled',
      }),
      // Re-run guards/resolvers when only query params change (e.g. ?returnUrl=).
      withRouterConfig({ paramsInheritanceStrategy: 'always' }),
      withComponentInputBinding(),
    ),
    // NOTE: client hydration stays disabled on purpose. The header renders
    // different markup for signed-in users, and the session lives in
    // sessionStorage which the server cannot see, so hydration would report a
    // DOM mismatch on every authenticated page load. Re-enable it together with
    // a cookie-based session that SSR can read.
    // provideClientHydration(withEventReplay()),
  ],
};

export const APP_DEV_MODE = isDevMode;
