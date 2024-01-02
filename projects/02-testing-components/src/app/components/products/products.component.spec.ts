import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import ProductsComponent from './products.component';
import { ProductComponent } from '@components/product/product.component';
import { ProductsService } from '@services/products.service';
import { generateManyProducts } from '@mocks/product.mock';
import { of, defer } from 'rxjs';
import { By } from '@angular/platform-browser';
import { BTN_STATUS } from '../../constants';

fdescribe('ProductsComponent', () => {
  let productsComponent: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('ProductsService', ['getAll']);

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, ProductComponent],
      providers: [{ provide: ProductsService, useValue: spy }],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    productsComponent = fixture.componentInstance;
    productsServiceSpy = TestBed.inject(
      ProductsService,
    ) as jasmine.SpyObj<ProductsService>;

    const productsMock = generateManyProducts(5);
    productsServiceSpy.getAll.and.returnValue(of(productsMock));

    fixture.detectChanges(); // "ngOnInit()" es ejecuta en esta parte
  });

  it('should create', () => {
    expect(productsComponent).toBeTruthy();
  });

  describe('Test for "getAllProducts" method', () => {
    it("should call ProductsService's 'getAll' method", () => {
      expect(productsServiceSpy.getAll).toHaveBeenCalled();
      expect(productsServiceSpy.getAll).toHaveBeenCalledTimes(1);
    });

    it('should return a list of products', () => {
      const currentTotalProducts = productsComponent.products().length;

      const productsMock = generateManyProducts(10);
      productsServiceSpy.getAll.and.returnValue(of(productsMock));

      productsComponent.getAllProducts();

      expect(productsComponent.products().length).toBe(
        currentTotalProducts + productsMock.length,
      );
    });

    it('should render the list of products', () => {
      const currentTotalProducts = productsComponent.products().length;

      const productsMock = generateManyProducts(3);
      productsServiceSpy.getAll.and.returnValue(of(productsMock));

      productsComponent.getAllProducts();
      fixture.detectChanges();

      const productsDebug = fixture.debugElement.queryAll(
        By.css('app-product'),
      );

      expect(productsDebug.length).toBe(
        currentTotalProducts + productsMock.length,
      );
    });

    it('should change the status property from "loading" to "success"', fakeAsync(() => {
      const productsMock = generateManyProducts(4);
      productsServiceSpy.getAll.and.returnValue(
        defer(() => Promise.resolve(productsMock)),
      );

      productsComponent.getAllProducts();

      expect(productsComponent.status).toBe(BTN_STATUS.LOADING);

      tick(); // resuelve lo que está pendiente de forma asíncrona, como por ejemplo un observable, una promesa, un setTimeout.

      expect(productsComponent.status).toBe(BTN_STATUS.SUCCESS);
    }));

    it('should render the button with the text content "Loading..."', fakeAsync(() => {
      const productsMock = generateManyProducts(2);
      productsServiceSpy.getAll.and.returnValue(
        defer(() => Promise.resolve(productsMock)),
      );

      productsComponent.getAllProducts();
      fixture.detectChanges();

      const buttonDebug = fixture.debugElement.query(By.css('button.btn-more'));
      const button = buttonDebug.nativeElement as HTMLButtonElement;

      expect(button.textContent).toBe('Loading...');

      tick();
      fixture.detectChanges();

      expect(button.textContent).toBe('Load more');
    }));

    it('should change the status property from "loading" to "error"', fakeAsync(() => {
      productsServiceSpy.getAll.and.returnValue(
        defer(() => Promise.reject('Errorcito!!!')),
      );

      productsComponent.getAllProducts();

      expect(productsComponent.status).toBe(BTN_STATUS.LOADING);

      tick(3000); // wait 3s before resolve, because we have a setTimeout of 2s in the "error: () => {}" from the observable.

      expect(productsComponent.status).toBe(BTN_STATUS.ERROR);
    }));

    it('should render the button with the text content "Ups, error!"', fakeAsync(() => {
      productsServiceSpy.getAll.and.returnValue(
        defer(() => Promise.reject('Errorcito!!!')),
      );

      productsComponent.getAllProducts();
      fixture.detectChanges();

      const buttonDebug = fixture.debugElement.query(By.css('button.btn-more'));
      const button = buttonDebug.nativeElement as HTMLButtonElement;

      expect(button.textContent).toBe('Loading...');

      tick(3000);
      fixture.detectChanges();

      expect(button.textContent).toBe('Ups, error!');
    }));
  });
});
