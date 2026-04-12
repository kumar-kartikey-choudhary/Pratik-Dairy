import { Injectable } from '@angular/core';
import { HttpClient, HttpHeaders } from '@angular/common/http';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root'
})
export class CartService {
  // Update this to match your API Gateway route for the Cart Service
  private baseUrl = 'http://localhost:8080/cart'; 

  constructor(private http: HttpClient) {}

  // Securely passes the authenticated user's ID to the backend
  private getHeaders(): HttpHeaders {
    // Ensure you are saving the 'userId' in localStorage upon successful login
    const userId = localStorage.getItem('userId') || ''; 
    return new HttpHeaders({
      'X-Auth-UserId': userId
    });
  }

  getCart(): Observable<any> {
    return this.http.get<any>(this.baseUrl, { headers: this.getHeaders() });
  }

  addItemToCart(productId: string, quantity: number): Observable<any> {
    const payload = { productId, quantity };
    return this.http.post<any>(`${this.baseUrl}/items`, payload, { headers: this.getHeaders() });
  }

  updateQuantity(productId: string, quantity: number): Observable<any> {
    return this.http.put<any>(`${this.baseUrl}/items/${productId}?quantity=${quantity}`, null, { headers: this.getHeaders() });
  }

  removeItem(productId: string): Observable<any> {
    // Sending quantity as 0 triggers your backend's delete logic
    return this.updateQuantity(productId, 0); 
  }
}