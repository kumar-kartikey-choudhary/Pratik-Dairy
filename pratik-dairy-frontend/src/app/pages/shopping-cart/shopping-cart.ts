// import { Component, OnInit } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms'; 
// import { NgFor, NgIf, CurrencyPipe, DecimalPipe } from '@angular/common';
// import { CartService } from '../../service/cart/CartService'; // Import your new service

// interface CartItemDto {
//   id: string;
//   productId: string;
//   productName: string;
//   quantity: number;
//   pricePerUnit: number;
//   subtotal: number;
// }

// interface CartDto {
//   items: CartItemDto[];
//   grandTotal: number;
// }

// @Component({
//   selector: 'app-shopping-cart',
//   standalone: true,
//   imports: [RouterLink, FormsModule, NgFor, NgIf, DecimalPipe],
//   templateUrl: './shopping-cart.html',
//   styleUrl: './shopping-cart.css'
// })
// export class ShoppingCart implements OnInit {

//   cartData: CartDto = { items: [], grandTotal: 0 };
//   isLoading: boolean = true;

//   constructor(private cartService: CartService) {}

//   ngOnInit(): void {
//     this.loadCart();
//   }

//   loadCart(): void {
//     this.isLoading = true;
//     this.cartService.getCart().subscribe({
//       next: (response) => {
//         this.cartData = response;
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error("Failed to load cart", err);
//         this.isLoading = false;
//       }
//     });
//   }

//   updateQuantity(item: CartItemDto, newQuantity: number): void {
//     if (newQuantity < 1) return; // Prevent setting negative/zero via input
    
//     this.cartService.updateQuantity(item.productId, newQuantity).subscribe({
//       next: (updatedCart) => {
//         this.cartData = updatedCart; // The backend returns the refreshed cart
//       },
//       error: (err) => console.error("Error updating quantity", err)
//     });
//   }

//   removeItem(item: CartItemDto): void {
//     if(confirm(`Are you sure you want to remove ${item.productName}?`)) {
//       this.cartService.removeItem(item.productId).subscribe({
//         next: (updatedCart) => {
//           this.cartData = updatedCart;
//         },
//         error: (err) => console.error("Error removing item", err)
//       });
//     }
//   }

//   checkout(): void {
//     if(this.cartData.items.length === 0) {
//       alert("Your cart is empty!");
//       return;
//     }
//     // Logic to route to checkout / connect to Order service goes here
//     alert("Proceeding to checkout with Grand Total: ₹" + this.cartData.grandTotal);
//   }
// }




import { Component, OnInit } from '@angular/core';
import { CommonModule } from '@angular/common';
import { CartService, CartItemDto } from '../../service/cart/CartService';

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

  constructor(private cartService: CartService) {}

  ngOnInit(): void {
    this.loadCart();
  }

  loadCart(): void {
    this.isLoading = true;
    this.cartService.getCart().subscribe({
      next: (items) => {
        this.cartItems = items;
        this.isLoading = false;
      },
      error: (err) => {
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
      }
    });
  }

  decreaseQuantity(item: CartItemDto): void {
    if (item.quantity <= 1) {
      this.removeItem(item.productId);
      return;
    }
    // Backend mein decrease ka endpoint nahi hai — remove karke re-add
    // Isliye sirf UI update karo aur remove call karo agar 0 ho
    item.quantity -= 1;
    item.subtotal = item.pricePerUnit * item.quantity;
  }

  get totalAmount(): number {
    return this.cartItems.reduce((sum, item) => sum + item.subtotal, 0);
  }

  get totalItems(): number {
    return this.cartItems.reduce((sum, item) => sum + item.quantity, 0);
  }
}