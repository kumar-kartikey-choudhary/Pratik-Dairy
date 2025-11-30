// src/app/pages/about/about.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';


interface Statistic {
  value: string;
  label: string;
}

interface Testimonial {
  quote: string;
  author: string;
}

@Component({
  selector: 'app-about',
  templateUrl: './about.html',
  styleUrls: ['./about.css'],
  standalone: true,
  imports: [RouterLink]
})
export class About {
  
  stats: Statistic[] = [
    { value: '25+', label: 'Years of Tradition' },
    { value: '100%', label: 'Pure Milk Sourcing' },
    { value: '4.9/5', label: 'Customer Rating' },
    { value: '50+', label: 'Handmade Sweets Variety' },
  ];

  testimonials: Testimonial[] = [
    { 
      quote: "The Ghee is absolutely phenomenal—rich, granular, and truly aromatic. It reminds me of my grandmother's cooking.", 
      author: "Priya S." 
    },
    { 
      quote: "Best Malai Peda I've had outside of a festive home kitchen. Pratik is my go-to for all occasions now.", 
      author: "Rahul M." 
    },
    { 
      quote: "Their paneer is fresh and soft, perfect for our daily curries. Highly recommend the dairy products!", 
      author: "Sanjay J." 
    }
  ];
}
