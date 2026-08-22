import { environment } from '../../../environments/environment';
// src/app/pages/my-orders/my-orders.component.ts

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DatePipe, DecimalPipe } from '@angular/common';
import { HttpClient } from '@angular/common/http';
import { DomSanitizer } from '@angular/platform-browser';
import type { OrderResponse, OrderItemDto } from '../../model';

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css'],
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe],
})
export class MyOrders implements OnInit {
  orders: OrderResponse[] = [];
  isLoading = true;
  errorMsg = '';

  private orderUrl = `${environment.apiBaseUrl}/orders/findByCustomer`;

  constructor(
    private http: HttpClient,
    private sanitizer: DomSanitizer,
  ) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.http.get<OrderResponse[]>(this.orderUrl).subscribe({
      next: (data) => {
        const mappedOrders = data.map((order) => ({
          ...order,
          items: order.items.map((item) => this.mapItemImage(item)),
        }));
        // 2. Sort the orders array in descending order (newest first)
        this.orders = mappedOrders.sort((a, b) => {
          const dateA = new Date(a.orderDateTime).getTime();
          const dateB = new Date(b.orderDateTime).getTime();
          return dateB - dateA; // B - A ensures descending order
        });
        this.isLoading = false;
      },
      error: () => {
        this.errorMsg = 'Could not load your orders. Please try again.';
        this.isLoading = false;
      },
    });
  }

  private mapItemImage(item: OrderItemDto): OrderItemDto {
    if (item.imageData) {
      return {
        ...item,
        imageData: this.sanitizer.bypassSecurityTrustUrl(
          `data:image/jpeg;base64,${item.imageData}`,
        ),
      };
    }
    return { ...item, imageData: 'assets/images/placeholder.png' };
  }
}