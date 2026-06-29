import { Injectable } from '@angular/core';
import { HttpClient  } from '@angular/common/http';
import { Observable } from 'rxjs';

export interface CartItemDto {
  id: string;
  username: string;
  productId: string;
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
  private orderUrl = 'http://localhost:8080/orders'

  constructor(private http: HttpClient) {}


  getCart(): Observable<CartItemDto[]> {
    return this.http.get<CartItemDto[]>(this.cartUrl);
  }

  addItemToCart(productId: string, quantity: number): Observable<any> {
    const payload: AddToCart = { productId, quantity };
    return this.http.post<any>(`${this.cartUrl}/items`, payload);
  }

  updateQuantity(productId: string, newQty: number): Observable<any> {
    return this.http.patch<any>(
      `${this.cartUrl}/items/${productId}?quantity=${newQty}`,{});
  }

  removeItem(productId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.cartUrl}/items/${productId}`);
  }

  checkout(): Observable<any>{
    return this.http.post<any>(`${this.orderUrl}/create`,{});
  }
}