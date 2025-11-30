// import { Routes, Router } from '@angular/router';
// import { inject } from '@angular/core';
// import { AuthService } from './service/login/auth-service';
// import { Login } from './pages/login/login';
// import { Signup } from './pages/signup/signup';
// import { AdminDashboardComponent } from './admin/pages/dashboard/dashboard';

// // --- Auth Guard ---
// // export const authGuard = () => {
// //   const authService = inject(AuthService);
// //   const router = inject(Router);

// //   if (authService.isLoggedIn()) {
// //     return true; // User is logged in
// //   } else {
// //     return router.createUrlTree(['/login']); // Redirect unauthenticated users
// //   }
// // };

// // --- Admin Guard ---
// // export const adminGuard = () => {
// //   const authService = inject(AuthService);
// //   const router = inject(Router);

// //   if (authService.isAdmin()) {
// //     return true; // Admin allowed
// //   } else {
// //     return router.createUrlTree(['/login']); // Non-admin users redirected
// //   }
// // };

// export const routes: Routes = [
//   // Public routes
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

//   // Customer / authenticated routes
//   {
//     path: '',
//     // canActivate: [authGuard],
//     children: [
//       {
//         path: '',
//         redirectTo: 'home',
//         pathMatch: 'full'
//       },
//       {
//         path: 'home',
//         title: 'Pratik Dairy & Sweets',
//         loadComponent: () => import('../app/pages/home/home').then(m => m.Home)
//       },
//       {
//         path: 'products',
//         title: 'Products',
//         loadComponent: () => import('../app/pages/products/products').then(m => m.Products)
//       },
//       {
//         path: 'cart',
//         title: 'Shopping Cart',
//         loadComponent: () => import('../app/pages/shopping-cart/shopping-cart').then(m => m.ShoppingCart)
//       },
//       {
//         path: 'orders',
//         title: 'My Orders',
//         loadComponent: () => import('../app/pages/my-orders/my-orders').then(m => m.MyOrders)
//       },
//       {
//         path: 'account',
//         title: 'My Account',
//         loadComponent: () => import('../app/pages/user-accounts/user-accounts').then(m => m.UserAccounts)
//       }
//     ]
//   },

//   // Admin routes
//   {
//     path: 'admin',
//     // canActivate: [adminGuard],
//     children: [
//       {
//         path: '',
//         redirectTo: 'dashboard',
//         pathMatch: 'full'
//       },
//       {
//         path: 'dashboard',
//         title: 'Admin Dashboard',
//         component: AdminDashboardComponent
//       },
//       {
//         path: 'product',
//         title: 'Product Management',
//         loadComponent: () => import('../app/admin/pages/product-management/product-management').then(m => m.ProductManagement)
//       },
//       {
//         path: 'order',
//         title: 'Order Management',
//         loadComponent: () => import('../app/admin/pages/order-management/order-management').then(m => m.OrderManagement)
//       },
//       {
//         path: 'user',
//         title: 'User Management',
//         loadComponent: () => import('../app/admin/pages/user-management/user-management').then(m => m.UserManagement)
//       }
//     ]
//   },

//   // Fallback
//   { path: '**', redirectTo: 'login' }
// ];



//updated routes 

// // src/app/app.routes.ts

// import { Routes, Router } from '@angular/router';
// import { inject } from '@angular/core';

// // --- AUTHENTICATION IMPORTS (These need to be created/verified) ---
// // Assuming your Login component is located here (we'll use the name 'LoginComponent' for best practice)
// // Since you provided 'UserAccounts', we'll use that class name, assuming it's the login page.
// import { AuthService } from './service/login/auth-service';
// import { Login } from './pages/login/login';
// import { AdminDashboardComponent } from './admin/pages/dashboard/dashboard';
// import { Signup } from './pages/signup/signup';

// // --- Auth Guard Function ---
// // This function checks the login status and redirects to '/login' if needed.
// // export const authGuard = () => {
// //     const authService = inject(AuthService);
// //     const router = inject(Router);

// //     if (authService.isLoggedIn()) {
// //       return true; // User is logged in, allow access
// //     } else {
// //       // User is NOT logged in, redirect to the login page
// //       return router.createUrlTree(['/login']); 
// //     }
// // };


