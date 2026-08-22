import { HttpClient } from '@angular/common/http';
import { Injectable, inject } from '@angular/core';
import { Observable, shareReplay, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import type { Product } from '../../model';

export type { Product };

@Injectable({ providedIn: 'root' })
export class ProductService {
  private readonly http = inject(HttpClient);
  private readonly apiUrl = `${environment.apiBaseUrl}/products`;

  /** Cached catalogue so navigating between category pages doesn't refetch. */
  private catalogue$?: Observable<Product[]>;

  addProduct(productData: Product, imageFile: File): Observable<Product> {
    const formData = this.toFormData(productData, imageFile);
    return this.http
      .post<Product>(`${this.apiUrl}/addProduct`, formData)
      .pipe(tap(() => this.invalidateCache()));
  }

  /** Retrieve the product catalogue (cached until something mutates it). */
  getAllProducts(forceRefresh = false): Observable<Product[]> {
    if (forceRefresh || !this.catalogue$) {
      this.catalogue$ = this.http
        .get<Product[]>(`${this.apiUrl}/all`)
        .pipe(shareReplay({ bufferSize: 1, refCount: false }));
    }
    return this.catalogue$;
  }

  getProductsByCategory(category: string): Observable<Product[]> {
    return this.http.get<Product[]>(`${this.apiUrl}/all`, { params: { category } });
  }

  updateProduct(
    productId: string,
    productData: Partial<Product>,
    imageFile?: File | null,
  ): Observable<Product> {
    const url = `${this.apiUrl}/admin/updateProduct/${productId}`;
    const body = imageFile ? this.toFormData(productData, imageFile) : productData;
    return this.http.patch<Product>(url, body).pipe(tap(() => this.invalidateCache()));
  }

  deleteProduct(productId: string): Observable<void> {
    return this.http
      .delete<void>(`${this.apiUrl}/admin/deleteProduct/${productId}`)
      .pipe(tap(() => this.invalidateCache()));
  }

  invalidateCache(): void {
    this.catalogue$ = undefined;
  }

  private toFormData(productData: Partial<Product>, imageFile: File): FormData {
    const formData = new FormData();
    const dtoBlob = new Blob([JSON.stringify(productData)], { type: 'application/json' });
    formData.append('productDto', dtoBlob, 'productDto.json');
    formData.append('imageFile', imageFile, imageFile.name);
    return formData;
  }
}