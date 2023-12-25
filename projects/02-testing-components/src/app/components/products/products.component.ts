import { Component, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductsService } from '@services/products.service';
import { Product } from '@models/products.interface';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, NgOptimizedImage],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export default class ProductsComponent {
  products = signal<Product[]>([]);

  constructor(private _productsService: ProductsService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this._productsService.getAllSimple().subscribe((resp) => {
      console.log(resp);
      this.products.set(resp);
    });
  }
}
