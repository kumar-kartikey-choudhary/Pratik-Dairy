// // src/app/pages/sweets-menu/sweets-menu.component.ts

// src/app/pages/sweets-menu/sweets-menu.component.ts
// src/app/pages/sweets-menu/sweets-menu.component.ts (FINALIZED)

import { Component, OnInit } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms';
import { NgFor } from '@angular/common';
import { ProductService } from '../../service/product/product-service';
import { DomSanitizer, SafeUrl } from '@angular/platform-browser';


// Interface for the component's display logic
interface SweetProduct {
  id: number;
  name: string;
  category: string; 
  type: string; // The specific type (Laddoo, Barfee)
  stockUnit:string,
  description: string;
  price: number;
  imageUrl: string | SafeUrl;
}

interface SweetCategory {
  name: string;
  items: SweetProduct[];
}

@Component({
  selector: 'app-sweets-menu',
  templateUrl: './sweets-menu.html',
  styleUrls: ['./sweets-menu.css'],
  standalone: true,
  imports: [RouterLink, FormsModule,]
})
export class SweetsMenu implements OnInit {

  filterText: string = '';
  allSweets: SweetProduct[] = [];
  isLoading: boolean = false;

  constructor(private productService: ProductService,private sanitizer: DomSanitizer) {}

  ngOnInit(): void {
    this.loadSweets();
  }

  // --- Core Mapper Function (Safely extracts data) ---
  /** Converts API Product shape to local SweetProduct shape. */
  private mapApiProduct(p: any): SweetProduct {
      // CRITICAL FIX: Accessing the field 'p.type' directly from the API response
      const sweetType = (p.type || 'General').toLowerCase();
      let finalImageUrl: string | SafeUrl = 'assets/images/placeholder.png'; // Initialize with fallback
     

      // NEW LOGIC: Use Base64 data if available
      if (p.imageData && p.imageType) {
            // 1. Construct the raw Data URL string
            const dataUrl = `data:${p.imageType};base64,${p.imageData}`;
            
            // 2. **FIX 2: Use DomSanitizer to mark the Data URL as safe**
            finalImageUrl = this.sanitizer.bypassSecurityTrustUrl(dataUrl);
            
      }
     

      return { 
          id: p.id,
          name: p.productName || 'N/A', 
          category: p.category || 'N/A',
          type: sweetType, 
          stockUnit:p.stockUnit,// Use the extracted type field for grouping
          description: p.description || '',
          price: p.price || 0,
          imageUrl:finalImageUrl || ''
      } as SweetProduct;
  }

  // --- Data Loading ---
  loadSweets(): void {
    this.isLoading = true;
    
    this.productService.getAllProducts().subscribe({
      next: (data: any[]) => {
        
        // 1. FILTER: Keep only items where primary category is 'sweets'.
        const filteredApiData = data.filter(p => p.category?.toLowerCase() === 'sweets');
        
        // 2. MAP: Transform filtered data using the mapper function
        this.allSweets = filteredApiData.map(p => this.mapApiProduct(p));

        this.isLoading = false;
      },
      error: (err) => {
        console.error('Failed to load sweets from API:', err);
        this.isLoading = false;
      }
    });
  }

  // --- Grouping Logic (Fixed to use cleaned type) ---
  get groupedByType(): SweetCategory[] {
    const grouped: { [key: string]: SweetProduct[] } = {};
    const typeDisplayNameMap: { [key: string]: string } = {
        'kaju': 'Kaju Delights',
        'barfee': 'Barfee & Milk Cakes',
        'peda': 'Peda & Milk Sweets',
        'laddoo': 'Laddoo Collection',
        'chhena': 'Chhena Sweets',
        'dryfruit': 'Dry Fruit & Healthy',
        'gulabjamun': 'Gulab Jamun & Hot Sweets',
        'general': 'Other Specialties'
    };

    this.allSweets.forEach(sweet => {
      // Grouping based on the cleaned type field
      const typeKey = sweet.type; 
      
      if (!grouped[typeKey]) {
        grouped[typeKey] = [];
      }
      grouped[typeKey].push(sweet);
    });

    // Convert map to array structure
    return Object.keys(grouped).map(key => ({
      name: typeDisplayNameMap[key] || `${key.charAt(0).toUpperCase() + key.slice(1)} Collection`,
      items: grouped[key].sort((a, b) => a.name.localeCompare(b.name))
    })).sort((a, b) => a.name.localeCompare(b.name));
  }

