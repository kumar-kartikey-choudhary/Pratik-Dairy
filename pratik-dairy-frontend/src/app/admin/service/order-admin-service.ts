import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { OrderResponse, OrderStatus, OrderItemDto } from '../../model';

export type { OrderResponse, OrderStatus, OrderItemDto };

@Injectable({
  providedIn: 'root',
})
export class OrderAdminService {
  private readonly API_URL = `${environment.apiBaseUrl}/orders`;

  constructor(private http: HttpClient) {}

  /** Admin: fetch every order across all customers. */
  getAllOrders(): Observable<OrderResponse[]> {
    return this.http.get<OrderResponse[]>(`${this.API_URL}/admin/findAll`);
  }

  /** Admin: change an order's status. */
  updateStatus(orderId: string, status: OrderStatus): Observable<OrderResponse> {
    const url = `${this.API_URL}/admin/updateStatus/${orderId}?status=${status}`;
    return this.http.put<OrderResponse>(url, {});
  }

  /** Admin: delete an order. */
  deleteOrder(orderId: string): Observable<void> {
    return this.http.delete<void>(`${this.API_URL}/admin/delete/${orderId}`);
  }
}