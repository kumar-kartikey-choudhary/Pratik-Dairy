import { Component, computed, inject, signal } from '@angular/core';
import { Router, RouterOutlet, NavigationEnd } from '@angular/router';
import { filter } from 'rxjs/operators';
import { Header } from './header/header';
import { Footer } from './footer/footer';
import { AuthService } from './service/login/auth-service';
import { AdminHeader } from './admin/pages/admin-header/admin-header';
import { ToastHost } from './shared/components/toast/toast';
import { LoadingBar } from './shared/components/loading-bar/loading-bar';

@Component({
  selector: 'app-root',
  standalone: true,
  imports: [RouterOutlet, Header, Footer, AdminHeader, ToastHost, LoadingBar],
  templateUrl: './app.html',
  styleUrl: './app.css',
})
export class App {
  private readonly auth = inject(AuthService);
  readonly router = inject(Router);

  /** Current URL as a signal so the chrome is derived, not imperatively toggled. */
  private readonly url = signal('/');

  readonly isAdminRoute = computed(() => this.url().startsWith('/admin'));
  readonly isAuthRoute = computed(() => {
    const u = this.url().split('?')[0];
    return u === '/login' || u === '/signup';
  });

  readonly showAdminHeader = computed(
    () => this.isAdminRoute() && this.auth.loggedIn() && this.auth.admin(),
  );
  readonly showCustomerHeader = computed(() => !this.isAdminRoute() && !this.isAuthRoute());
  readonly showFooter = computed(() => !this.isAdminRoute() && !this.isAuthRoute());

  constructor() {
    this.router.events
      .pipe(filter((event): event is NavigationEnd => event instanceof NavigationEnd))
      .subscribe((event) => this.url.set(event.urlAfterRedirects));
  }
}
