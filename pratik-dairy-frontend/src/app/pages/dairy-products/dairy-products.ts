
//   {
//     name: 'Misthi Dahi (Curd)',
//     description: 'Thick Probiotic Curd. Naturally fermented to achieve a thick, smooth, and cooling consistency. Probiotic-rich and essential for raitas, lassi, or enjoying plain.',
//     price: '₹ 100',
//     unit: 'per Kg',
//     imagePath: 'assets/images/dairy/sweet-curd.jpg'
//   },
//   {
//     name: 'Pure Buffalo Ghee',
//     description: 'Dense, White, High-Heat Ghee. Prepared exclusively from Buffalo\'s milk. Known for its higher fat content, resulting in a denser, whiter, and highly stable ghee, ideal for deep frying and rich sweets.',
//     price: '₹ 750',
//     unit: 'per Kg',
//     imagePath: 'assets/images/dairy/bghee.jpg'
//   },
//   {
//     name: 'Cheese',
//     description: 'Soft, Versatile Processing Cheese. High-quality, smooth cheese block suitable for baking, grilling, or slicing. A great source of protein for quick snacks.',
//     price: '₹ 700',
//     unit: 'per kg',
//     imagePath: 'assets/images/dairy/cheese.jpg'
//   },
//   {
//     name: 'Butter',
//     description: 'Freshly Churned Salted Butter. Creamy, rich dairy butter with a classic salted flavor. Excellent for spreading, baking, and enhancing the taste of daily meals.',
//     price: '₹ 600',
//     unit: 'per Kg',
//     imagePath: 'assets/images/dairy/butter.jpg'
//   },
//   {
//     name: 'Namkeen Chhach',
//     description: 'Spicy, Refreshing Buttermilk. Thin, spiced buttermilk seasoned with mint, ginger, green chili, and salt. A perfect digestive and cooling beverage.',
//     price: '₹ 80',
//     unit: 'per liter',
//     imagePath: 'assets/images/dairy/chhach.jpg'
//   },
//   {
//     name: 'Lassi',
//     description: 'Traditional Sweet Lassi. Thick, churned yogurt drink sweetened to perfection, often topped with cream. A rich, classic beverage for instant refreshment.',
//     price: '₹ 30',
//     unit: 'per unit', // Changed from Kg for better accuracy
//     imagePath: 'assets/images/dairy/lassi.jpg'
//   },
//   


// src/app/pages/dairy-products/dairy-products.component.ts

import { Component, OnInit } from '@angular/core'; // <-- Add OnInit
import { RouterLink } from '@angular/router';
import { NgFor } from '@angular/common'; // <-- Needed for *ngFor
import { ProductService } from '../../service/product/product-service'; // <-- Import ProductService
import { DomSanitizer, SafeUrl } from '@angular/platform-browser'; // <-- Necessary for Base64 images
import { FormsModule } from '@angular/forms'; // <-- Needed for cart logic (optional but good practice)

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
    imports: [RouterLink, NgFor, FormsModule] 
})
export class DairyProducts implements OnInit { // <-- Implement OnInit

    // Component properties
    dairyProducts: DairyProduct[] = [];
    isLoading: boolean = false;
    
    // NOTE: For cart logic, product ID must be used. Initializing cartState.
    cartState: { [productId: number]: number } = {};

    // Inject ProductService and DomSanitizer
    constructor(
        private productService: ProductService,
        private sanitizer: DomSanitizer // Required for handling Base64 images
    ) {}

    ngOnInit(): void {
        this.loadDairyProducts();
    }

    // --- Data Loading and Mapping ---

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
        this.cartState[productId] = 1;
        console.log(`Product ${productId} added to cart!`);
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