import { HttpClient } from '@angular/common/http';
import { Injectable } from '@angular/core';
import { Observable } from 'rxjs';

interface Product {
  id?: number;
  productName: string,
  price: number,
  available: boolean,
  stockQuantity: number,
  stockUnit: string,
  category: string,
  sweetType?: string,
  description: string,
  manufactureDate: string,
  expirationDate: string,
  imageUrl: string,
  status: 'In Stock' | 'Low Stock' | 'Discontinued';
}

@Injectable({
  providedIn: 'root'
})
export class ProductService {
  private readonly API_URL = "http://localhost:8080/products";

  constructor(private http: HttpClient) { }

  /**
   * Sends product data and image file in a single request (using FormData)
   * to create a new product.
   */
  addProduct(productData: Product, imageFile: File): Observable<Product> {
    const url = `${this.API_URL}/addProduct`;
    const formData: FormData = new FormData();
    const productDtoBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });

    formData.append('productDto', productDtoBlob, 'productDto.json');
    formData.append('imageFile', imageFile, imageFile.name);


    // const authToken = localStorage.getItem("AUTH_TOKEN");
    return this.http.post<Product>(url, formData,
    // {
    //     headers:{
    //         Authorization : `Bearer ${authToken}` 
    //     }
    // }
    );
  }

  /**
   * Retrieve list of products from the backend.
   */
  getAllProducts(): Observable<Product[]> {
    const url = `${this.API_URL}/all`;
    return this.http.get<Product[]>(url);
  }

  /**
   * CRITICAL FIX: Sends product data to update an existing product.
   * Note: Changed imageFile type to allow null, resolving the TS error.
   */
  updateProduct(productId: number, productData: any, imageFile?: File | null): Observable<any> {
    const url = `${this.API_URL}/admin/updateProduct/${productId}`;

    if (imageFile) {
      // --- SCENARIO 1: Update with an Image (Multipart/form-data) ---
      console.log(`Sending multipart PUT request to update product ${productId} with new image.`);

      const formData: FormData = new FormData();
      const productDtoBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });

      formData.append('productDto', productDtoBlob, 'productDto.json');
      formData.append('imageFile', imageFile, imageFile.name); // imageFile is File here

      return this.http.patch<any>(url, formData);

    } else {
      // --- SCENARIO 2: Update without an Image (application/json) ---
      console.log(`Sending JSON PUT request to update product ${productId} (no image change).`);

      // Send the plain JSON object.
      return this.http.patch<any>(url, productData);
    }
  }
}


