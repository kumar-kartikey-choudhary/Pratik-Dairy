// // src/app/admin/pages/product-management/product-management.component.ts




import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor, DecimalPipe } from '@angular/common';
import { ProductService } from '../../../service/product/product-service';

// NOTE: The Product interface definition is finalized.
interface Product {
  id: number;
  productName: string;
  price: number;
  available: boolean;
  stockQuantity: number;
  stockUnit: string;
  category: string;
  sweetType: string;
  description: string;
  manufactureDate: string;
  expirationDate: string;
  imageUrl: string;
  status: 'In Stock' | 'Low Stock' | 'Discontinued';
}


@Component({
  selector: 'app-product-management',
  templateUrl: './product-management.html',
  styleUrls: ['./product-management.css'],
  standalone: true,
  imports: [FormsModule, DecimalPipe]
})
export class ProductManagement implements OnInit {

  // State variables
  isEditing: boolean = false;
  allProducts: Product[] = [];
  currentProduct: any = this.getEmptyProductModel();
  categories = ['All', 'Dairy', 'Sweets', 'Snacks', 'Cold Drinks'];

  // NEW STATE: File handling and loading
  selectedFile: File | null = null; // CRITICAL: Holds the file selected by the user
  isUploading: boolean = false; // State to track ongoing upload

  // NEW: Sweet Types List for the conditional dropdown
  types = ['All', 'Kaju', 'Barfee', 'Peda', 'DryFruit', 'Laddoo', 'Chhena', 'GulabJamun'];

  searchTerm: string = '';
  selectedCategory: string = 'All';

  // Inject the service
  constructor(private service: ProductService) { }

  ngOnInit(): void {
    this.loadProducts();
  }

  // NEW METHOD: Captures the selected file from the HTML input
  onFileSelected(event: any): void {
    const file = event.target.files[0];
    if (file) {
      this.selectedFile = file;
      // When a new file is selected, clear any old URL placeholder if it exists
      this.currentProduct.imageUrl = '';
    }
  }

  // Placeholder to create a clean model
  private getEmptyProductModel(): any {
    return {
      id: 0,
      productName: '',
      price: 0,
      available: true,
      stockQuantity: 0,
      stockUnit: 'KG',
      category: 'Dairy',
      sweetType: '',
      description: '',
      manufactureDate: new Date().toISOString().substring(0, 10),
      expirationDate: '',
      imageUrl: '',
      status: 'In Stock'
    };
  }

  /**
   * Method to initiate adding a new product.
   */
  addNewProducts(): void {
    this.currentProduct = this.getEmptyProductModel();
    this.selectedFile = null; // Ensure file input is reset
    this.isEditing = true;
  }

  /**
   * Method to initiate editing a product (used by the HTML button).
   */
  editProduct(product: Product): void {
    this.currentProduct = {
      ...product,
      sweetType: (product as any).sweetType || ''
    };
    this.selectedFile = null; // Clear file selection when editing
    this.isEditing = true;
  }

  saveProduct(): void {
    const productPayload: Product = { ...this.currentProduct };

    // Guard against double submission
    if (this.isUploading) return;

    // Remove the temporary ID for new product creation, if present.
    // The backend should generate the ID, but TypeScript needs a number.
    // We explicitly check for ID == 0 to signify a new product.

    this.isUploading = true;

    // --- CASE 1: CREATE NEW PRODUCT (POST) ---
    if (productPayload.id === 0) {
      if (!this.selectedFile) {
        alert('New product requires an image file to be selected.');
        this.isUploading = false;
        return;
      }

      // Call the combined service method
      this.service.addProduct(productPayload, this.selectedFile).subscribe({
        next: (response) => {
          alert(`Product '${response.productName}' added successfully!`);
          this.isEditing = false;
          this.isUploading = false;
          this.selectedFile = null;
          this.loadProducts();
        },
        error: (err) => {
          console.error('Add product failed:', err);
          alert('Add failed. Check API connection and file size limits.');
          this.isUploading = false;
        }
      });
    }
    // --- CASE 2: UPDATE EXISTING PRODUCT (PUT) ---
    else {
      if (!this.selectedFile) {
        this.service.updateProduct(productPayload.id, productPayload).subscribe({
          next: (response) => {
            alert(`Product #${response.id} updated successfully!`);
            this.isEditing = false;
            this.isUploading = false;
            this.selectedFile = null;
            this.loadProducts();
          },
          error: (err) => {
            console.error('Update failed:', err);
            alert('Update failed. Check API connection and file size limits.');
            this.isUploading = false;
          }
        });
      }
      else{
        this.service.updateProduct(productPayload.id, productPayload, this.selectedFile).subscribe({
        next: (response) => {
          alert(`Product #${response.id} updated successfully!`);
          this.isEditing = false;
          this.isUploading = false;
          this.selectedFile = null;
          this.loadProducts();
        },
        error: (err) => {
          console.error('Update failed:', err);
          alert('Update failed. Check API connection and file size limits.');
          this.isUploading = false;
        }
      });
      }
    }
  }

  /**
   * Getter for filtered products (uses searchTerm and selectedCategory).
   */
  get filteredProducts(): Product[] {
    let products = this.allProducts;
    const term = this.searchTerm.toLowerCase();

    if (this.selectedCategory !== 'All') {
      products = products.filter(p => p.category === this.selectedCategory);
    }

    if (term) {
      products = products.filter(p => p.productName.toLowerCase().includes(term));
    }

    return products;
  }

  /**
   * Loads product data from the backend API.
   */
  loadProducts(): void {
    this.service.getAllProducts().subscribe({
      next: (data: any) => {
        this.allProducts = data;
      },
      error: (err) => console.error('Failed to fetch products', err)
    });
  }
}