import { Component } from '@angular/core';
import { CommonModule, Location } from '@angular/common';
import { Product } from '@models/products.interface';
import { ActivatedRoute } from '@angular/router';
import { ProductsService } from '@services/products.service';

@Component({
  selector: 'app-product-detail',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './product-detail.component.html',
  styleUrl: './product-detail.component.css',
})
export default class ProductDetailComponent {
  productId: string | null = null;
  product: Product | null = null;
  isLoading: boolean = false;
  typeQueryParam: string | null = null;

  constructor(
    private _activatedRoute: ActivatedRoute,
    private _productsService: ProductsService,
    private _location: Location,
  ) {}

  ngOnInit(): void {
    this._activatedRoute.paramMap.subscribe((params) => {
      this.productId = params.get('id');
      if (this.productId) {
        return this.getProduct(this.productId);
      } else {
        this.goToBack();
      }
    });

    this._activatedRoute.queryParamMap.subscribe((queryParams) => {
      this.typeQueryParam = queryParams.get('type');
    });
  }

  private getProduct(productId: string) {
    this.isLoading = true;

    this._productsService.getOne(productId).subscribe({
      next: (data) => {
        this.product = data;
      },
      error: () => {
        this.goToBack();
      },
      complete: () => {
        this.isLoading = false;
      },
    });
  }

  goToBack() {
    this._location.back();
  }
}
