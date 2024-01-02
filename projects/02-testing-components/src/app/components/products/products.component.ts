import { Component, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductsService } from '@services/products.service';
import { Product } from '@models/products.interface';
import { ProductComponent } from '@components/product/product.component';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductComponent],
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
    this._productsService.getAll().subscribe((resp) => {
      console.log(resp);
      this.products.set(resp);
    });
  }
}
