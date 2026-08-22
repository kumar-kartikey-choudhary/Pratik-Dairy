import { Injectable, inject } from '@angular/core';
import { Meta, Title } from '@angular/platform-browser';
import { environment } from '../../../environments/environment';
import type { SeoData } from '../../model';

export type { SeoData };

/**
 * Centralised metadata handling. The app previously shipped a single static
 * `<title>PratikDairyFrontend</title>` for every page, which is bad for both
 * SEO and social sharing even though SSR was already enabled.
 */
@Injectable({ providedIn: 'root' })
export class SeoService {
  private readonly title = inject(Title);
  private readonly meta = inject(Meta);

  update({ title, description, image, url }: SeoData): void {
    const fullTitle = `${title} | ${environment.appName}`;
    this.title.setTitle(fullTitle);

    this.meta.updateTag({ name: 'description', content: description });
    this.meta.updateTag({ property: 'og:title', content: fullTitle });
    this.meta.updateTag({ property: 'og:description', content: description });
    this.meta.updateTag({ property: 'og:type', content: 'website' });
    this.meta.updateTag({ name: 'twitter:card', content: 'summary_large_image' });
    this.meta.updateTag({ name: 'twitter:title', content: fullTitle });
    this.meta.updateTag({ name: 'twitter:description', content: description });

    if (image) {
      this.meta.updateTag({ property: 'og:image', content: image });
      this.meta.updateTag({ name: 'twitter:image', content: image });
    }
    if (url) {
      this.meta.updateTag({ property: 'og:url', content: url });
    }
  }
}