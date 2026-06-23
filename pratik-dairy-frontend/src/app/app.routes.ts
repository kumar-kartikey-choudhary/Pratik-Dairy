
// src/app/app.routes.ts (FINALIZED UNGUARDED ROUTES)

// import { Routes } from '@angular/router';

// // --- Imports (Load all components synchronously for Router) ---
// // Public Components
// import { Login } from './pages/login/login';
// import { Signup } from './pages/signup/signup';

// // Admin Components (Required for route definition)
// import { AdminDashboardComponent } from './admin/pages/dashboard/dashboard'; // Assuming file is component.ts
// import { ProductManagement } from './admin/pages/product-management/product-management';
// import { OrderManagement } from './admin/pages/order-management/order-management';
// import { UserManagement } from './admin/pages/user-management/user-management';
// // Layout Component (Needed for Admin Shell)
// // import { AdminLayoutComponent } from './admin/components/admin-layout/admin-layout.component';


// export const routes: Routes = [

//   // ----------------------------------------------------------------------
//   // 1. PUBLIC ROUTES (Accessible to everyone)
//   // ----------------------------------------------------------------------
//   {
//     path: 'login',
//     title: 'Pratik Dairy | Login',
//     component: Login
//   },
//   {
//     path: 'signup',
//     title: 'Pratik Dairy | Signup',
//     component: Signup
//   },

//   // ----------------------------------------------------------------------
//   // 2. MAIN APPLICATION ROUTES (Customer Interface)
//   // ----------------------------------------------------------------------
//   {
//     path: '', // Base path
//     children: [
//       {
//         path: '', 
//         redirectTo: 'home', 
//         pathMatch: 'full'
//       },
//       {
//         path: 'home',
//         title: 'Pratik Dairy & Sweets',
//         loadComponent: () => import('./pages/home/home').then(m => m.Home)
//       },
//       {
//         path: 'products',
//         title: 'Products',
//         loadComponent: () => import('./pages/products/products').then(m => m.Products)
//       },
//       {
//         path: 'about',
//         title: 'About Us',
//         loadComponent: () => import('./pages/about/about').then(m => m.About)
//       },
//       {
//         path: 'contact',
//         title: 'Contact Us',
//         loadComponent: () => import('./pages/contact/contact').then(m => m.Contact)
//       },

//       // --- PRODUCT SUB-MENU ROUTES ---
//       {
//         path: 'products/dairy',
//         loadComponent: () => import('./pages/dairy-products/dairy-products').then(m => m.DairyProducts)
//       },
//       {
//         path: 'products/sweets',
//         loadComponent: () => import('./pages/sweets-menu/sweets-menu').then(m => m.SweetsMenu)
//       },
//       {
//         path: 'products/drink',
//         loadComponent: () => import('./pages/cold-drinks/cold-drinks').then(m => m.ColdDrinks)
//       },
//       {
//         path: 'products/snacks',
//         loadComponent: () => import('./pages/snacks-and-namkeens/snacks-and-namkeens').then(m => m.SnacksAndNamkeens)
//       },
//       // ... (other product routes remain here) ...

//       // --- UTILITY ROUTES ---
//       {
//         path: 'cart',
//         loadComponent: () => import('../app/pages/shopping-cart/shopping-cart').then(m => m.ShoppingCart)
//       },
//       {
//         path: 'orders',
//         loadComponent: () => import('./pages/my-orders/my-orders').then(m => m.MyOrders)
//       },
//       {
//         path: 'account',
//         loadComponent: () => import("./pages/user-accounts/user-accounts").then(m => m.UserAccounts)
//       }
//     ]
//   },