  // --- Filtering Logic (Search across Name and Type) ---
  get filteredCategories(): SweetCategory[] {
    const filter = this.filterText.toLowerCase().trim();
    const groupedMenu = this.groupedByType;

    if (!filter) return groupedMenu;

    return groupedMenu
      .map(category => ({
        ...category,
        items: category.items.filter(s => 
          s.name.toLowerCase().includes(filter) ||
          s.type.toLowerCase().includes(filter)
        )
      }))
      .filter(category => category.items.length > 0);
  }
}












//2nd 


// // src/app/pages/sweets-menu/sweets-menu.component.ts

// import { Component, OnInit } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms';
// import { NgFor } from '@angular/common';
// import { ProductService } from '../../service/product/product-service';

// interface SweetProduct {
//   id: number;
//   name: string;
//   category: string;
//   type: string;
//   description: string;
//   price: number;
//   imagePath: string;
// }

// interface SweetType {
//   name: string;       // e.g., "Barfee"
//   items: SweetProduct[];
// }

// @Component({
//   selector: 'app-sweets-menu',
//   templateUrl: './sweets-menu.html',
//   styleUrls: ['./sweets-menu.css'],
//   standalone: true,
//   imports: [RouterLink, FormsModule, NgFor]
// })
// export class SweetsMenu implements OnInit {

//   filterText: string = '';
//   allSweets: SweetProduct[] = [];
//   isLoading: boolean = false;

//   constructor(private productService: ProductService) {}

//   ngOnInit(): void {
//     this.loadSweets();
//   }

//   // Load all sweets and keep only category "Sweets"
//   loadSweets(): void {
//     this.isLoading = true;
//     this.productService.getAllProducts().subscribe({
//       next: (data: any[]) => {
//         // Filter only "Sweets" category
//         this.allSweets = data
//           .filter(p => p.category.toLowerCase() === 'sweets')
//           .map(p => ({ 
//             id: p.id,
//             name: p.productName,   // map productName to name
//             category: p.category,
//             type: p.sweetType || '', 
//             description: p.description,
//             price: p.price,
//             imagePath: p.imageUrl
//           }));
//         this.isLoading = false;
//       },
//       error: (err) => {
//         console.error('Failed to load sweets:', err);
//         this.isLoading = false;
//       }
//     });
//   }

//   // Group sweets by type for display
//   get groupedByType(): SweetType[] {
//     const grouped: { [key: string]: SweetProduct[] } = {};

//     this.allSweets.forEach(sweet => {
//       const type = sweet.type.toLowerCase() || 'Other';
//       if (!grouped[type]) grouped[type] = [];
//       grouped[type].push(sweet);
//     });

//     // Convert to array of SweetCategory
//     return Object.keys(grouped).map(type => ({
//       name: type,
//       items: grouped[type]
//     }));
//   }

//   // Filter within grouped sweets
//   get filteredCategories(): SweetType[] {
//     const filter = this.filterText.toLowerCase().trim();
//     if (!filter) return this.groupedByType;

//     return this.groupedByType
//       .map(category => ({
//         ...category,
//         items: category.items.filter(s => 
//           s.name.toLowerCase().includes(filter) ||
//           s.type.toLowerCase().includes(filter)
//         )
//       }))
//       .filter(category => category.items.length > 0);
//   }
// }




















//old

// import { Component } from '@angular/core';
// import { RouterLink } from '@angular/router';
// import { FormsModule } from '@angular/forms'; // <-- NEW: Needed for two-way binding [(ngModel)]

