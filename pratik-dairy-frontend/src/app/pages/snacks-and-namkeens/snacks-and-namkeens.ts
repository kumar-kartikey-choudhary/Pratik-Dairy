// src/app/pages/snacks-and-namkeens/snacks-and-namkeens.component.ts

import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';
import { FormsModule } from '@angular/forms'; 

interface SnackProduct {
  name: string;
  category: string;
  description: string;
  price: string;
  imagePath: string;
}

interface SnackCategory {
  name: string;
  items: SnackProduct[];
}

@Component({
  selector: 'app-snacks-and-namkeens',
  templateUrl: './snacks-and-namkeens.html',
  styleUrls: ['./snacks-and-namkeens.css'],
  standalone: true,
  imports: [RouterLink, FormsModule]
})
export class SnacksAndNamkeens {
  
  filterText: string = ''; 

  private allSnacks: SnackProduct[] = [
    // --- Traditional Savories ---
    // --- NAMKEEN ---
    {
      name: 'Mixture',
      category: 'Namkeen',
      description: 'Classic All-in-One Mix. A savory, crunchy blend featuring a variety of textures—sev, peanuts, roasted lentils, and puffed rice, seasoned with a balanced spice blend.',
      price: '₹ 280 / Kg',
      imagePath: 'assets/images/snacks/mixture.jpg'
    },
    {
      name: 'Khatta Meetha Mix',
      category: 'Namkeen',
      description: 'Sweet & Tangy Delight. A perfect combination of sweet, sour, and spicy elements including peanuts, sev, and lentils for a balanced flavor profile.',
      price: '₹ 280 / kg',
      imagePath: 'assets/images/snacks/khatta-mitha.jpg'
    },
    {
      name: 'Aloo Bhujia',
      category: 'Namkeen',
      description: 'Thin, Crispy Potato Strands. Fine, delicate strands made from mashed potato and chickpea flour, seasoned with traditional Indian spices. Light and perfect for topping or snacking.',
      price: '₹ 280 / Kg',
      imagePath: 'assets/images/snacks/bhujiya.jpg'
    },
    {
      name: 'Ratlami Sev',
      category: 'Namkeen',
      description: 'Authentic Ratlami Spice. Famous for its bold, extra-spicy flavor and medium thickness. This Sev offers a fiery kick true to its Malwa origin.',
      price: '₹ 280 / Kg',
      imagePath: 'assets/images/snacks/ratlami.jpg'
    },
    {
      name: 'Clove Sev',
      category: 'Namkeen',
      description: 'Aromatic Lavang Sev. Chickpea flour sev distinctly flavored with lavang (cloves) and other warming spices. Offers a unique, aromatic, and savory taste—perfect with tea.',
      price: '₹ 280 / Kg',
      imagePath: 'assets/images/snacks/long-sev.jpg'
    },
    {
      name: 'Bhavnagri',
      category: 'Namkeen',
      description: 'Thick, Crunchy Sev. Coarsely textured, thick sev known for its robust crunch. Seasoned mildly, it is a versatile item often used as a base for many chaat preparations.',
      price: '₹ 280 / Kg',
      imagePath: 'assets/images/snacks/bhavnagri.jpg'
    },
    {
      name: 'Gathiya',
      category: 'Namkeen',
      description: 'Crisp, Lightly Puffed Strips. A famous Gujarati snack characterized by its puffy, airy texture. Lightly spiced and excellent for morning breakfast or snacking.',
      price: '₹ 280 / Kg',
      imagePath: 'assets/images/snacks/gathiya.jpg'
    },
    {
      name: 'Papdi',
      category: 'Namkeen',
      description: 'Flat, Crunchy Wafers. Thin, disc-shaped savory crackers made from refined flour and spices. Known for their satisfying snap, essential for Sev Puri and other chaat items.',
      price: '₹ 280 / Kg',
      imagePath: 'assets/images/snacks/papdi.jpg'
    },
    // --- Ready-to-Eat Snacks ---
    {
      name: 'Masala Mathri',
      category: 'Snacks',
      description: 'Flaky, savory crackers spiced with carom seeds and fenugreek. Perfect with tea.',
      price: '₹ 280 / kg',
      imagePath: 'assets/images/snacks/mathri.jpg'
    },
    {
      name: 'Shakarpara',
      category: 'Snacks',
      description: 'Sweet, diamond-shaped crispy bites made from semolina and sugar syrup. Ideal for light snacking.',
      price: '₹ 280 / Kg',
      imagePath: 'assets/images/snacks/sakkarpara.jpg'
    },
    {
      name: 'Chakli',
      category: 'Snacks',
      description: 'Spiral-shaped, crunchy snack made from rice flour and various lentils. Highly addictive!',
      price: '₹ 360 / kg',
      imagePath: 'assets/images/snacks/chakli.jpg'
    },
    // --- Farsan (Fried Delicacies) ---
    
    // {
    //   name: 'Samosa (Frozen/Ready)',
    //   category: 'Farsan',
    //   description: 'Classic triangular pastry filled with spiced potato and peas. Available for quick frying at home.',
    //   price: '₹ 120 / 6 pcs',
    //   imagePath: 'assets/images/snacks/samosa.jpg'
    // },


    //Family Pack Chips
    {
      name : 'Halke-Fulke',
      category : 'Chips',
      description : 'Salted Chips',
      price : '₹ 30 / per Unit',
      imagePath : 'assets/images/snacks/halke-fulke.jpg'
    },
    {
      name : 'Taka -Tak',
      category : 'Chips',
      description : 'Salted Chips',
      price : '₹ 30 / per Unit',
      imagePath : 'assets/images/snacks/taka-tak.jpg'
    },
    {
      name : 'KurKure',
      category : 'Chips',
      description : 'Available in all Flavours',
      price : '₹ 30 / per Unit',
      imagePath : 'assets/images/snacks/kurkure.jpg'
    },
  ];

  // Helper method to group the data by category
  private getGroupedMenu(): SnackCategory[] {
      const categories = ['Namkeen', 'Snacks', 'Chips'];
      
      const displayMap: { [key: string]: string } = {
          'Namkeen': 'Namkeen (Savory Mixes)',
          'Snacks': 'Ready-to-Eat Snacks',
          // 'Farsan': 'Farsan (Fried Delicacies)',
          'Chips': 'Chips : Family-Packs'
      };

      const grouped = categories.map(cat => ({
          name: displayMap[cat] || `${cat} Collection`,
          items: this.allSnacks.filter(snack => snack.category.toLowerCase() === cat.toLowerCase())
      }));
      
      return grouped.filter(g => g.items.length > 0);
  }

  private groupedMenu: SnackCategory[] = this.getGroupedMenu();

  // Getter function to perform filtering based on user input
  get filteredCategories(): SnackCategory[] {
      const filter = this.filterText.toLowerCase().trim();
      
      if (!filter) {
          return this.groupedMenu;
      }

      // Filter logic: Checks name OR category
      return this.groupedMenu
          .map(category => ({
              ...category,
              items: category.items.filter(snack => 
                  snack.name.toLowerCase().includes(filter) ||
                  snack.category.toLowerCase().includes(filter)
              )
          }))
          .filter(category => category.items.length > 0);
  }
}
