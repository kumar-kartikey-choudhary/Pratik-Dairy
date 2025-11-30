import { ApplicationConfig, provideBrowserGlobalErrorListeners, provideZoneChangeDetection } from '@angular/core';
import { provideRouter, withInMemoryScrolling, withRouterConfig } from '@angular/router';

import { routes } from './app.routes';
import { provideClientHydration, withEventReplay } from '@angular/platform-browser';
import { provideHttpClient, withFetch } from '@angular/common/http';

export const appConfig: ApplicationConfig = {
  providers: [
    provideHttpClient(
      withFetch()
    ),
    provideBrowserGlobalErrorListeners(),
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(routes,
      
      // 2. CRITICAL FIX: Move scroll properties to withInMemoryScrolling
      withInMemoryScrolling({
        scrollPositionRestoration: 'enabled', // <-- MOVED PROPERTY
        // This is necessary if you want the user to be able to jump to fragments (e.g., /contact#details)
        anchorScrolling: 'enabled', 
      })
    ), provideClientHydration(withEventReplay())
  ]
};
