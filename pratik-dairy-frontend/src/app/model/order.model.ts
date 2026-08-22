import type { SafeUrl } from '@angular/platform-browser';

/** Mirrors backend OrderStatus enum (pratik-dairy-order / OrderStatus.java). */
export type OrderStatus = 'PROCESSING' | 'CONFIRMED' | 'SHIPPED' | 'DELIVERED' | 'CANCELLED';

/** Mirrors backend OrderItemDto (pratik-dairy-order / OrderItemDto.java). */
export interface OrderItemDto {
  id: string;
  productId: string;
  productName?: string; // only populated by findAll()/findByCustomerName()
  imageData?: string | SafeUrl; // base64 string from backend, sanitized before display; only populated by findAll()/findByCustomerName()
  quantity: number;
  price: number;
  subTotal: number;
  /** Weight variant bought (e.g. "250g", "500g", "1kg") — the amount actually purchased, independent of quantity. */
  weight: string;
}

/** Mirrors backend OrderResponse (pratik-dairy-order / OrderResponse.java). */
export interface OrderResponse {
  id: string;
  username: string;
  orderDateTime: string; // ISO string over the wire; DatePipe parses it fine
  status: OrderStatus;
  totalAmount: number;
  items: OrderItemDto[];
}