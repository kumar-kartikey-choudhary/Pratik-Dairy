/**
 * Mirrors backend ProductDto (pratik-dairy-product / ProductDto.java).
 *
 * `id` is a String UUID on the backend (BaseDto.id), not a number — several
 * places in this app previously typed it as `number`, which silently breaks
 * anything that does `parseInt(product.id)` (UUIDs aren't numeric) or sends
 * `id` back to an endpoint expecting a real string id.
 */
export interface Product {
  id: string;
  productName: string;
  price: number;
  available: boolean;
  /**
   * Stock, expressed in `stockUnit`-multiples (e.g. if stockUnit = "1kg" and
   * stockQuantity = 10.5, there is 10.5kg in stock). Backend now stores this
   * as a decimal (BigDecimal) so weight-variant orders — e.g. selling "250g"
   * off a "1kg" stockUnit — can consume a fraction of a unit. Always treat
   * this as a decimal on the frontend too (don't round/parseInt it).
   */
  stockQuantity: number;
  stockUnit: string;
  category: string;
  type?: string; // backend field name for sweet type is `type`, not `sweetType`
  description: string;
  manufactureDate: string;
  expiryDate: string;
  imageName?: string;
  imageType?: string;
  imageData?: string; // base64 string as returned by Jackson for byte[]
  status: string;
}

/** Client-only view model used by admin product cards — computed from `Product`, not sent to the backend. */
export type ProductStockStatus = 'In Stock' | 'Low Stock' | 'Discontinued';