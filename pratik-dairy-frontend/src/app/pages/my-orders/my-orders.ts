// src/app/pages/my-orders/my-orders.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, DatePipe, DecimalPipe } from '@angular/common'; // Pipes

interface OrderItem {
  name: string;
  quantity: number;
}

interface Order {
  id: number;
  date: Date;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItem[];
}

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css'],
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe]
})
export class MyOrders{
  
  // Mock Data for Customer Orders
  orders: Order[] = [
    {
      id: 202501,
      date: new Date('2025-11-10T14:30:00'),
      status: 'Processing',
      total: 1250.00,
      items: [
        { name: 'Kaju Katli (500g)', quantity: 1 },
        { name: 'Malai Paneer (1kg)', quantity: 2 }
      ]
    },
    {
      id: 202502,
      date: new Date('2025-10-25T09:00:00'),
      status: 'Shipped',
      total: 340.00,
      items: [
        { name: 'Pure Cow Ghee (500g)', quantity: 1 },
        { name: 'Fresh Dahi (1kg)', quantity: 1 }
      ]
    },
    {
      id: 202503,
      date: new Date('2025-09-01T11:00:00'),
      status: 'Delivered',
      total: 800.00,
      items: [
        { name: 'Besan Ladoo (1kg)', quantity: 2 }
      ]
    }
  ];
  
  constructor() {}
}