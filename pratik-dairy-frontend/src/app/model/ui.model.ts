/** Client-only — not a backend DTO. Used by ToastService. */
export type ToastKind = 'success' | 'error' | 'info';

export interface Toast {
  id: number;
  kind: ToastKind;
  message: string;
}

/** Client-only — not a backend DTO. Used by SeoService. */
export interface SeoData {
  title: string;
  description: string;
  image?: string;
  url?: string;
}