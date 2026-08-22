import { Routes } from '@angular/router';
import { authGuardGuard } from './guard/auth-guard-guard'; // admin only
import { customerGuard } from './guard/customer-guard'; // any logged-in user

/**
 * All routes are lazy-loaded (including login/signup, which used to be eager
 * imports and therefore part of the initial bundle for every visitor).
 */
export const routes: Routes = [
  // ------------------------------------------------------------ PUBLIC
  {
    path: 'login',
    title: 'Login | Pratik Dairy & Sweets',
    loadComponent: () => import('./pages/login/login').then((m) => m.Login),
  },
  {
    path: 'signup',
    title: 'Create an account | Pratik Dairy & Sweets',
    loadComponent: () => import('./pages/signup/signup').then((m) => m.SignupService),
  },

  // ---------------------------------------------------------- CUSTOMER
  {
    path: '',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        title: 'Fresh Dairy, Sweets & Namkeen | Pratik Dairy & Sweets',
        loadComponent: () => import('./pages/home/home').then((m) => m.Home),
      },
      {
        path: 'products',
        title: 'All Products | Pratik Dairy & Sweets',
        loadComponent: () => import('./pages/products/products').then((m) => m.Products),
      },
      {
        path: 'about',
        title: 'About Us | Pratik Dairy & Sweets',
        loadComponent: () => import('./pages/about/about').then((m) => m.About),
      },
      {
        path: 'contact',
        title: 'Contact Us | Pratik Dairy & Sweets',
        loadComponent: () => import('./pages/contact/contact').then((m) => m.Contact),
      },

      // --- category pages (each now has its own document title) ---
      {
        path: 'products/dairy',
        title: 'Dairy Products | Pratik Dairy & Sweets',
        loadComponent: () =>
          import('./pages/dairy-products/dairy-products').then((m) => m.DairyProducts),
      },
      {
        path: 'products/sweets',
        title: 'Sweets Menu | Pratik Dairy & Sweets',
        loadComponent: () => import('./pages/sweets-menu/sweets-menu').then((m) => m.SweetsMenu),
      },
      {
        path: 'products/drink',
        title: 'Cold Drinks | Pratik Dairy & Sweets',
        loadComponent: () => import('./pages/cold-drinks/cold-drinks').then((m) => m.ColdDrinks),
      },
      {
        path: 'products/snacks',
        title: 'Snacks & Namkeens | Pratik Dairy & Sweets',
        loadComponent: () =>
          import('./pages/snacks-and-namkeens/snacks-and-namkeens').then(
            (m) => m.SnacksAndNamkeens,
          ),
      },
      {
        path: 'products/other',
        title: 'Other Products | Pratik Dairy & Sweets',
        loadComponent: () =>
          import('./pages/other-products/other-products').then((m) => m.OtherProducts),
      },

      // --- authenticated ---
      {
        path: 'cart',
        title: 'Your Cart | Pratik Dairy & Sweets',
        canActivate: [customerGuard],
        loadComponent: () =>
          import('./pages/shopping-cart/shopping-cart').then((m) => m.ShoppingCart),
      },
      {
        path: 'orders',
        title: 'My Orders | Pratik Dairy & Sweets',
        canActivate: [customerGuard],
        loadComponent: () => import('./pages/my-orders/my-orders').then((m) => m.MyOrders),
      },
      {
        path: 'account',
        title: 'My Account | Pratik Dairy & Sweets',
        canActivate: [customerGuard],
        loadComponent: () =>
          import('./pages/user-accounts/user-accounts').then((m) => m.UserAccounts),
      },
    ],
  },

  // ------------------------------------------------------------- ADMIN
  {
    path: 'admin',
    canActivate: [authGuardGuard],
    children: [
      // BUGFIX: this used to redirect to 'admin/login', a route that does not exist.
      { path: '', redirectTo: 'dashboard', pathMatch: 'full' },
      {
        path: 'dashboard',
        title: 'Admin Dashboard | Pratik Dairy',
        loadComponent: () =>
          import('./admin/pages/dashboard/dashboard').then((m) => m.AdminDashboardComponent),
      },
      {
        path: 'product',
        title: 'Product Management | Pratik Dairy',
        loadComponent: () =>
          import('./admin/pages/product-management/product-management').then(
            (m) => m.ProductManagement,
          ),
      },
      {
        path: 'orders',
        title: 'Order Management | Pratik Dairy',
        loadComponent: () =>
          import('./admin/pages/order-management/order-management').then((m) => m.OrderManagement),
      },
      {
        path: 'users',
        title: 'User Management | Pratik Dairy',
        loadComponent: () =>
          import('./admin/pages/user-management/user-management').then((m) => m.UserManagement),
      },
    ],
  },

  // BUGFIX: unknown URLs used to dump visitors on the login page. They now get
  // a real 404 page (and search engines get a proper "not found" signal).
  {
    path: '**',
    title: 'Page not found | Pratik Dairy & Sweets',
    loadComponent: () => import('./pages/not-found/not-found').then((m) => m.NotFound),
  },
];
