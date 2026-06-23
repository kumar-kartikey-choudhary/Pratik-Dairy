// import { Injectable } from '@angular/core';
// import { HttpClient, HttpHeaders } from '@angular/common/http';
// import { Observable } from 'rxjs';

// @Injectable({
//   providedIn: 'root'
// })
// export class CartService {
//   // Update this to match your API Gateway route for the Cart Service
//   private baseUrl = 'http://localhost:8080/cart'; 

//   constructor(private http: HttpClient) {}

//   // // Securely passes the authenticated user's ID to the backend

//   //   // Ensure you are saving the 'userId' in localStorage upon successful login
//   //   const userId = localStorage.getItem('userId') || ''; 
//   //   return new HttpHeaders({
//   //     'X-Auth-UserId': userId
//   //   });
//   // }

//   getCart(): Observable<any> {
//     return this.http.get<any>(this.baseUrl);
//   }

//   addItemToCart(productId: string, quantity: number): Observable<any> {
//     const payload = { productId, quantity };
//     return this.http.post<any>(`${this.baseUrl}/items`, payload);
//   }

//   updateQuantity(productId: string, quantity: number): Observable<any> {
//     return this.http.put<any>(`${this.baseUrl}/items/${productId}?quantity=${quantity}`, null);
//   }

//   removeItem(productId: string): Observable<any> {
//     // Sending quantity as 0 triggers your backend's delete logic
//     return this.updateQuantity(productId, 0); 
//   }
// }


import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
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

  private baseUrl = 'http://localhost:8080/carts';

  constructor(private http: HttpClient) {}

  private getHeaders(): HttpHeaders {
    const username = localStorage.getItem('USERNAME') || '';
    return new HttpHeaders({
      'X-Auth-Username': username
    });
  }

  getCart(): Observable<CartItemDto[]> {
    return this.http.get<CartItemDto[]>(this.baseUrl, 
      { headers: this.getHeaders() }
    );
  }

  addItemToCart(productId: string, quantity: number): Observable<any> {
    const payload: AddToCart = { productId, quantity };
    return this.http.post<any>(`${this.baseUrl}/items`, payload, 
      { headers: this.getHeaders() }
    );
  }

  updateQuantity(productId: string, newQty: number): Observable<any> {
    const payload = { productId, quantity: newQty };
    return this.http.patch<any>(
      `${this.baseUrl}/items/${productId}`,
      payload,
      { headers: this.getHeaders() }
    );
  }

  removeItem(productId: string): Observable<void> {
    return this.http.delete<void>(
      `${this.baseUrl}/items/${productId}`,
      { headers: this.getHeaders() }
    );
  }
}