// import { Injectable } from '@angular/core';
// import { HttpClient  } from '@angular/common/http';
// import { Observable } from 'rxjs';

// export interface CartItemDto {
//   id: string;
//   username: string;
//   productId: string;
//   quantity: number;
//   pricePerUnit: number;
//   subtotal: number;
// }

// export interface AddToCart {
//   productId: string;
//   quantity: number;
// }

// @Injectable({ providedIn: 'root' })
// export class CartService {

//   private cartUrl = 'http://localhost:8080/carts';
//   private orderUrl = 'http://localhost:8080/orders'

//   constructor(private http: HttpClient) {}


//   getCart(): Observable<CartItemDto[]> {
//     return this.http.get<CartItemDto[]>(this.cartUrl);
//   }

//   addItemToCart(productId: string, quantity: number): Observable<any> {
//     const payload: AddToCart = { productId, quantity };
//     return this.http.post<any>(`${this.cartUrl}/items`, payload);
//   }

//   updateQuantity(productId: string, newQty: number): Observable<any> {
//     return this.http.patch<any>(
//       `${this.cartUrl}/items/${productId}?quantity=${newQty}`,{});
//   }

//   removeItem(productId: string): Observable<void> {
//     return this.http.delete<void>(
//       `${this.cartUrl}/items/${productId}`);
//   }

//   checkout(): Observable<any>{
//     return this.http.post<any>(`${this.orderUrl}/create`,{});
//   }
// }




import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth-service';

export interface CartItemDto {
  id: string;
  username: string;
  productId: string;
  productName: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
}

export interface AddToCart {
  productId: string;
  quantity: number;
}

@Injectable({ providedIn: 'root' })
export class CartService {

  private cartUrl = 'http://localhost:8080/carts';
  private orderUrl = 'http://localhost:8080/orders';

  // ✅ Global cart quantity state — { productId: quantity }
  private cartStateSubject = new BehaviorSubject<{ [productId: string]: number }>({});
  cartState$ = this.cartStateSubject.asObservable();

  // ✅ Global loading state — har product ka apna loading flag
  private loadingStateSubject = new BehaviorSubject<{ [productId: string]: boolean }>({});
  loadingState$ = this.loadingStateSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router
  ) {}

  // ---------- Login Guard ----------
  private requireLogin(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  // ---------- Internal state setters ----------
  private setLoading(productId: string, value: boolean): void {
    this.loadingStateSubject.next({ ...this.loadingStateSubject.value, [productId]: value });
  }

  private setCartQty(productId: string, qty: number): void {
    const current = { ...this.cartStateSubject.value };
    if (qty <= 0) {
      delete current[productId];
    } else {
      current[productId] = qty;
    }
    this.cartStateSubject.next(current);
  }

  // ---------- Backend sync ----------
  syncCartFromBackend(): void {
    this.getCart().subscribe({
      next: (items) => {
        const state: { [productId: string]: number } = {};
        items.forEach(item => state[item.productId] = item.quantity);
        this.cartStateSubject.next(state);
      },
      error: (err) => console.error('Could not load cart:', err)
    });
  }

  // ---------- Global cart actions (har component ye use karega) ----------

  /** Add to cart — login check + API call + state update, sab ek jagah */
  addToCart(productId: string): void {
    if (!this.requireLogin()) return;

    this.setLoading(productId, true);
    this.addItemToCart(productId, 1).subscribe({
      next: () => {
        this.setCartQty(productId, 1);
        this.setLoading(productId, false);
      },
      error: (err) => {
        console.error('Add to cart failed:', err);
        this.setLoading(productId, false);
      }
    });
  }

  /** Quantity +1 */
  increment(productId: string): void {
    if (!this.requireLogin()) return;
    const newQty = (this.cartStateSubject.value[productId] || 0) + 1;
    this.updateQuantity(productId, newQty).subscribe({
      next: () => this.setCartQty(productId, newQty),
      error: (err) => console.error('Update failed:', err)
    });
  }

  /** Quantity -1, 0 ho to remove */
  decrement(productId: string): void {
    if (!this.requireLogin()) return;
    const newQty = (this.cartStateSubject.value[productId] || 0) - 1;
    if (newQty <= 0) {
      this.removeItem(productId).subscribe({
        next: () => this.setCartQty(productId, 0),
        error: (err) => console.error('Remove failed:', err)
      });
    } else {
      this.updateQuantity(productId, newQty).subscribe({
        next: () => this.setCartQty(productId, newQty),
        error: (err) => console.error('Update failed:', err)
      });
    }
  }

  /** HTML mein check karne ke liye */
  isInCart(productId: string): boolean {
    return (this.cartStateSubject.value[productId] || 0) > 0;
  }

  getQuantity(productId: string): number {
    return this.cartStateSubject.value[productId] || 0;
  }

  isLoading(productId: string): boolean {
    return this.loadingStateSubject.value[productId] || false;
  }

  // ---------- Raw API calls (shopping-cart.ts inhe directly bhi use karta hai) ----------

  getCart(): Observable<CartItemDto[]> {
    return this.http.get<CartItemDto[]>(this.cartUrl);
  }

  addItemToCart(productId: string, quantity: number): Observable<any> {
    const payload: AddToCart = { productId, quantity };
    return this.http.post<any>(`${this.cartUrl}/items`, payload);
  }

  updateQuantity(productId: string, newQty: number): Observable<any> {
    return this.http.patch<any>(`${this.cartUrl}/items/${productId}?quantity=${newQty}`, {});
  }

  removeItem(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.cartUrl}/items/${productId}`);
  }

  checkout(): Observable<any> {
    return this.http.post<any>(`${this.orderUrl}/create`, {});
  }
}