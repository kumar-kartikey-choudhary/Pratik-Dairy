// src/app/admin/pages/admin-dashboard/admin-dashboard.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe, NgFor } from '@angular/common'; // For looping lists/stats
// import { AdminDataService } from '../../service/admin-data.service'; // To fetch admin data

interface Kpi {
  title: string;
  value: string;
  detail: string;
  colorClass: 'primary' | 'secondary' | 'danger' | 'info';
}

interface Order {
  id: number;
  customer: string;
  total: number;
  status: 'New' | 'Processing' | 'Delivered' | 'Cancelled';
}

interface LowStockItem {
  name: string;
  stock: number;
  threshold: number;
}


@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'], 
  standalone: true,
  imports: [RouterLink, NgFor, DecimalPipe]
})
export class AdminDashboardComponent {
  
  // Mock Data for KPIs
  kpis: Kpi[] = [
    { title: "Today's Orders", value: "8", detail: "+3 Since Yesterday", colorClass: 'primary' },
    { title: "Weekly Revenue", value: "₹ 14,500", detail: "Target: ₹ 20k", colorClass: 'secondary' },
    { title: "Low Stock Alerts", value: "2", detail: "Paneer & Motichoor Ladoo", colorClass: 'danger' },
    { title: "New Customers", value: "7", detail: "This Week", colorClass: 'info' },
  ];

  // Mock Data for Recent Orders
  recentOrders: Order[] = [
    { id: 1004, customer: "Ritu K.", total: 680, status: 'Processing' },
    { id: 1003, customer: "Sanjay M.", total: 1250, status: 'New' },
    { id: 1002, customer: "Priya T.", total: 340, status: 'Delivered' },
    { id: 1001, customer: "Admin Test", total: 4500, status: 'Cancelled' },
  ];

  // Mock Data for Inventory Snapshot
  lowStockItems: LowStockItem[] = [
    { name: 'Fresh Paneer', stock: 4, threshold: 10 },
    { name: 'Pure Cow Ghee', stock: 12, threshold: 15 },
    { name: 'Motichoor Ladoo', stock: 50, threshold: 100 },
  ];

  // Inject service if needed later, but we use mock data for now
  constructor() {}
}
