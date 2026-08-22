import { environment } from '../../../environments/environment';
import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Observable, BehaviorSubject } from 'rxjs';
import { Router } from '@angular/router';
import { AuthService } from '../login/auth-service';
import type { CartItemDto, AddToCart } from '../../model/cart.model';

export type { CartItemDto, AddToCart };

function toGrams(unit: string): number {
  if (!unit) return -1;
  const normalized = unit.trim().toLowerCase().replace(/\s+/g, '');
  const match = normalized.match(/^([\d.]*)([a-z]+)$/);
  if (!match) return -1;

  const quantity = match[1] ? parseFloat(match[1]) : 1; // "kg" => 1 kg
  if (isNaN(quantity) || quantity <= 0) return -1;

  const KILO_UNITS = ['kg', 'kgs', 'kilogram', 'l', 'lt', 'ltr', 'litre', 'liter'];
  const BASE_UNITS = ['g', 'gm', 'gms', 'gram', 'grams', 'ml'];

  if (KILO_UNITS.includes(match[2])) return quantity * 1000;
  if (BASE_UNITS.includes(match[2])) return quantity;
  return -1;
}



/** Mirrors WeightPricing.java on the backend — kept for instant UI feedback only. Backend always recalculates the real price before saving. */
export function computeMultiplier(selectedWeight: string, productBaseUnit: string): number {
  const selectedGrams = toGrams(selectedWeight);
  const baseGrams = toGrams(productBaseUnit);
  if (selectedGrams <= 0 || baseGrams <= 0) return 1; // unit isn't weight-based (litre/pcs) -> no change
  return selectedGrams / baseGrams;
}

@Injectable({ providedIn: 'root' })
export class CartService {
  private cartUrl = `${environment.apiBaseUrl}/carts`;
  private orderUrl = `${environment.apiBaseUrl}/orders`;

  // ✅ Global cart quantity state — keyed by `${productId}_${weight}` so the
  // same product with a different weight is tracked as a separate line.
  private cartStateSubject = new BehaviorSubject<{ [cartKey: string]: number }>({});
  cartState$ = this.cartStateSubject.asObservable();

  // ✅ Global loading state — har product ka apna loading flag
  private loadingStateSubject = new BehaviorSubject<{ [cartKey: string]: boolean }>({});
  loadingState$ = this.loadingStateSubject.asObservable();

  // Currently selected weight per product, defaults to 250g. Purely a UI concern.
  private selectedWeightSubject = new BehaviorSubject<{ [productId: string]: string }>({});
  selectedWeight$ = this.selectedWeightSubject.asObservable();

  constructor(
    private http: HttpClient,
    private authService: AuthService,
    private router: Router,
  ) {}

  // ---------- Login Guard ----------
  private requireLogin(): boolean {
    if (!this.authService.isLoggedIn()) {
      this.router.navigate(['/login']);
      return false;
    }
    return true;
  }

  private cartKey(productId: string, weight: string): string {
    return `${productId}_${weight}`;
  }

  // ---------- Weight selection (per product, before adding to cart) ----------
  selectWeight(productId: string, weight: string): void {
    this.selectedWeightSubject.next({ ...this.selectedWeightSubject.value, [productId]: weight });
  }

  getSelectedWeight(productId: string): string {
    return this.selectedWeightSubject.value[productId] || '1kg';
  }

  /** Display-only price, computed relative to THIS product's own stored unit (e.g. Buffalo Ghee priced per "1kg"). Real price is always recalculated on the backend. */
  getDisplayPrice(basePrice: number, productBaseUnit: string, productId: string): number {
    const weight = this.getSelectedWeight(productId);
    const multiplier = computeMultiplier(weight, productBaseUnit);
    return Math.round(basePrice * multiplier * 100) / 100;
  }

  // ---------- Internal state setters ----------
  private setLoading(cartKey: string, value: boolean): void {
    this.loadingStateSubject.next({ ...this.loadingStateSubject.value, [cartKey]: value });
  }