//   // ----------------------------------------------------------------------
//   // 3. ADMIN MODULE ROUTES (Uses Admin Layout Shell)
//   // ----------------------------------------------------------------------
//   {
//     path: 'admin', 
//     children: [
//       {
//         path: '',
//         redirectTo: 'dashboard',
//         pathMatch: 'full'
//       },
//       {
//         path: 'dashboard',
//         title: 'Admin Dashboard',
//         loadComponent: () => import('../app/admin/pages/dashboard/dashboard').then(m => m.AdminDashboardComponent)
//       },
//       {
//         path: 'product',
//         title: 'Product Management',
//         loadComponent: () => import('../app/admin/pages/product-management/product-management').then(m => m.ProductManagement)
//       },
//       {
//         path: 'orders',
//         title: 'Order Management',
//         loadComponent: () => import('../app/admin/pages/order-management/order-management').then(m => m.OrderManagement)
//       },
//       {
//         path: 'users',
//         title: 'User Management',
//         loadComponent: () => import('../app/admin/pages/user-management/user-management').then(m => m.UserManagement)
//       }
//     ]
//   },

//   // ----------------------------------------------------------------------
//   // 4. FALLBACK: Redirect any unknown URL back to the login page
//   // ----------------------------------------------------------------------
//   { path: '**', redirectTo: 'login' },
// ];




import { Routes } from '@angular/router';
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';
import { authGuardGuard } from './guard/auth-guard-guard';       // admin only
import { customerGuard } from './guard/customer-guard';    // any logged-in user

export const routes: Routes = [

  // PUBLIC
  { path: 'login', title: 'Pratik Dairy | Login', component: Login },
  { path: 'signup', title: 'Pratik Dairy | Signup', component: Signup },

  // CUSTOMER ROUTES
  {
    path: '',
    children: [
      { path: '', redirectTo: 'home', pathMatch: 'full' },
      {
        path: 'home',
        title: 'Pratik Dairy & Sweets',
        loadComponent: () => import('./pages/home/home').then(m => m.Home)
      },
      {
        path: 'products',
        title: 'Products',
        loadComponent: () => import('./pages/products/products').then(m => m.Products)
      },
      {
        path: 'about',
        title: 'About Us',
        loadComponent: () => import('./pages/about/about').then(m => m.About)
      },
      {
        path: 'contact',
        title: 'Contact Us',
        loadComponent: () => import('./pages/contact/contact').then(m => m.Contact)
      },
      { path: 'products/dairy', loadComponent: () => import('./pages/dairy-products/dairy-products').then(m => m.DairyProducts) },
      { path: 'products/sweets', loadComponent: () => import('./pages/sweets-menu/sweets-menu').then(m => m.SweetsMenu) },
      { path: 'products/drink', loadComponent: () => import('./pages/cold-drinks/cold-drinks').then(m => m.ColdDrinks) },
      { path: 'products/snacks', loadComponent: () => import('./pages/snacks-and-namkeens/snacks-and-namkeens').then(m => m.SnacksAndNamkeens) },

      // 🔒 PROTECTED: Logged-in users only (customer + admin)
      {
        path: 'cart',
        canActivate: [customerGuard],
        loadComponent: () => import('../app/pages/shopping-cart/shopping-cart').then(m => m.ShoppingCart)
      },
      {
        path: 'orders',
        canActivate: [customerGuard],
        loadComponent: () => import('./pages/my-orders/my-orders').then(m => m.MyOrders)
      },
      {
        path: 'account',
        canActivate: [customerGuard],
        loadComponent: () => import('./pages/user-accounts/user-accounts').then(m => m.UserAccounts)
      }
    ]
  },

  // 🔒 ADMIN ROUTES — protected, admin role only
  {
    path: 'admin',
    canActivate: [authGuardGuard],   // ← guard on parent covers ALL children
    children: [
      { path: '', redirectTo: 'login', pathMatch: 'full' },
      { path: 'dashboard', title: 'Admin Dashboard', loadComponent: () => import('../app/admin/pages/dashboard/dashboard').then(m => m.AdminDashboardComponent) },
      { path: 'product', title: 'Product Management', loadComponent: () => import('../app/admin/pages/product-management/product-management').then(m => m.ProductManagement) },
      { path: 'orders', title: 'Order Management', loadComponent: () => import('../app/admin/pages/order-management/order-management').then(m => m.OrderManagement) },
      { path: 'users', title: 'User Management', loadComponent: () => import('../app/admin/pages/user-management/user-management').then(m => m.UserManagement) }
    ]
  },

  { path: '**', redirectTo: 'login' }
];