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
import { HTTP_INTERCEPTORS, HttpStatusCode } from '@angular/common/http';
import { TokenInterceptor } from '@interceptors/token.interceptor';
import { TokenService } from './token.service';

describe('ProductsService', () => {
  let productsService: ProductsService;
  let httpTestingController: HttpTestingController;
  let tokenService: TokenService; // TokenService is a dependency of TokenInterceptor

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [
        ProductsService,
        TokenService, // you can try with the real service or you can use a spy
        { provide: HTTP_INTERCEPTORS, useClass: TokenInterceptor, multi: true },
      ],
    });

    productsService = TestBed.inject(ProductsService);
    httpTestingController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
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

      expect(req.request.body).toEqual(updatedProduct);
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

  describe('Test for "getOne" method', () => {
    it('should return a product', (doneFn) => {
      const productId = '123';
      const mockData = generateOneProduct();

      productsService.getOne(productId).subscribe((resp) => {
        expect(resp).toEqual(mockData);
        doneFn();
      });

      const requestedUrl = `${environment.API_URL}/products/${productId}`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(mockData);

      expect(req.request.method).toBe('GET');
    });

    it('should return the right message when we have a 404 error', (doneFn) => {
      const productId = '123';
      const errorMsg = 'El producto no existe';
      const serverText = 'Not found :p';
      const mockError = {
        status: HttpStatusCode.NotFound,
        statusText: serverText,
      };

      productsService.getOne(productId).subscribe({
        error: (err) => {
          expect(err).toBe(errorMsg);
          doneFn();
        },
      });

      const requestedUrl = `${environment.API_URL}/products/${productId}`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(serverText, mockError);
    });

    it('should return the right message when we have a 401 error', (doneFn) => {
      const productId = '123';
      const errorMsg = 'No estas permitido';
      const serverText = 'Unauthorized :p';
      const mockError = {
        status: 401,
        statusText: serverText,
      };

      productsService.getOne(productId).subscribe({
        error: (err) => {
          expect(err).toBe(errorMsg);
          doneFn();
        },
      });

      const requestedUrl = `${environment.API_URL}/products/${productId}`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(serverText, mockError);
    });

    it('should return the right message when we have a different error', (doneFn) => {
      const productId = '123';
      const errorMsg = 'Ups algo salio mal';
      const serverText = 'Internal Server Error :p';
      const mockError = {
        status: 500,
        statusText: serverText,
      };

      productsService.getOne(productId).subscribe({
        error: (err) => {
          expect(err).toBe(errorMsg);
          doneFn();
        },
      });

      const requestedUrl = `${environment.API_URL}/products/${productId}`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(serverText, mockError);
    });
  });

  describe('Test for Token Interceptor', () => {
    it('should working the token interceptor', (doneFn) => {
      const mockData: Product[] = generateManyProducts(10);
      const token = '1234566789';
      // 👀🥳🎉 spyOn() is another way that allows me to spy the REAL service (in this case)
      spyOn(tokenService, 'getToken').and.returnValue(token);

      productsService.getAllSimple().subscribe((resp) => {
        expect(resp.length).toEqual(mockData.length);
        expect(resp).toEqual(mockData);
        doneFn();
      });

      const requestedUrl = `${environment.API_URL}/products`;
      const req = httpTestingController.expectOne(requestedUrl);
      const headers = req.request.headers;

      expect(headers.get('Authorization')).toBe(`Bearer ${token}`);

      req.flush(mockData);
    });
  });
});
