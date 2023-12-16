import { TestBed } from '@angular/core/testing';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';

import { ProductsService } from './products.service';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '@models/products.interface';
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

  afterEach(() => {
    httpTestingController.verify();
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
      req.flush(mockData); // <-- here "mockData" is used as return value
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
      req.flush(mockData); // <-- here "mockData" is used as return value
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
      req.flush(mockData); // <-- here "mockData" is used as return value
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
      req.flush(mockData); // <-- here "mockData" is used as return value

      const params = req.request.params;

      expect(params.get('limit')).toEqual(limit.toString());
      expect(params.get('offset')).toEqual(offset.toString());
    });
  });

  describe('Test for "create" method', () => {
    it('should create a new product', (doneFn) => {
      const mockData = generateOneProduct();
      const newProduct: CreateProductDTO = {
        title: 'New Product',
        price: 100,
        images: ['imgUrl'],
        description: 'This is a description',
        categoryId: 20,
      };

      productsService.create({ ...newProduct }).subscribe((resp) => {
        expect(resp).toEqual(mockData);
        doneFn();
      });

      const requestedUrl = `${environment.API_URL}/products`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(mockData); // <-- here "mockData" is used as return value

      expect(req.request.body).toEqual(newProduct);
      expect(req.request.method).toEqual('POST');
    });
  });

  describe('Test for "update" method', () => {
    it('should update a product', (doneFn) => {
      const productId = '123';
      const mockData = generateOneProduct();
      const updatedProduct: UpdateProductDTO = {
        categoryId: 4,
        title: 'Updated product',
        description: 'This is an updated description',
        price: 20,
      };

      productsService
        .update(productId, { ...updatedProduct })
        .subscribe((resp) => {
          expect(resp).toEqual(mockData);
          doneFn();
        });

      const requestedUrl = `${environment.API_URL}/products/${productId}`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(mockData);

      expect(req.request.body).toBe(updatedProduct);
      expect(req.request.method).toBe('PUT');
    });
  });

  describe('Test for "delete" method', () => {
    it('should delete a product', (doneFn) => {
      const productId = '123456';

      productsService.delete(productId).subscribe((resp) => {
        expect(resp).toBeTrue();
        doneFn();
      });

      const requestUrl = `${environment.API_URL}/products/${productId}`;
      const req = httpTestingController.expectOne(requestUrl);
      req.flush(true);

      expect(req.request.method).toEqual('DELETE');
    });
  });
});