// interface SweetProduct {
//   name: string;
//   category: string;
//   description: string;
//   price: string;
//   imagePath: string;
// }

// interface SweetCategory {
//   name: string;
//   items: SweetProduct[];
// }

// @Component({
//   selector: 'app-sweets-menu',
//   templateUrl: './sweets-menu.html',
//   styleUrls: ['./sweets-menu.css'],
//   standalone: true,
//   // NEW: Imports FormsModule for [(ngModel)] and RouterLink
//   imports: [RouterLink, FormsModule]
// })
// export class SweetsMenu {

//   // NEW: Property to hold the user's search input
//   filterText: string = '';

//   private allSweets: SweetProduct[] = [
//    // --- PEDA (Milk Solids) ---
//     {
//       name: 'Malai Peda Small',
//       category: 'Peda',
//       description: 'Rich, soft milk peda, prepared from fresh Malai (cream) and lightly flavored with cardamom. Perfect for a quick, bite-sized indulgence.',
//       price: '₹ 360 / kg',
//       imagePath: 'assets/images/sweets/mava-small-peda.jpg'
//     },
//     {
//       name: 'Malai Peda Big',
//       category: 'Peda',
//       description: 'Our premium, larger-sized Malai Peda. Features a luxuriously creamy texture and a dense, melt-in-mouth finish—ideal for celebrations.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/peda.jpg'
//     },
//     {
//       name: 'Khoa Peda',
//       category: 'Peda',
//       description: 'Traditional peda made with caramelized Khoa (mava) for a distinct dense, **grainy texture** and deep, sweet, authentic flavor.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/khoa-peda.jpg'
//     },
//     {
//       name: 'Coconut Laddoo',
//       category: 'Peda',
//       description: 'Soft, moist laddoos made from sweetened, finely shredded coconut and rich condensed milk. A light, tropical, melt-in-your-mouth treat.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/coconut-ladoo.jpg'
//     },
    
//     // --- MAVA FANCY (Specialty Milk Sweets) ---
//     {
//       name: 'Mava Badam Roll',
//       category: 'Mava Fancy',
//       description: 'A beautiful Mava sheet rolled around a crunchy core of **slivered almonds (badam)** and pistachios, offering contrasting texture and elegance.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/badam-roll.jpg'
//     },
//     {
//       name: 'Mava Cutlet',
//       category: 'Mava Fancy',
//       description: 'Unique Mava sweet shaped like a cutlet, typically **stuffed with saffron-flavored dry fruits** and lightly coated for a rich, moist bite.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/mava-cutlet.jpg'
//     },
//     {
//       name: 'Mava Fancy Sweet',
//       category: 'Mava Fancy',
//       description: 'Our **seasonal specialty Mava creation**, featuring intricate designs and rich, blended nuts—perfectly crafted for elegant gifting.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/mava-fancy.jpg'
//     },

