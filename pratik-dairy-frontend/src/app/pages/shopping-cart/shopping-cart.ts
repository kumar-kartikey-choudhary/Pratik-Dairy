// src/app/pages/shopping-cart/shopping-cart.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 
import { NgFor, CurrencyPipe, DecimalPipe } from '@angular/common'; // Pipes for formatting

interface CartItem {
  id: number;
  name: string;
  price: number;
  quantity: number;
  imagePath: string;
}

@Component({
  selector: 'app-shopping-cart',
  templateUrl: './shopping-cart.html',
  styleUrls: ['./shopping-cart.css'],
  standalone: true,
  imports: [RouterLink, FormsModule, NgFor, CurrencyPipe, DecimalPipe]
})
export class ShoppingCart {
  
  // Mock Data for Cart Items
  cartItems: CartItem[] = [
    { id: 101, name: 'Motichoor Ladoo', price: 280.00, quantity: 1, imagePath: 'assets/images/sweets/motichur.jpg' },
    { id: 205, name: 'Malai Paneer', price: 340.00, quantity: 2, imagePath: 'assets/images/dairy/paneer.jpg' },
    { id: 302, name: 'Ratlami Sev (250g)', price: 70.00, quantity: 1, imagePath: 'assets/images/snacks/ratlami.jpg' },
  ];

  // Fixed Fees
  shippingFee: number = 50.00;
  taxRate: number = 0.05; // 5% tax

  constructor() {}

  // --- Calculation Getters ---

  get subtotal(): number {
    return this.cartItems.reduce((acc, item) => acc + (item.price * item.quantity), 0);
  }

  get taxAmount(): number {
    return this.subtotal * this.taxRate;
  }

  get totalAmount(): number {
    return this.subtotal + this.shippingFee + this.taxAmount;
  }

  // --- Action Methods ---

  updateQuantity(itemId: number, newQuantity: number): void {
    const item = this.cartItems.find(i => i.id === itemId);
    if (item) {
      // Ensure quantity is positive
      item.quantity = Math.max(1, newQuantity);
    }
  }

  removeItem(itemId: number): void {
    this.cartItems = this.cartItems.filter(i => i.id !== itemId);
  }

  checkout(): void {
    if (this.cartItems.length > 0) {
      alert(`Proceeding to checkout with a total of ₹ ${this.totalAmount.toFixed(2)}.`);
      // In a real app, this navigates to the payment page: this.router.navigate(['/checkout']);
    } else {
      alert('Your cart is empty!');
    }
  }
}