// export const routes: Routes = [

//   // 1. PUBLIC ROUTE: The only page accessible before login
//   {
//     path: 'login',
//     title: 'Pratik Dairy | Login',
//     component: Login , // Using your existing UserAccounts component as the Login view
//   },
//   {
//     path:'signup',
//     title: 'Pratik Dairy | Signup',
//     component: Signup,
//   },
//   {
//     path: 'admin',
//     title: 'Pratik Dairy | Admin',
//     component: AdminDashboardComponent, // Using your existing UserAccounts component as the Login view
//   },

//   // 2. SECURED ROUTES: All pages the user wants to access after logging in
//   {
//     path: '', // Base path for logged-in users
//     // canActivate: [authGuard], // PROTECT ALL CHILD ROUTES
//     children: [
//       {
//         path: '', 
//         redirectTo: 'home', 
//         pathMatch: 'full'
//       },
      
//       // --- MAIN NAVIGATION ROUTES (Protected) ---
//       {
//         path: 'home',
//         title: 'Pratik Dairy & Sweets',
//         loadComponent: () => import('./pages/home/home').then(m => m.Home)
//       },
//       {
//         path: 'products',
//         title: 'Pratik Dairy & Sweets | Our Products',
//         loadComponent: () => import('./pages/products/products').then(m => m.Products)
//       },
//       {
//         path: 'about',
//         title: 'Pratik Dairy & Sweets | About Us',
//         loadComponent: () => import('./pages/about/about').then(m => m.About)
//       },
//       {
//         path: 'contact',
//         title: 'Pratik Dairy & Sweets | Contact Us',
//         loadComponent: () => import('./pages/contact/contact').then(m => m.Contact)
//       },

//       // --- PRODUCT SUB-MENU ROUTES (Protected) ---
//       {
//         path: 'products/dairy',
//         title: 'Pratik Dairy & Sweets | Dairy Products',
//         loadComponent: () => import('./pages/dairy-products/dairy-products').then(m => m.DairyProducts)
//       },
//       {
//         path: 'products/sweets',
//         title: 'Pratik Dairy & Sweets | Sweets Menu',
//         loadComponent: () => import('./pages/sweets-menu/sweets-menu').then(m => m.SweetsMenu)
//       },
//       {
//         path: 'products/snacks',
//         title: 'Pratik Dairy & Sweets | Snacks & Namkeen',
//         loadComponent: () => import('./pages/snacks-and-namkeens/snacks-and-namkeens').then(m => m.SnacksAndNamkeens)
//       },
//       {
//         path: 'products/colddrinks',
//         title: 'Pratik Dairy & Sweets | Cold Drinks',
//         loadComponent: () => import('./pages/cold-drinks/cold-drinks').then(m => m.ColdDrinks)
//       },
//       {
//         path: 'products/other',
//         title: 'Pratik Dairy & Sweets | Other Products',
//         loadComponent: () => import('./pages/other-products/other-products').then(m => m.OtherProducts)
//       },

//       // --- UTILITY/ACCOUNT ROUTES (Protected) ---
//       {
//         path: 'cart',
//         title: 'Pratik Dairy & Sweets | Shopping Cart',
//         loadComponent: () => import('./pages/shopping-cart/shopping-cart').then(m => m.ShoppingCart)
//       },
//       {
//         path: 'orders',
//         title: 'Pratik Dairy & Sweets | My Orders',
//         loadComponent: () => import('./pages/my-orders/my-orders').then(m => m.MyOrders)
//       },
//       {
//         path: 'account',
//         title: 'Pratik Dairy & Sweets | My Account',
//         loadComponent:() => import("./pages/user-accounts/user-accounts").then(m => m.UserAccounts)
//       },

//       // Admin
//       {
//         path: 'order',
//         title: 'Pratik Dairy & Sweets | Order-Management ',
//         loadComponent:() => import("./admin/pages/order-management/order-management").then(m => m.OrderManagement)
//       },
//       {
//         path: 'product',
//         title: 'Pratik Dairy & Sweets | Product-Management ',
//         loadComponent:() => import("./admin/pages/product-management/product-management").then(m => m.ProductManagement)
//       },
//       {
//         path: 'user',
//         title: 'Pratik Dairy & Sweets | User-Management ',
//         loadComponent:() => import("./admin/pages/user-management/user-management").then(m => m.UserManagement)
//       },
//     ]
//   },
  