//     // --- BARFEE (Condensed Milk Cakes) ---
//     {
//       name: 'Kalakand Barfee',
//       category: 'Barfee',
//       description: 'Granular and moist milk sweet with a delicate texture, achieved by using slightly **curdled milk**—a classic, creamy cottage cheese fudge.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/kalakand.jpg'
//     },
//     {
//       name: 'Milk Cake',
//       category: 'Barfee',
//       description: 'The classic Alwar Milk Cake, famous for its **porous, caramel-rich core** and signature two-tone brown and light color.',
//       price: '₹ 440 / kg',
//       imagePath: 'assets/images/sweets/milkcake.jpg'
//     },
//     {
//       name: 'Dodha Burfee',
//       category: 'Barfee',
//       description: 'A dark, dense, and chewy barfee made from **sprouted wheat, milk, and sugar**, giving it a distinct caramelized texture and robust flavor.',
//       price: '₹ 440 / kg',
//       imagePath: 'assets/images/sweets/dodha-burfee.jpg'
//     },
//     {
//       name: 'Mava Pista Barfee',
//       category: 'Barfee',
//       description: 'Smooth, dense Mava barfee, generously topped and mixed with finely chopped **pistachios** for flavor and visual appeal.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/pista-burfi.jpg'
//     },
//     {
//       name: 'Mava Plain Barfee',
//       category: 'Barfee',
//       description: 'Simple and pure, this barfee showcases the rich flavor of **high-quality Mava** with a smooth finish and minimal added flavoring.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/plain-burfi.jpg'
//     },
//     {
//       name: 'Mava Katli',
//       category: 'Barfee',
//       description: 'A delicate, **diamond-cut Mava sweet** that is often thinner than barfee, perfect for quick, light indulgence.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/mava-katli.jpg'
//     },
//     {
//       name: 'Coconut Barfee',
//       category: 'Barfee',
//       description: 'Thick, white, square-cut barfee made from fresh coconut, giving it a **chewy texture and a strong coconut essence.**',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/coconut-burfi.jpg'
//     },
//     {
//       name: 'Mava Double Decker Barfee',
//       category: 'Barfee',
//       description: 'A striking sweet featuring **two distinct layers** of Mava barfee, often colored and flavored separately (e.g., plain and saffron).',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/doubledecker.jpg'
//     },

//     // --- LADDOO ---
//     {
//       name: 'Motichoor Ladoo',
//       category: 'Laddoo',
//       description: 'Finely textured Motichoor (tiny besan spheres) **slow-cooked in pure ghee**, tightly pressed and rolled for a classic, sweet taste.',
//       price: '₹ 280 / kg',
//       imagePath: 'assets/images/sweets/motichur.jpg'
//     },
//     {
//       name: 'Besan Ghee Ladoo',
//       category: 'Laddoo',
//       description: 'Classic Besan Ladoo prepared with **aromatic pure ghee** and slow-roasted chickpea flour until golden and intensely nutty.',
//       price: '₹ 360 / kg',
//       imagePath: 'assets/images/sweets/besan-ghee.jpg'
//     },
//     {
//       name: 'Besan Sada Ladoo',
//       category: 'Laddoo',
//       description: 'A lighter version of Besan Ladoo, featuring the simple, authentic flavor of besan and a **perfectly crumbly, dry texture**.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/besan-sada.jpg'
//     },

//     // --- KAJU (Cashew) ---
//     {
//       name: 'Kaju Katli',
//       category: 'Kaju',
//       description: 'The iconic, thin, diamond-cut sweet made from **smooth, refined cashew paste**, usually finished with silver vark.',
//       price: '₹ 1000 / kg',
//       imagePath: 'assets/images/sweets/kaju-katli.jpg'
//     },
//     {
//       name: 'Kaju Roll',
//       category: 'Kaju',
//       description: 'Cashew paste rolled into small logs, often **stuffed with saffron-flavored Mava or rich almond pieces**.',
//       price: '₹ 1000 / kg',
//       imagePath: 'assets/images/sweets/kaju-roll.jpg'
//     },
//     {
//       name: 'Kaju Pan',
//       category: 'Kaju',
//       description: 'A creative Kaju sweet, shaped and filled to **resemble a traditional Paan**, often colored and flavored with gulkand.',
//       price: '₹ 1000 / kg',
//       imagePath: 'assets/images/sweets/kaju-pan.jpg'
//     },
//     {
//       name: 'Kaju Sangam',
//       category: 'Kaju',
//       description: 'A decorative Kaju sweet featuring a beautiful **blend or swirl of cashew and pistachio pastes** in a tiered or marble pattern.',
//       price: '₹ 1000 / kg',
//       imagePath: 'assets/images/sweets/kaju-sangam.jpg'
//     },
//     {
//       name: 'Kaju Rose Laddoo',
//       category: 'Kaju',
//       description: 'Cashew paste shaped into laddoos, infused with a delicate **rose essence** and often tinted pink for a floral, aromatic flavor.',
//       price: '₹ 1000 / kg',
//       imagePath: 'assets/images/sweets/kaju-rose-ladoo.jpg'
//     },
//     {
//       name: 'Kaju Tarbooj',
//       category: 'Kaju',
//       description: 'Novelty Kaju sweet, shaped and decorated to **look like a miniature watermelon** (tarbooj), often with a sweet, colorful filling.',
//       price: '₹ 1000 / kg',
//       imagePath: 'assets/images/sweets/Kaju-tarbooj.jpg'
//     },

