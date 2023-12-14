import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductsService } from './products.service';
import { Product } from '@models/products.interface';
import { environment } from '../../environments/environment';
import {
  generateManyProducts,
  generateOneProduct,
} from '../mocks/product.mock';

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
        expect(resp).toEqual(mockData);
        doneFn();
      });

      // HTTP config
      const requestedUrl = `${environment.API_URL}/products`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(mockData);

      httpTestingController.verify();
    });
  });

  describe('Tests for "getAll" method', () => {
    it('should return a product list', (doneFn) => {
      const mockData: Product[] = generateManyProducts(10);

      productsService.getAll().subscribe((resp) => {
        expect(resp.length).toEqual(mockData.length);
        doneFn();
      });

      const requestedUrl = `${environment.API_URL}/products`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(mockData);

      httpTestingController.verify();
    });

    it('should return a product list where each product has a tax', (doneFn) => {
      const mockData: Product[] = [
        {
          ...generateOneProduct(),
          price: 100, // 100 * .19 = 19
        },
        {
          ...generateOneProduct(),
          price: 200, // 200 * .19 = 38
        },
        {
          ...generateOneProduct(),
          price: 0, // 0 * .19 = 0 --> but I want to receive '0'
        },
        {
          ...generateOneProduct(),
          price: -100, // -100 * .19 = -19 --> but I want to receive '0'
        },
      ];

      productsService.getAll().subscribe((resp) => {
        expect(resp[0].taxes).toEqual(19);
        expect(resp[1].taxes).toEqual(38);
        expect(resp[2].taxes).toEqual(0);
        expect(resp[3].taxes).toEqual(0);
        doneFn();
      });

      const requestedUrl = `${environment.API_URL}/products`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(mockData);

      httpTestingController.verify();
    });

    it('should send query params with limit 10 and offset 3', (doneFn) => {
      const mockData: Product[] = generateManyProducts(3);
      const limit = 10;
      const offset = 10;

      productsService.getAll(limit, offset).subscribe(() => {
        doneFn();
      });

      const requestedUrl = `${environment.API_URL}/products?limit=${limit}&offset=${offset}`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(mockData);

      const params = req.request.params;

      expect(params.get('limit')).toEqual(limit.toString());
      expect(params.get('offset')).toEqual(offset.toString());

      httpTestingController.verify();
    });
  });
});
