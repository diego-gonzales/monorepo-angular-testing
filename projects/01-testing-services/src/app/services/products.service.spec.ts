import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductsService } from './products.service';
import { Product } from '@models/products.interface';
import { environment } from '../../environments/environment';
import { generateManyProducts } from '../mocks/product.mock';

fdescribe('ProductsService', () => {
  let productsService: ProductsService;
  let httpTestingController: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [ProductsService],
    });

    productsService = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
  });

  it('should be created', () => {
    expect(productsService).toBeTruthy();
  });

  describe('Tests for "getAllSimple" method', () => {
    it('should return a product list', (doneFn) => {
      // Arrange
      const mockData: Product[] = generateManyProducts(10);

      // Act
      productsService.getAllSimple().subscribe((resp) => {
        // Assert
        expect(resp.length).toEqual(mockData.length);
        doneFn();
      });

      // HTTP config
      const requestedUrl = `${environment.API_URL}/products`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(mockData);

      httpTestingController.verify();
    });
  });
});
