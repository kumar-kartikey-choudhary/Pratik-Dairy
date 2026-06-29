// src/app/pages/my-orders/my-orders.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { NgFor, DatePipe, DecimalPipe } from '@angular/common'; // Pipes
import { HttpClient } from '@angular/common/http';

interface OrderItemDto {
  name: string;
  quantity: number;

}

interface OrderResponse {
  id: number;
  date: Date;
  status: 'Processing' | 'Shipped' | 'Delivered' | 'Cancelled';
  total: number;
  items: OrderItemDto[];
}

@Component({
  selector: 'app-my-orders',
  templateUrl: './my-orders.html',
  styleUrls: ['./my-orders.css'],
  standalone: true,
  imports: [RouterLink, DatePipe, DecimalPipe]
})
export class MyOrders{
  orders: OrderResponse[] = [];
  isLoading = true;
  errorMsg ='';

  private orderUrl = 'http://localhost:8080/orders';
  constructor(private http :HttpClient) {}

  ngOnInit() : void{
    this.loadOrders();
  }

  loadOrders(): void{
    this.isLoading = true;
    this.http.get<OrderResponse[]> (this.orderUrl).subscribe({
      next: (data) =>
      {
        this.orders = data;
        this.isLoading = false;
      },
      error: ()=>{
        this.errorMsg = 'Order has not placed yet';
        this.isLoading = false;
      }
    })
  }
}