//   // 3. FALLBACK: Redirect any unknown URL to the login page
//   { path: '**', redirectTo: '**' },
// ];





// src/app/app.routes.ts (FINALIZED UNGUARDED ROUTES)

import { Routes } from '@angular/router';

// --- Imports (Load all components synchronously for Router) ---
// Public Components
import { Login } from './pages/login/login';
import { Signup } from './pages/signup/signup';

// Admin Components (Required for route definition)
import { AdminDashboardComponent } from './admin/pages/dashboard/dashboard'; // Assuming file is component.ts
import { ProductManagement } from './admin/pages/product-management/product-management';
import { OrderManagement } from './admin/pages/order-management/order-management';
import { UserManagement } from './admin/pages/user-management/user-management';
// Layout Component (Needed for Admin Shell)
// import { AdminLayoutComponent } from './admin/components/admin-layout/admin-layout.component';


export const routes: Routes = [

  // ----------------------------------------------------------------------
  // 1. PUBLIC ROUTES (Accessible to everyone)
  // ----------------------------------------------------------------------
  {
    path: 'login',
    title: 'Pratik Dairy | Login',
    component: Login
  },
  {
    path: 'signup',
    title: 'Pratik Dairy | Signup',
    component: Signup
  },

  // ----------------------------------------------------------------------
  // 2. MAIN APPLICATION ROUTES (Customer Interface)
  // ----------------------------------------------------------------------
  {
    path: '', // Base path
    children: [
      {
        path: '', 
        redirectTo: 'home', 
        pathMatch: 'full'
      },
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

      // --- PRODUCT SUB-MENU ROUTES ---
      {
        path: 'products/dairy',
        loadComponent: () => import('./pages/dairy-products/dairy-products').then(m => m.DairyProducts)
      },
      {
        path: 'products/sweets',
        loadComponent: () => import('./pages/sweets-menu/sweets-menu').then(m => m.SweetsMenu)
      },
      {
        path: 'products/drink',
        loadComponent: () => import('./pages/cold-drinks/cold-drinks').then(m => m.ColdDrinks)
      },
      {
        path: 'products/snacks',
        loadComponent: () => import('./pages/snacks-and-namkeens/snacks-and-namkeens').then(m => m.SnacksAndNamkeens)
      },
      // ... (other product routes remain here) ...

      // --- UTILITY ROUTES ---
      {
        path: 'cart',
        loadComponent: () => import('../app/pages/shopping-cart/shopping-cart').then(m => m.ShoppingCart)
      },
      {
        path: 'orders',
        loadComponent: () => import('./pages/my-orders/my-orders').then(m => m.MyOrders)
      },
      {
        path: 'account',
        loadComponent: () => import("./pages/user-accounts/user-accounts").then(m => m.UserAccounts)
      }
    ]
  },

  // ----------------------------------------------------------------------
  // 3. ADMIN MODULE ROUTES (Uses Admin Layout Shell)
  // ----------------------------------------------------------------------
  {
    path: 'admin', 
    children: [
      {
        path: '',
        redirectTo: 'dashboard',
        pathMatch: 'full'
      },
      {
        path: 'dashboard',
        title: 'Admin Dashboard',
        loadComponent: () => import('../app/admin/pages/dashboard/dashboard').then(m => m.AdminDashboardComponent)
      },
      {
        path: 'product',
        title: 'Product Management',
        loadComponent: () => import('../app/admin/pages/product-management/product-management').then(m => m.ProductManagement)
      },
      {
        path: 'orders',
        title: 'Order Management',
        loadComponent: () => import('../app/admin/pages/order-management/order-management').then(m => m.OrderManagement)
      },
      {
        path: 'users',
        title: 'User Management',
        loadComponent: () => import('../app/admin/pages/user-management/user-management').then(m => m.UserManagement)
      }
    ]
  },

  // ----------------------------------------------------------------------
  // 4. FALLBACK: Redirect any unknown URL back to the login page
  // ----------------------------------------------------------------------
  { path: '**', redirectTo: 'login' },
];