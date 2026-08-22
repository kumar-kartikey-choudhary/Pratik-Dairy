import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Router, RouterModule } from '@angular/router';
import { CartService } from '../../service/cart/CartService';
import { ToastService } from '../../core/services/toast.service';
import { CartItemDto } from '../../model/cart.model';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule, RouterModule],
  templateUrl: './shopping-cart.html',
  styleUrls: ['./shopping-cart.css']
})
export class ShoppingCart implements OnInit {
  cartItems: CartItemDto[] = [];
  subtotalAmount: number = 0;
  totalAmount: number = 0;
  totalCount: number = 0;
  isLoading: boolean = false;
  isCheckingOut: boolean = false;

  constructor(
    private cartService: CartService,
    private toastService: ToastService,
    private router: Router
  ) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (items: CartItemDto[]) => {
        this.cartItems = items || [];
        this.calculateTotals();
        this.isLoading = false;
      },
      error: () => {
        this.toastService.error('Failed to load cart items');
        this.isLoading = false;
      }
    });
  }

  calculateTotals(): void {
    this.totalCount = this.cartItems.reduce((acc, item) => acc + (item.quantity || 0), 0);
    this.subtotalAmount = this.cartItems.reduce((acc, item) => {
      const lineSubtotal = item.subtotal != null ? item.subtotal : (item.pricePerUnit * item.quantity);
      return acc + Number(lineSubtotal);
    }, 0);
    this.totalAmount = this.subtotalAmount;
  }

  increaseQuantity(item: CartItemDto): void {
    const newQty = item.quantity + 1;
    this.cartService.updateQuantity(item.productId, newQty).subscribe({
      next: (updatedDto: any) => {
        item.quantity = newQty;
        item.subtotal = updatedDto?.subtotal ?? (item.pricePerUnit * newQty);
        this.calculateTotals();
      },
      error: (err) => {
        this.toastService.error(err?.error?.message || 'Failed to update quantity');
      }
    });
  }

  decreaseQuantity(item: CartItemDto): void {
    if (item.quantity <= 1) {
      this.removeItem(item.productId);
      return;
    }
    const newQty = item.quantity - 1;
    this.cartService.updateQuantity(item.productId, newQty).subscribe({
      next: (updatedDto: any) => {
        item.quantity = newQty;
        item.subtotal = updatedDto?.subtotal ?? (item.pricePerUnit * newQty);
        this.calculateTotals();
      },
      error: (err) => {
        this.toastService.error(err?.error?.message || 'Failed to update quantity');
      }
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        this.cartItems = this.cartItems.filter(item => item.productId !== productId);
        this.calculateTotals();
        this.toastService.success('Item removed from cart');
      },
      error: () => {
        this.toastService.error('Failed to remove item');
      }
    });
  }
  checkout(): void {
    if (this.cartItems.length === 0) {
      this.toastService.error('Your cart is empty. Add items before checking out.');
      return;
    }

    this.isCheckingOut = true;

    this.cartService.checkout().subscribe({
      next: () => {
        this.cartItems = [];
        this.isCheckingOut = false;
        this.cartService.syncCartFromBackend();
        this.toastService.success('Order placed successfully!');
        this.router.navigate(['/orders']);
      },
      error: (err) => {
        console.error('Checkout failed:', err);
        this.toastService.error('Failed to place order. Some items may be out of stock.');
        this.isCheckingOut = false;
      },
    });
  }
}