//     // --- DRY FRUITS & TRADITIONAL ---
//     {
//       name: 'Anjeer Dry-Fruit Barfee',
//       category: 'Dry Fruits',
//       description: 'A dense, healthy barfee made primarily from **figs (Anjeer)** and mixed dry fruits, perfect as a low-sugar energy booster.',
//       price: '₹ 1200 / kg',
//       imagePath: 'assets/images/sweets/anjeerburfi.jpg'
//     },
//     {
//       name: 'Anjeer Dry-Fruit Cutlet',
//       category: 'Dry Fruits',
//       description: 'A premium blend of figs and nuts shaped into a decorative cutlet, often served as a **sugar-free, high-fiber** treat.',
//       price: '₹ 1200 / kg',
//       imagePath: 'assets/images/sweets/anjeer-cutlet.jpg'
//     },
//     {
//       name: 'Dry-Fruit Laddoo',
//       category: 'Dry Fruits',
//       description: 'High-energy laddoos made purely from a blend of **roasted nuts, seeds, and gond**, providing nourishment with minimal added sugar.',
//       price: '₹ 1200 / kg',
//       imagePath: 'assets/images/sweets/dryfruit-laddoo.jpg'
//     },
//     {
//       name: 'Khajoor Dry-Fruit Burfee',
//       category: 'Dry Fruits',
//       description: 'Barfee made from the **natural sweetness of dates (Khajoor)**, packed with crushed dry fruits for a wholesome and rich taste.',
//       price: '₹ 800 / kg',
//       imagePath: 'assets/images/sweets/khajoor-burfee.jpg'
//     },
//     {
//       name: 'Khajoor Dry-Fruit Katli',
//       category: 'Dry Fruits',
//       description: 'Thin, diamond-cut sweet using the **natural binding of dates** and finely ground nuts, a sugar-conscious Katli option.',
//       price: '₹ 800 / kg',
//       imagePath: 'assets/images/sweets/khajoor-katli.jpg'
//     },
//     {
//       name: 'Khajoor Dry-Fruit Cutlet',
//       category: 'Dry Fruits',
//       description: 'A decorative and healthy cutlet made from dates, almonds, and pistachios, offering a **soft, chewy texture**.',
//       price: '₹ 800 / kg',
//       imagePath: 'assets/images/sweets/khajoor-cutlet.jpg'
//     },

