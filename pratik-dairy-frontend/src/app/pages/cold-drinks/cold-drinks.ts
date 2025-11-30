// src/app/pages/cold-drinks/cold-drinks.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

interface DrinkProduct {
  name: string;
  category: string;
  description: string;
  price: string;
  imagePath: string;
}

interface DrinkCategory {
  name: string;
  items: DrinkProduct[];
}

@Component({
  selector: 'app-cold-drinks',
  templateUrl: './cold-drinks.html',
  styleUrls: ['./cold-drinks.css'],
  standalone: true,
  imports: [RouterLink, FormsModule]
})
export class ColdDrinks {
  
  filterText: string = ''; 

  private allDrinks: DrinkProduct[] = [
    // --- 1. COLA & DARK CARBONATED DRINKS ---
    {
      name: 'Coca-Cola (Regular)',
      category: 'Cola & Soda',
      description: 'The classic, chilled carbonated soft drink. Available in various sizes.',
      price: '₹ 45 / 750ml',
      imagePath: 'assets/images/drinks/coke.jpg'
    },
    {
      name: 'Thums Up (Strong Cola)',
      category: 'Cola & Soda',
      description: 'India\'s favorite—a strong, highly carbonated cola with a signature sharp taste.',
      price: '₹ 45 / 750ml',
      imagePath: 'assets/images/drinks/thums-up.jpg'
    },
    {
      name: 'Pepsi',
      category: 'Cola & Soda',
      description: 'Popular dark cola known for its signature crisp, sweet finish.',
      price: '₹ 45 / 750ml',
      imagePath: 'assets/images/drinks/pepsi.jpg'
    },
    // --- 2. LIME & LEMON FLAVORS ---
    {
      name: 'Sprite',
      category: 'Lemon & Lime',
      description: 'A clear, crisp, and refreshing lemon-lime flavored soft drink. Caffeine-free.',
      price: '₹ 45 / 750ml',
      imagePath: 'assets/images/drinks/sprite.jpg'
    },
    {
      name: '7 UP',
      category: 'Lemon & Lime',
      description: 'Clear, light, and fizzy lemon-flavored soda. Perfect for refreshment.',
      price: '₹ 45 / 750ml',
      imagePath: 'assets/images/drinks/7up.jpg'
    },
    {
      name: 'Limca',
      category: 'Lemon & Lime',
      description: 'Clear, light, and fizzy lemon-flavored soda. Perfect for refreshment.',
      price: '₹ 40 / 600ml',
      imagePath: 'assets/images/drinks/limca.jpg'
    },
    {
      name: 'Mountain Dew',
      category: 'Citrus & Energy',
      description: 'A highly caffeinated, bright citrus-flavored soft drink for an energetic boost.',
      price: '₹ 45 / 750ml',
      imagePath: 'assets/images/drinks/mountain-dew.jpg'
    },
    // --- 3. JUICES & WATER ---
    {
      name: 'Fanta Orange',
      category: 'Fizzy Flavors',
      description: 'Fizzy, bright orange-flavored soft drink. Sweet and bubbly.',
      price: '₹ 45 / 600ml',
      imagePath: 'assets/images/drinks/fanta.jpg'
    },
    {
      name: 'Mirinda',
      category: 'Fizzy Flavors',
      description: 'Popular orange-flavored soft drink known for its strong taste and bright color.',
      price: '₹ 45 / 600ml',
      imagePath: 'assets/images/drinks/mirinda.jpg'
    },
    {
      name: 'Maaza',
      category: 'Fizzy Flavors',
      description: 'Popular mango-flavored soft drink known for its strong taste and bright color.',
      price: '₹ 45 / 750ml',
      imagePath: 'assets/images/drinks/maza.jpg'
    },
    {
      name: 'Fresh  Mineral-Water',
      category: 'Essentials',
      description: 'Sealed, chilled bottles of mineral water. Available in multiple sizes.',
      price: '₹ 10 / Bottle',
      imagePath: 'assets/images/drinks/water-bottle.jpg'
    },
    {
      name: 'Fresh Mineral-Water',
      category: 'Essentials',
      description: 'Sealed, chilled bottles of mineral water. Available in multiple sizes.',
      price: '₹ 20 / Bottle , 1L',
      imagePath: 'assets/images/drinks/water-bottle.jpg'
    },
    {
      name: 'Fresh Mineral - Water',
      category: 'Essentials',
      description: 'Sealed, chilled bottles of mineral water. Available in multiple sizes.',
      price: '₹ 30 / Bottle , 2L',
      imagePath: 'assets/images/drinks/water-bottle2.jpg'
    },
  ];

  // Helper function to group the data by category
  private getGroupedMenu(): DrinkCategory[] {
      const categories = ['Cola & Soda', 'Lemon & Lime', 'Fizzy Flavors', 'Essentials'];
      
      const grouped = categories.map(cat => ({
          name: cat,
          items: this.allDrinks.filter(drink => drink.category === cat)
      }));
      
      return grouped.filter(g => g.items.length > 0);
  }

  private groupedMenu: DrinkCategory[] = this.getGroupedMenu();

  // Getter function to perform filtering based on user input (reused search logic)
  get filteredCategories(): DrinkCategory[] {
      const filter = this.filterText.toLowerCase().trim();
      
      if (!filter) {
          return this.groupedMenu;
      }

      return this.groupedMenu
          .map(category => ({
              ...category,
              items: category.items.filter(drink => 
                  drink.name.toLowerCase().includes(filter) ||
                  drink.category.toLowerCase().includes(filter)
              )
          }))
          .filter(category => category.items.length > 0);
  }
}