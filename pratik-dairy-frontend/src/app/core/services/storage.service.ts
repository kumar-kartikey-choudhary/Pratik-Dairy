import { Injectable, PLATFORM_ID, inject } from '@angular/core';
import { isPlatformBrowser } from '@angular/common';

/**
 * SSR-safe wrapper around sessionStorage/localStorage.
 *
 * Previously every service repeated `typeof sessionStorage !== 'undefined'`
 * checks. That is both noisy and unreliable during server-side rendering,
 * where a polyfill can make the check pass while there is no real storage.
 */
@Injectable({ providedIn: 'root' })
export class StorageService {
  private readonly platformId = inject(PLATFORM_ID);

  get isBrowser(): boolean {
    return isPlatformBrowser(this.platformId);
  }

  get(key: string): string | null {
    if (!this.isBrowser) return null;
    try {
      return sessionStorage.getItem(key);
    } catch {
      return null;
    }
  }

  set(key: string, value: string): void {
    if (!this.isBrowser) return;
    try {
      sessionStorage.setItem(key, value);
    } catch {
      /* storage full or blocked — ignore */
    }
  }

  remove(key: string): void {
    if (!this.isBrowser) return;
    try {
      sessionStorage.removeItem(key);
    } catch {
      /* ignore */
    }
  }
}
