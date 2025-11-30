import { Component } from '@angular/core';
import { RouterLink } from '@angular/router';

interface ProductCategory{
   name: string,
   description : string,
   link: string,
   imagePath : string
}

@Component({
  selector: 'app-products',
  imports: [RouterLink],
  templateUrl: './products.html',
  styleUrl: './products.css'
})
export class Products {

  categories: ProductCategory[] = [
    {
      name: 'Dairy Products',
      description: 'Farm-fresh milk, paneer, ghee, and curd. Purity guaranteed.',
      link: '/products/dairy',
      imagePath: 'assets/images/products/dairy-product.jpg'
    },
    {
      name: 'Sweets Menu',
      description: 'Traditional handmade mithai: Laddoos, Barfis, Jalebi, and more.',
      link: '/products/sweets',
      imagePath: 'assets/images/products/sweets-menu.jpg'
    },
    {
      name: 'Snacks & Namkeen',
      description: 'Crispy, savory snacks and regional namkeen for every craving.',
      link: '/products/snacks',
      imagePath: 'assets/images/products/snack-namkeen.jpg'
    },
    {
      name: 'Cold Drinks',
      description: 'Refreshing chaas, lassi, flavored milk, and chilled beverages.',
      link: '/products/colddrinks',
      imagePath: 'assets/images/products/cold-drinks.jpg'
    },
  ]
  
}
