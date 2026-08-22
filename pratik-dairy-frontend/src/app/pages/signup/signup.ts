import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { SignUp, UserDto } from '../../model';

export type { SignUp, UserDto };

@Injectable({ providedIn: 'root' })
export class SignupService {
  private readonly http = inject(HttpClient);
  private readonly signupUrl = `${environment.apiBaseUrl}/users`;

  /** Registers a new customer account. */
  onSignUp(credentials: SignUp): Observable<UserDto> {
    return this.http.post<UserDto>(`${this.signupUrl}/register`, credentials);
  }

  /** Optional availability check — lets the form warn before submitting. */
  isUsernameAvailable(username: string): Observable<{ available: boolean }> {
    return this.http.get<{ available: boolean }>(`${this.signupUrl}/available`, {
      params: { username },
    });
  }
}