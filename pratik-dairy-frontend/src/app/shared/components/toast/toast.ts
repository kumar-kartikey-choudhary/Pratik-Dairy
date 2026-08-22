import { Component, inject } from '@angular/core';
import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-toast-host',
  standalone: true,
  templateUrl: './toast.html',
  styleUrl: './toast.css',
})
export class ToastHost {
  readonly toastService = inject(ToastService);
}
