import { Injectable, signal } from '@angular/core';
import type { Toast, ToastKind } from '../../model';

export type { Toast, ToastKind };

/**
 * Tiny signal-based toast store. Replaces the `alert()` calls and silent
 * `console.error()` swallowing that the app used for user feedback.
 */
@Injectable({ providedIn: 'root' })
export class ToastService {
  private counter = 0;
  readonly toasts = signal<Toast[]>([]);

  success(message: string): void {
    this.push('success', message);
  }
  error(message: string): void {
    this.push('error', message);
  }
  info(message: string): void {
    this.push('info', message);
  }

  dismiss(id: number): void {
    this.toasts.update((list) => list.filter((t) => t.id !== id));
  }

  private push(kind: ToastKind, message: string): void {
    const id = ++this.counter;
    this.toasts.update((list) => [...list, { id, kind, message }]);
    setTimeout(() => this.dismiss(id), 4500);
  }
}