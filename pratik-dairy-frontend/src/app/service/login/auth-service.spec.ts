import { TestBed } from '@angular/core/testing';
import { provideHttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideRouter } from '@angular/router';
import { AuthService, JwtResponse } from './auth-service';

function fakeJwt(expSecondsFromNow: number): string {
  const payload = btoa(JSON.stringify({ exp: Math.floor(Date.now() / 1000) + expSecondsFromNow }));
  return `header.${payload}.signature`;
}

describe('AuthService', () => {
  let service: AuthService;
  let http: HttpTestingController;

  beforeEach(() => {
    sessionStorage.clear();
    TestBed.configureTestingModule({
      providers: [provideHttpClient(), provideHttpClientTesting(), provideRouter([])],
    });
    service = TestBed.inject(AuthService);
    http = TestBed.inject(HttpTestingController);
  });

  afterEach(() => http.verify());

  it('starts signed out', () => {
    expect(service.isLoggedIn()).toBeFalse();
    expect(service.isAdmin()).toBeFalse();
  });

  it('stores the session and exposes the role after login', () => {
    const response: JwtResponse = {
      token: fakeJwt(3600),
      id: 1,
      username: 'kartikey',
      role: 'ROLE_ADMIN',
      tokenType: 'Bearer',
    };

    service.login({ username: 'kartikey', password: 'secret' }).subscribe();
    http.expectOne((r) => r.url.endsWith('/users/login')).flush(response);

    expect(service.isLoggedIn()).toBeTrue();
    expect(service.isAdmin()).toBeTrue();
    expect(service.getUserInitial()).toBe('K');
  });

  it('treats an expired token as signed out', () => {
    expect(service.isTokenExpired(fakeJwt(-10))).toBeTrue();
    expect(service.isTokenExpired(fakeJwt(3600))).toBeFalse();
  });

  it('clears everything on logout', () => {
    service.login({ username: 'a', password: 'b' }).subscribe();
    http
      .expectOne((r) => r.url.endsWith('/users/login'))
      .flush({
        token: fakeJwt(3600),
        id: 2,
        username: 'a',
        role: 'ROLE_CUSTOMER',
        tokenType: 'Bearer',
      });

    service.logout();

    expect(service.isLoggedIn()).toBeFalse();
    expect(sessionStorage.getItem('AUTH_TOKEN')).toBeNull();
  });
});
