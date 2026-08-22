import { Component, inject } from '@angular/core';
import { LoadingService } from '../../../core/services/loading.service';

@Component({
  selector: 'app-loading-bar',
  standalone: true,
  template: `
    @if (loading.isLoading()) {
      <div class="bar" role="progressbar" aria-label="Loading"><span></span></div>
    }
  `,
  styles: [
    `
      .bar {
        position: fixed;
        inset: 0 0 auto 0;
        height: 3px;
        z-index: 10000;
        background: rgb(0 0 0 / 6%);
        overflow: hidden;
      }
      .bar span {
        display: block;
        height: 100%;
        width: 40%;
        background: var(--pd-primary, #b8860b);
        animation: slide 1.1s infinite ease-in-out;
      }
      @keyframes slide {
        0% {
          transform: translateX(-100%);
        }
        100% {
          transform: translateX(300%);
        }
      }
    `,
  ],
})
export class LoadingBar {
  readonly loading = inject(LoadingService);
}
