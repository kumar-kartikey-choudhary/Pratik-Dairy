import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItemDto } from '../../service/cart/CartService';
import { Router } from '@angular/router';
import { AuthService } from '../../service/login/auth-service';

@Component({
  selector: 'app-shopping-cart',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './shopping-cart.html',
  styleUrl: './shopping-cart.css'
})
export class ShoppingCart implements OnInit {

  cartItems: CartItemDto[] = [];
  isLoading = true;
  errorMsg = '';
  isCheckingOut = false;

  constructor(private cartService: CartService, private router: Router) { }
  ngOnInit(): void {
    this.loadCart();
  }


  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (items) => {
        console.log('Cart response:', items);
        this.cartItems = items;
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Cart error:', err);
        this.errorMsg = 'Cart load nahi ho saka. Dobara try karein.';
        this.isLoading = false;
      }
    });
  }

  removeItem(productId: string): void {
    this.cartService.removeItem(productId).subscribe({
      next: () => {
        // Local se bhi hata do — API call nahi padega dobara
        this.cartItems = this.cartItems.filter(
          item => item.productId !== productId
        );
      },
      error: () => {
        this.errorMsg = 'Item remove nahi ho saka.';
      }
    });
  }

  increaseQuantity(item: CartItemDto): void {
    this.cartService.addItemToCart(item.productId, 1).subscribe({
      next: () => {
        item.quantity += 1;
        item.subtotal = item.pricePerUnit * item.quantity;
      },
      error: () => {
        this.errorMsg = 'Quantity has not increased, Please check the stock';
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
      next: () => {
        item.quantity = newQty;
        item.subtotal = item.pricePerUnit * item.quantity;
      },
      error: () => {
        this.errorMsg = 'Quantity has not updated';
      }
    })
  }

  checkout(): void {
    if (this.cartItems.length === 0) {
      this.errorMsg = 'Caert is enmpty, please add item to cart';
      return;
    }
    this.isCheckingOut = true;
    this.cartService.checkout().subscribe({
      next: () => {
        this.cartItems = [];
        this.isCheckingOut = false;
        this.router.navigate(['/orders']);
      },
      error: () => {
        this.errorMsg = "Order does not placed"
        this.isCheckingOut = false;
      }
    });
  }

  get totalAmount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}