//     // --- CHHENA (Soft Cheese) ---
//     {
//       name: 'Rasgulla',
//       category: 'Chhena',
//       description: 'Soft, spongy chhena balls boiled in **light sugar syrup**, resulting in a classic, light, and juicy Bengali dessert.',
//       price: '₹ 15 / piece',
//       imagePath: 'assets/images/sweets/rasgulla.jpg'
//     },
//     {
//       name: 'Raj Bhog',
//       category: 'Chhena',
//       description: 'Large, **saffron-flavored chhena dumplings**, often stuffed with almonds or pistachios and soaked in a warm, fragrant syrup.',
//       price: '₹ 25 / piece',
//       imagePath: 'assets/images/sweets/rajbhog.jpg'
//     },
//     {
//       name: 'Chamcham',
//       category: 'Chhena',
//       description: 'An oblong-shaped, condensed milk sweet made from chhena, often **flavored and coated in shredded coconut**.',
//       price: '₹ 15 / piece',
//       imagePath: 'assets/images/sweets/chamcham.jpg'
//     },
//     {
//       name: 'Rasmalai',
//       category: 'Chhena',
//       description: 'Flat, soft chhena patties soaked in thick, **chilled, saffron- and cardamom-flavored milk** (ras).',
//       price: '₹ 30 / piece',
//       imagePath: 'assets/images/sweets/rasmalai.jpg'
//     },
//     {
//       name: 'Anguri Chhena',
//       category: 'Chhena',
//       description: 'Tiny, **grape-sized chhena balls** soaked in a delicate milk and syrup blend, typically served chilled.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/anguri.jpg'
//     },
//     {
//       name: 'Kesar Anguri Chhena',
//       category: 'Chhena',
//       description: 'Anguri Chhena infused with potent **Kesar (saffron)** for a rich golden color and pronounced aromatic flavor.',
//       price: '₹ 400 / kg',
//       imagePath: 'assets/images/sweets/kesar-anguri.jpg'
//     },
//     {
//       name: 'Malai Chhena',
//       category: 'Chhena',
//       description: 'A specialized chhena sweet blended with **fresh malai (cream)** for a richer, softer texture, often topped with dry fruits.',
//       price: '₹ 20 / piece , ₹400/Kg',
//       imagePath: 'assets/images/sweets/chhena.jpg'
//     },
    
//     // --- GULAB JAMUN & HOT SWEETS ---
//     {
//       name: 'Gulab Jamun',
//       category: 'Gulab Jamun',
//       description: 'Traditional milk solids dough, **deep-fried until dark brown**, and soaked in warm, fragrant rose sugar syrup.',
//       price: '₹ 15 / piece',
//       imagePath: 'assets/images/sweets/gulab-jamun.jpg'
//     },
//     {
//       name: 'Kala Jamun',
//       category: 'Gulab Jamun',
//       description: 'A darker, denser version of Gulab Jamun, fried until almost black, giving it a **caramelized, intense flavor.**',
//       price: '₹ 20 / piece , ₹ 400 / kg',
//       imagePath: 'assets/images/sweets/kala-jamun.jpg'
//     },
//     {
//       name: 'Malai Kala Jamun',
//       category: 'Gulab Jamun',
//       description: 'Kala Jamun with a **soft center of Malai (cream) or dry fruits**, adding richness and moisture to the intense flavor.',
//       price: '₹ 20 / piece, ₹400/ kg',
//       imagePath: 'assets/images/sweets/malai-jamun.jpg'
//     },
//   ];

//   // Helper method to group the data by category
//   private getGroupedMenu(): SweetCategory[] {
//     // Logic to filter allSweets and group them into categories
//     const categories = ['Kaju','Dry Fruits','Peda','Laddoo', 'Barfee', 'mava-fancy', 'Chhena', 'Gulab Jamun', ];
//     const grouped = categories.map(cat => ({
//       name: `${cat} Collection`,
//       items: this.allSweets.filter(sweet => sweet.category === cat)
//     }));
//     // Filter out empty categories for a cleaner display
//     return grouped.filter(g => g.items.length > 0);
//   }

//   // Final menu displayed on the page
//   private groupedMenu: SweetCategory[] = this.getGroupedMenu();

//   // NEW: Getter function to perform filtering based on user input
//   get filteredCategories(): SweetCategory[] {
//     const filter = this.filterText.toLowerCase().trim();

//     if (!filter) {
//       // If search is empty, return the full menu structure
//       return this.groupedMenu;
//     }

//     // 1. Filter the entire menu structure
//     return this.groupedMenu
//       .map(category => ({
//         ...category,
//         // 2. Filter items within each category based on name OR category
//         items: category.items.filter(sweet =>
//           sweet.name.toLowerCase().includes(filter) ||
//           sweet.category.toLowerCase().includes(filter)
//         )
//       }))
//       // 3. Keep only the categories that still have items after filtering
//       .filter(category => category.items.length > 0);
//   }

  
// }