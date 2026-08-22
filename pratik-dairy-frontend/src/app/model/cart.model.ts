export interface CartItemDto {
  id?: string;
  username?: string;
  productId: string;
  productName: string;
  productImageUrl?: string | any;
  unit: string;
  weight: string;
  quantity: number;
  pricePerUnit: number;
  subtotal: number;
}

export interface AddToCart {
  productId: string;
  quantity: number;
  weight: string;
  totalAmount?: number;
}