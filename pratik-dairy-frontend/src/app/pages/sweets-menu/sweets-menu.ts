// // src/app/pages/sweets-menu/sweets-menu.component.ts

// src/app/pages/sweets-menu/sweets-menu.component.ts
// src/app/pages/sweets-menu/sweets-menu.component.ts (FINALIZED)

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ProductService } from '../../service/product/product-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { CartService } from '../../service/cart/CartService';


// Interface for the component's display logic
interface SweetProduct {
  id: string;
  name: string;
  category: string;
  type: string; 
  stockUnit: string,
  description: string;
  price: number;
  imageUrl: string | SafeUrl;
}

interface SweetCategory {
  name: string;
  items: SweetProduct[];
}

@Component({
  selector: 'app-sweets-menu',
  templateUrl: './sweets-menu.html',
  styleUrls: ['./sweets-menu.css'],
  standalone: true,
  imports: [RouterLink, FormsModule,]
})
export class SweetsMenu implements OnInit {

  filterText: string = '';
  allSweets: SweetProduct[] = [];
  isLoading: boolean = false;

  constructor(private productService: ProductService, 
              private sanitizer: DomSanitizer,
              public cartService : CartService) { }

  ngOnInit(): void {
    this.loadSweets();
    this.cartService.syncCartFromBackend();
  }

  // --- Core Mapper Function (Safely extracts data) ---
  /** Converts API Product shape to local SweetProduct shape. */
  private mapApiProduct(p: any): SweetProduct {
    // CRITICAL FIX: Accessing the field 'p.type' directly from the API response
    const sweetType = (p.type || 'General').toLowerCase();
    let finalImageUrl: string | SafeUrl = 'assets/images/placeholder.png'; // Initialize with fallback


    // NEW LOGIC: Use Base64 data if available
    if (p.imageData && p.imageType) {
      // 1. Construct the raw Data URL string
      const dataUrl = `data:${p.imageType};base64,${p.imageData}`;

      // 2. **FIX 2: Use DomSanitizer to mark the Data URL as safe**
      finalImageUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);

    }
    return {
      id: p.id,
      name: p.productName || 'N/A',
      category: p.category || 'N/A',
      type: sweetType,
      stockUnit: p.stockUnit,// Use the extracted type field for grouping
      description: p.description || '',
      price: p.price || 0,
      imageUrl: finalImageUrl || ''
    } as SweetProduct;
  }

  // --- Data Loading ---
  loadSweets(): void {
    this.isLoading = true;

    this.productService.getAllProducts().subscribe({
      next: (data: any[]) => {

        // 1. FILTER: Keep only items where primary category is 'sweets'.
        const filteredApiData = data.filter(p => p.category?.toLowerCase() === 'sweets');

        // 2. MAP: Transform filtered data using the mapper function
        this.allSweets = filteredApiData.map(p => this.mapApiProduct(p));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load sweets from API:', err);
        this.isLoading = false;
      }
    });
  }

  // --- Grouping Logic (Fixed to use cleaned type) ---
  get groupedByType(): SweetCategory[] {
    const grouped: { [key: string]: SweetProduct[] } = {};
    const typeDisplayNameMap: { [key: string]: string } = {
      'kaju': 'Kaju Delights',
      'barfee': 'Barfee & Milk Cakes',
      'peda': 'Peda & Milk Sweets',
      'laddoo': 'Laddoo Collection',
      'chhena': 'Chhena Sweets',
      'dryfruit': 'Dry Fruit & Healthy',
      'gulabjamun': 'Gulab Jamun & Hot Sweets',
      'general': 'Other Specialties'
    };

    this.allSweets.forEach(sweet => {
      // Grouping based on the cleaned type field
      const typeKey = sweet.type;

      if (!grouped[typeKey]) {
        grouped[typeKey] = [];
      }
      grouped[typeKey].push(sweet);
    });

    // Convert map to array structure
    return Object.keys(grouped).map(key => ({
      name: typeDisplayNameMap[key] || `${key.charAt(0).toUpperCase() + key.slice(1)} Collection`,
      items: grouped[key].sort((a, b) => a.name.localeCompare(b.name))
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  // --- Filtering Logic (Search across Name and Type) ---
  get filteredCategories(): SweetCategory[] {
    const filter = this.filterText.toLowerCase().trim();
    const groupedMenu = this.groupedByType;

    if (!filter) return groupedMenu;

    return groupedMenu
      .map(category => ({
        ...category,
        items: category.items.filter(s =>
          s.name.toLowerCase().includes(filter) ||
          s.type.toLowerCase().includes(filter)
        )
      }))
      .filter(category => category.items.length > 0);
  }
}