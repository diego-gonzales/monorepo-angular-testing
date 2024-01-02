import { Component, signal } from '@angular/core';
import { CommonModule, NgOptimizedImage } from '@angular/common';
import { ProductsService } from '@services/products.service';
import { Product } from '@models/products.interface';
import { ProductComponent } from '@components/product/product.component';
import { BtnStatus } from '../../constants';

@Component({
  selector: 'app-products',
  standalone: true,
  imports: [CommonModule, ProductComponent],
  templateUrl: './products.component.html',
  styleUrl: './products.component.css',
})
export default class ProductsComponent {
  products = signal<Product[]>([]);
  limit = 10;
  offset = 0;
  status: BtnStatus = 'init';

  constructor(private _productsService: ProductsService) {}

  ngOnInit(): void {
    this.getAllProducts();
  }

  getAllProducts() {
    this.status = 'loading';

    this._productsService.getAll(this.limit, this.offset).subscribe({
      next: (resp) => {
        this.products.update((currentProducts) => [
          ...currentProducts,
          ...resp,
        ]);
        this.offset += this.limit;
        this.status = 'success';
      },
      error: () => {
        this.products.set([]);
        this.status = 'error';
      },
    });
  }
}