  private setCartQty(cartKey: string, qty: number): void {
    const current = { ...this.cartStateSubject.value };
    if (qty <= 0) {
      delete current[cartKey];
    } else {
      current[cartKey] = qty;
    }
    this.cartStateSubject.next(current);
  }

  // ---------- Backend sync ----------
  syncCartFromBackend(): void {
    this.getCart().subscribe({
      next: (items) => {
        const state: { [cartKey: string]: number } = {};
        items.forEach((item) => (state[this.cartKey(item.productId, item.weight)] = item.quantity));
        this.cartStateSubject.next(state);
      },
      error: (err) => console.error('Could not load cart:', err),
    });
  }

  // ---------- Global cart actions (har component ye use karega) ----------

  /** Add to cart — login check + API call + state update, sab ek jagah */
  addToCart(productId: string): void {
    if (!this.requireLogin()) return;

    const weight = this.getSelectedWeight(productId);
    const key = this.cartKey(productId, weight);

    this.setLoading(key, true);
    this.addItemToCart(productId, 1, weight).subscribe({
      next: () => {
        this.setCartQty(key, 1);
        this.setLoading(key, false);
      },
      error: (err) => {
        console.error('Add to cart failed:', err);
        this.setLoading(key, false);
      },
    });
  }

  /** Quantity +1 */
  increment(productId: string, weight: string = this.getSelectedWeight(productId)): void {
    if (!this.requireLogin()) return;
    const key = this.cartKey(productId, weight);
    const newQty = (this.cartStateSubject.value[key] || 0) + 1;
    this.updateQuantity(productId, newQty).subscribe({
      next: () => this.setCartQty(key, newQty),
      error: (err) => console.error('Update failed:', err),
    });
  }

  /** Quantity -1, 0 ho to remove */
  decrement(productId: string, weight: string = this.getSelectedWeight(productId)): void {
    if (!this.requireLogin()) return;
    const key = this.cartKey(productId, weight);
    const newQty = (this.cartStateSubject.value[key] || 0) - 1;
    if (newQty <= 0) {
      this.removeItem(productId).subscribe({
        next: () => this.setCartQty(key, 0),
        error: (err) => console.error('Remove failed:', err),
      });
    } else {
      this.updateQuantity(productId, newQty).subscribe({
        next: () => this.setCartQty(key, newQty),
        error: (err) => console.error('Update failed:', err),
      });
    }
  }

  /** HTML mein check karne ke liye */
  isInCart(productId: string, weight: string = this.getSelectedWeight(productId)): boolean {
    return (this.cartStateSubject.value[this.cartKey(productId, weight)] || 0) > 0;
  }

  getQuantity(productId: string, weight: string = this.getSelectedWeight(productId)): number {
    return this.cartStateSubject.value[this.cartKey(productId, weight)] || 0;
  }

  isLoading(productId: string, weight: string = this.getSelectedWeight(productId)): boolean {
    return this.loadingStateSubject.value[this.cartKey(productId, weight)] || false;
  }

  // ---------- Raw API calls (shopping-cart.ts inhe directly bhi use karta hai) ----------

  getCart(): Observable<CartItemDto[]> {
    return this.http.get<CartItemDto[]>(this.cartUrl);
  }

  addItemToCart(productId: string, quantity: number, weight: string): Observable<any> {
    const payload: AddToCart = { productId, quantity, weight };
    return this.http.post<any>(`${this.cartUrl}/items`, payload, {
      responseType: 'text' as 'json',
    });
  }

  updateQuantity(productId: string, newQty: number): Observable<CartItemDto> {
    return this.http.patch<CartItemDto>(`${this.cartUrl}/items/${productId}?quantity=${newQty}`, {});
  }

  removeItem(productId: string): Observable<void> {
    return this.http.delete<void>(`${this.cartUrl}/items/${productId}`);
  }

  checkout(): Observable<any> {
    return this.http.post<any>(`${this.orderUrl}/create`, {});
  }
}