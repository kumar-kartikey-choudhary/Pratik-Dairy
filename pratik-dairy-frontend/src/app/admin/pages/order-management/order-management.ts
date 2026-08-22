// src/app/admin/pages/order-management/order-management.component.ts

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { DatePipe, DecimalPipe } from '@angular/common';
import { OrderAdminService, OrderResponse, OrderStatus } from '../../service/order-admin-service';

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.html',
  styleUrls: ['./order-management.css'],
  standalone: true,
  imports: [RouterLink, FormsModule, DatePipe, DecimalPipe],
})
export class OrderManagement implements OnInit {
  private allOrders: OrderResponse[] = [];

  isLoading = true;
  errorMsg = '';

  // State for filtering
  selectedStatus: string = 'All';
  searchTerm: string = '';

  statusOptions = ['All', 'PROCESSING', 'CONFIRMED', 'SHIPPED', 'DELIVERED', 'CANCELLED'];

  // Options an admin can move an order TO, per row
  readonly assignableStatuses: OrderStatus[] = [
    'PROCESSING',
    'CONFIRMED',
    'SHIPPED',
    'DELIVERED',
    'CANCELLED',
  ];

  constructor(private orderAdminService: OrderAdminService) {}

  ngOnInit(): void {
    this.loadOrders();
  }

  loadOrders(): void {
    this.isLoading = true;
    this.errorMsg = '';
    this.orderAdminService.getAllOrders().subscribe({
      next: (orders) => {
        this.allOrders = orders;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load orders:', err);
        this.errorMsg = 'Could not load orders. Is the backend running?';
        this.isLoading = false;
      },
    });
  }

  // Getter for filtered orders
  get filteredOrders(): OrderResponse[] {
    let orders = this.allOrders;

    // 1. Filter by Status
    if (this.selectedStatus !== 'All') {
      orders = orders.filter((order) => order.status === this.selectedStatus);
    }

    // 2. Filter by Search Term (ID or Customer Name)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      orders = orders.filter(
        (order) =>
          order.username.toLowerCase().includes(term) || order.id.toLowerCase().includes(term),
      );
    }

    // Sort by date (newest first)
    return [...orders].sort(
      (a, b) => new Date(b.orderDateTime).getTime() - new Date(a.orderDateTime).getTime(),
    );
  }

  updateStatus(orderId: string, newStatus: string): void {
    const status = newStatus as OrderStatus;
    this.orderAdminService.updateStatus(orderId, status).subscribe({
      next: (updated) => {
        const idx = this.allOrders.findIndex((o) => o.id === orderId);
        if (idx !== -1) {
          this.allOrders[idx] = { ...this.allOrders[idx], status: updated.status };
        }
      },
      error: (err) => {
        console.error('Failed to update order status:', err);
        alert('Could not update order status. Please try again.');
      },
    });
  }
}