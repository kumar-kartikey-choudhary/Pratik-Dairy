// src/app/admin/pages/admin-dashboard/admin-dashboard.component.ts

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { DecimalPipe } from '@angular/common';
import { forkJoin } from 'rxjs';
import { AdminService } from '../../service/admin-service';
import { OrderAdminService, OrderResponse } from '../../service/order-admin-service';
import { ProductService } from '../../../service/product/product-service';

interface Kpi {
  title: string;
  value: string;
  detail: string;
  colorClass: 'primary' | 'secondary' | 'danger' | 'info';
}

interface RecentOrderRow {
  id: string;
  customer: string;
  total: number;
  status: string;
}

interface LowStockItem {
  name: string;
  stock: number;
  threshold: number;
}

// No stock-threshold field exists on the backend Product model — this is a client-side
// assumption for "low stock" flagging. Adjust to match your actual reorder policy, or
// wire it up to a real field if one gets added to the product entity later.
const LOW_STOCK_THRESHOLD = 10;

@Component({
  selector: 'app-admin-dashboard',
  templateUrl: './dashboard.html',
  styleUrls: ['./dashboard.css'],
  standalone: true,
  imports: [RouterLink, DecimalPipe],
})
export class AdminDashboardComponent implements OnInit {
  kpis: Kpi[] = [];
  recentOrders: RecentOrderRow[] = [];
  lowStockItems: LowStockItem[] = [];

  isLoading = true;
  errorMsg = '';

  constructor(
    private adminService: AdminService,
    private orderAdminService: OrderAdminService,
    private productService: ProductService,
  ) {}

  ngOnInit(): void {
    this.loadDashboard();
  }

  loadDashboard(): void {
    this.isLoading = true;
    this.errorMsg = '';

    forkJoin({
      orders: this.orderAdminService.getAllOrders(),
      products: this.productService.getAllProducts(),
      users: this.adminService.getAllUsers(),
    }).subscribe({
      next: ({ orders, products, users }) => {
        this.buildKpis(orders, products as any[], users as any[]);
        this.buildRecentOrders(orders);
        this.buildLowStockItems(products as any[]);
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dashboard data:', err);
        this.errorMsg = 'Could not load dashboard data. Is the backend running?';
        this.isLoading = false;
      },
    });
  }

  private isSameDay(a: Date, b: Date): boolean {
    return (
      a.getFullYear() === b.getFullYear() &&
      a.getMonth() === b.getMonth() &&
      a.getDate() === b.getDate()
    );
  }

  private daysAgo(date: Date, days: number): boolean {
    const cutoff = new Date();
    cutoff.setDate(cutoff.getDate() - days);
    return date.getTime() >= cutoff.getTime();
  }

  private buildKpis(orders: OrderResponse[], products: any[], users: any[]): void {
    const today = new Date();

    const todaysOrders = orders.filter((o) =>
      this.isSameDay(new Date(o.orderDateTime), today),
    );

    // Revenue from the last 7 days, excluding cancelled orders
    const weeklyRevenue = orders
      .filter((o) => o.status !== 'CANCELLED' && this.daysAgo(new Date(o.orderDateTime), 7))
      .reduce((sum, o) => sum + o.totalAmount, 0);

    const lowStockProducts = products.filter((p) => p.stockQuantity <= LOW_STOCK_THRESHOLD);

    const newCustomers = users.filter((u) => u.createdAt && this.daysAgo(new Date(u.createdAt), 7));

    this.kpis = [
      {
        title: "Today's Orders",
        value: `${todaysOrders.length}`,
        detail: `${orders.length} total all-time`,
        colorClass: 'primary',
      },
      {
        title: 'Weekly Revenue',
        value: `₹ ${weeklyRevenue.toLocaleString('en-IN', { maximumFractionDigits: 0 })}`,
        detail: 'Last 7 days',
        colorClass: 'secondary',
      },
      {
        title: 'Low Stock Alerts',
        value: `${lowStockProducts.length}`,
        detail:
          lowStockProducts.length > 0
            ? lowStockProducts.map((p) => p.productName).slice(0, 2).join(', ')
            : 'All stocked',
        colorClass: 'danger',
      },
      {
        title: 'New Customers',
        value: `${newCustomers.length}`,
        detail: 'This Week',
        colorClass: 'info',
      },
    ];
  }

  private buildRecentOrders(orders: OrderResponse[]): void {
    this.recentOrders = [...orders]
      .sort((a, b) => new Date(b.orderDateTime).getTime() - new Date(a.orderDateTime).getTime())
      .slice(0, 5)
      .map((o) => ({
        id: o.id,
        customer: o.username,
        total: o.totalAmount,
        status: o.status,
      }));
  }

  private buildLowStockItems(products: any[]): void {
    this.lowStockItems = products
      .filter((p) => p.stockQuantity <= LOW_STOCK_THRESHOLD)
      .map((p) => ({
        name: p.productName,
        stock: p.stockQuantity,
        threshold: LOW_STOCK_THRESHOLD,
      }));
  }
}