import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { ProductService } from '../../service/product/product-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';
import { FormsModule } from '@angular/forms';
import { CartService } from '../../service/cart/CartService';

interface DairyProduct {
  id: string;
  name: string;
  description: string;
  price: number;
  unit: string;
  imageUrl: string | SafeUrl;
}

@Component({
  selector: 'app-dairy-products',
  templateUrl: './dairy-products.html',
  styleUrls: ['./dairy-products.css'],
  standalone: true,
  imports: [RouterLink, FormsModule]
})
export class DairyProducts implements OnInit {

  dairyProducts: DairyProduct[] = [];
  isLoading: boolean = false;

  constructor(
    public cartService: CartService,  
    private productService: ProductService,
    private sanitizer: DomSanitizer
  ) {}

  ngOnInit(): void {
    this.loadDairyProducts();
  }

  loadDairyProducts(): void {
    this.isLoading = true;
    this.productService.getAllProducts().subscribe({
      next: (data: any[]) => {
        const filtered = data.filter(p => p.category?.toLowerCase() === 'dairy');
        this.dairyProducts = filtered.map(p => this.mapApiProduct(p));
        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load dairy products:', err);
        this.isLoading = false;
      }
    });
  }

  private mapApiProduct(p: any): DairyProduct {
    let finalImageUrl: string | SafeUrl = 'assets/images/placeholder.png';
    if (p.imageData && p.imageType) {
      finalImageUrl = this.sanitizer.bypassSecurityTrustUrl(`data:${p.imageType};base64,${p.imageData}`);
    }
    return {
      id: p.id,
      name: p.productName || 'N/A',
      description: p.description || '',
      price: p.price || 0,
      unit: p.stockUnit || 'N/A',
      imageUrl: finalImageUrl
    };
  }
}