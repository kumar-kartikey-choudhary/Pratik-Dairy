// src/app/admin/pages/order-management/order-management.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, DatePipe, CurrencyPipe, DecimalPipe } from '@angular/common'; // Pipes for formatting

interface Order {
  id: number;
  customerName: string;
  orderDate: Date;
  total: number;
  status: 'New' | 'Processing' | 'Ready' | 'Delivered' | 'Cancelled';
}

@Component({
  selector: 'app-order-management',
  templateUrl: './order-management.html',
  styleUrls: ['./order-management.css'],
  standalone: true,
  imports: [RouterLink, FormsModule,  DatePipe, DecimalPipe]
})
export class OrderManagement {
  
  // Mock Data
  private allOrders: Order[] = [
    
    { id: 1007, customerName: 'Priya Sharma', orderDate: new Date('2025-11-10T14:30:00'), total: 1250, status: 'New' },
    { id: 1006, customerName: 'Ravi Kumar', orderDate: new Date('2025-11-09T09:15:00'), total: 340, status: 'Processing' },
    { id: 1005, customerName: 'Anita Jha', orderDate: new Date('2025-11-08T18:00:00'), total: 4500, status: 'Delivered' },
    { id: 1004, customerName: 'Mohan Das', orderDate: new Date('2025-11-08T11:45:00'), total: 680, status: 'Ready' },
    { id: 1003, customerName: 'Kirti Varma', orderDate: new Date('2025-11-07T10:00:00'), total: 180, status: 'Cancelled' },
    { id: 1002, customerName: 'Vivek Singh', orderDate: new Date('2025-11-06T15:00:00'), total: 999, status: 'New' },
  ];
  
  // State for filtering
  selectedStatus: string = 'All';
  searchTerm: string = '';
  
  statusOptions = ['All', 'New', 'Processing', 'Ready', 'Delivered', 'Cancelled'];

  // Getter for filtered orders
  get filteredOrders(): Order[] {
    let orders = this.allOrders;

    // 1. Filter by Status
    if (this.selectedStatus !== 'All') {
      orders = orders.filter(order => order.status === this.selectedStatus);
    }

    // 2. Filter by Search Term (ID or Customer Name)
    if (this.searchTerm) {
      const term = this.searchTerm.toLowerCase();
      orders = orders.filter(order => 
        order.customerName.toLowerCase().includes(term) || 
        order.id.toString().includes(term)
      );
    }
    
    // Sort by date (newest first)
    return orders.sort((a, b) => b.orderDate.getTime() - a.orderDate.getTime());
  }

  // Placeholder function for action buttons
  updateStatus(orderId: number, newStatus: string): void {
    alert(`Order #${orderId} status changed to ${newStatus}`);
    // In a real app, this would call adminDataService.updateOrderStatus()
  }
}