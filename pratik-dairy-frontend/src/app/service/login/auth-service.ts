import { Injectable, computed, inject, signal } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, tap } from 'rxjs';
import { Router } from '@angular/router';
import { environment } from '../../../environments/environment';
import { StorageService } from '../../core/services/storage.service';
import type { LoginRequest, JwtResponse, AuthState } from '../../model';

export type { LoginRequest, JwtResponse, AuthState };

const TOKEN_KEY = 'AUTH_TOKEN';
const USER_ROLE_KEY = 'USER_ROLE';
const USERNAME_KEY = 'USERNAME';
const USER_ID_KEY = 'USER_ID';

/** Decodes the payload of a JWT without verifying it (verification is the API's job). */
function decodeJwt(token: string): Record<string, unknown> | null {
  try {
    const payload = token.split('.')[1];
    if (!payload) return null;
    const normalised = payload.replace(/-/g, '+').replace(/_/g, '/');
    const json = decodeURIComponent(
      atob(normalised)
        .split('')
        .map((c) => '%' + ('00' + c.charCodeAt(0).toString(16)).slice(-2))
        .join(''),
    );
    return JSON.parse(json);
  } catch {
    return null;
  }
}

@Injectable({ providedIn: 'root' })
export class AuthService {
  private readonly http = inject(HttpClient);
  private readonly router = inject(Router);
  private readonly storage = inject(StorageService);

  private readonly authApiUrl = `${environment.apiBaseUrl}/users`;

  /**
   * Reactive auth state. Components can read `auth.state()` / `auth.isAdmin()`
   * and the UI updates immediately after login or logout — previously the
   * header only refreshed on a full page reload.
   */
  private readonly _state = signal<AuthState | null>(null);
  readonly state = this._state.asReadonly();
  readonly loggedIn = computed(() => this._state() !== null);
  readonly username = computed(() => this._state()?.username ?? null);
  readonly role = computed(() => this._state()?.role ?? null);
  readonly admin = computed(() => this._state()?.role === 'ROLE_ADMIN');
  readonly initial = computed(() => {
    const name = this._state()?.username;
    return name ? name.charAt(0).toUpperCase() : '👤';
  });

  constructor() {
    this.restoreSession();
  }

  // ---------------------------------------------------------------- session

  private restoreSession(): void {
    const token = this.storage.get(TOKEN_KEY);
    if (!token || this.isTokenExpired(token)) {
      this.clearStorage();
      return;
    }
    this._state.set({
      token,
      username: this.storage.get(USERNAME_KEY) ?? '',
      role: this.storage.get(USER_ROLE_KEY) ?? '',
      id: Number(this.storage.get(USER_ID_KEY)) || null,
    });
  }

  /** A token that is present but expired is worse than no token at all. */
  isTokenExpired(token = this.getToken()): boolean {
    if (!token) return true;
    const payload = decodeJwt(token);
    const exp = payload?.['exp'];
    if (typeof exp !== 'number') return false; // no exp claim -> let the API decide
    return Date.now() >= exp * 1000 - environment.tokenExpiryLeewayMs;
  }

  // ------------------------------------------------------------------- auth

  login(credentials: LoginRequest): Observable<JwtResponse> {
    return this.http
      .post<JwtResponse>(`${this.authApiUrl}/login`, credentials)
      .pipe(tap((response) => this.saveAuthData(response)));
  }

  private saveAuthData(response: JwtResponse): void {
    this.storage.set(TOKEN_KEY, response.token);
    this.storage.set(USER_ROLE_KEY, response.role);
    this.storage.set(USERNAME_KEY, response.username);
    this.storage.set(USER_ID_KEY, String(response.id ?? ''));
    this._state.set({
      token: response.token,
      username: response.username,
      role: response.role,
      id: response.id ?? null,
    });
  }

  logout(redirect = false): void {
    this.clearStorage();
    this._state.set(null);
    if (redirect) this.router.navigate(['/login']);
  }

  private clearStorage(): void {
    [TOKEN_KEY, USER_ROLE_KEY, USERNAME_KEY, USER_ID_KEY].forEach((k) => this.storage.remove(k));
  }

  /**
   * Sends the user to the page they originally requested, falling back to a
   * role-appropriate landing page.
   */
  navigateAfterLogin(returnUrl?: string | null): void {
    if (returnUrl && returnUrl !== '/login' && returnUrl !== '/signup') {
      this.router.navigateByUrl(returnUrl);
      return;
    }
    this.router.navigate([this.admin() ? '/admin/dashboard' : '/home']);
  }

  /** @deprecated kept for backwards compatibility — use navigateAfterLogin(). */
  navigateBasedOnRole(): void {
    this.navigateAfterLogin(null);
  }

  // --------------------------------------------------------- legacy getters
  // Existing components call these as methods from templates; they now read
  // from the signal so change detection stays correct.

  getToken(): string | null {
    return this._state()?.token ?? this.storage.get(TOKEN_KEY);
  }

  isLoggedIn(): boolean {
    return this.loggedIn();
  }

  isAdmin(): boolean {
    return this.admin();
  }

  getUserRole(): string | null {
    return this.role();
  }

  getUsername(): string | null {
    return this.username();
  }

  getUserInitial(): string {
    return this.initial();
  }
}