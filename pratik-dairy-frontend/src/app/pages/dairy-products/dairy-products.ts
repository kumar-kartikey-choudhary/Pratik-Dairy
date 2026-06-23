
// src/app/pages/dairy-products/dairy-products.component.ts

import { Component, OnInit } from '@angular/core'; // <-- Add OnInit
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common'; // <-- Needed for *ngFor
import { ProductService } from '../../service/product/product-service'; // <-- Import ProductService
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // <-- Necessary for Base64 images
import { FormsModule } from '@angular/forms'; // <-- Needed for cart logic (optional but good practice)
import { CartService } from '../../service/cart/CartService';

// Revised interface to match API data structure and allow sanitized URLs
interface DairyProduct {
    id: number; // <-- Added ID for tracking
    name: string;
    description: string;
    price: number; // <-- Use number for API price
    unit: string;
    imageUrl: string | SafeUrl; // <-- Updated for sanitized Base64
}

@Component({
    selector: 'app-dairy-products',
    templateUrl: './dairy-products.html',
    styleUrls: ['./dairy-products.css'],
    standalone: true,
    // Add required imports
    imports: [RouterLink, FormsModule] 
})
export class DairyProducts implements OnInit {
[x: string]: any; // <-- Implement OnInit

    // Component properties
    dairyProducts: DairyProduct[] = [];
    isLoading: boolean = false;
    
    // NOTE: For cart logic, product ID must be used. Initializing cartState.
    cartState: { [productId: number]: number } = {};
    loadingState: { [productId: number]: boolean } = {};

    // Inject ProductService and DomSanitizer
    constructor(
        private productService: ProductService,
        private cartService: CartService,
        private sanitizer: DomSanitizer // Required for handling Base64 images
    ) {}

    ngOnInit(): void {
        this.loadDairyProducts();
        this.syncCartFromBackend();
    }

    // --- Data Loading and Mapping ---

    // Fetch existing cart so quantities are correct on page load
    syncCartFromBackend(): void {
        this.cartService.getCart().subscribe({
            next: (cart: any) => {
                const items: any[] = cart?.items || cart || [];
                items.forEach((item: any) => {
                    this.cartState[item.productId] = item.quantity;
                });
            },
            error: (err) => console.error('Could not load cart:', err)
        });
    }

    /** Fetches products from API, filters by 'Dairy', and maps data. */
    loadDairyProducts(): void {
        this.isLoading = true;
        
        this.productService.getAllProducts().subscribe({
            next: (data: any[]) => {
                // 1. FILTER: Keep only items where category is 'Dairy'
                const filteredApiData = data.filter(p => 
                    p.category?.toLowerCase() === 'dairy'
                );
                
                // 2. MAP: Transform filtered data using the mapper function
                this.dairyProducts = filteredApiData.map(p => this.mapApiProduct(p));
                this.isLoading = false;
            },
            error: (err) => {
                console.error('Failed to load dairy products from API:', err);
                this.isLoading = false;
            }
        });
    }

    /** Converts API Product shape (with Base64 image) to local DairyProduct shape. */
    private mapApiProduct(p: any): DairyProduct {
        let finalImageUrl: string | SafeUrl = 'assets/images/placeholder.png'; 

        // Logic to handle Base64 image data from the backend
        if (p.imageData && p.imageType) {
            const dataUrl = `data:${p.imageType};base64,${p.imageData}`;
            // CRITICAL: Bypass sanitization for the Data URL
            finalImageUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
        }

        return { 
            id: p.id,
            name: p.productName || 'N/A', 
            description: p.description || '',
            price: p.price || 0,
            unit: p.stockUnit || 'N/A', // Assuming stockUnit is the display unit
            imageUrl: finalImageUrl 
        } as DairyProduct;
    }

    // --- Cart Logic (Updated to use product IDs) ---
    
    // Note: Since the component no longer uses hardcoded products,
    // the cart functions now rely on the 'id' field from the API.

    // 1. Checks if the product is in the cart (quantity > 0)
    isInCart(productId: number): boolean {
        return (this.cartState[productId] || 0) > 0;
    }

    // 2. Returns the current quantity of the product
    getQuantity(productId: number): number {
        return this.cartState[productId] || 0;
    }

    // 3. Adds the item to the cart (sets quantity to 1)
    addToCart(productId: number): void {
        this.loadingState[productId] = true;
        this.cartService.addItemToCart(String(productId), 1).subscribe({
            next: () => {
                this.cartState[productId] = 1;
                this.loadingState[productId] = false;
            },
            error: (err) => {
                console.error('Add to cart failed:', err);
                this.loadingState[productId] = false;
            }
        });
    }

    // Increase quantity
    increment(productId: number): void {
        const newQty = (this.cartState[productId] || 0) + 1;
        this.cartService.updateQuantity(String(productId), newQty).subscribe({
            next: () => this.cartState[productId] = newQty,
            error: (err) => console.error('Update failed:', err)
        });
    }

    // Decrease quantity — removes item when reaching 0
    decrement(productId: number): void {
        const newQty = (this.cartState[productId] || 0) - 1;
        if (newQty <= 0) {
            this.cartService.removeItem(String(productId)).subscribe({
                next: () => delete this.cartState[productId],
                error: (err) => console.error('Remove failed:', err)
            });
        } else {
            this.cartService.updateQuantity(String(productId), newQty).subscribe({
                next: () => this.cartState[productId] = newQty,
                error: (err) => console.error('Update failed:', err)
            });
        }
    }

    // 4. Handles quantity changes (+ / -)
    updateQuantity(productId: number, newQuantity: number): void {
        if (newQuantity <= 0) {
            // If quantity is 0, remove it from the cart
            delete this.cartState[productId];
        } else {
            this.cartState[productId] = newQuantity;
        }
    }
}