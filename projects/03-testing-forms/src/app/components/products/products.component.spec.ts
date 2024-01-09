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
import { BTN_STATUS } from '../../constants';
import { ValueService } from '@services/value.service';
import {
  asyncData,
  asyncError,
  getTextContent,
  observableMock,
  promiseMock,
  queryAllElements,
  queryElementByTestId,
} from '../../../testing';

describe('ProductsComponent', () => {
  let productsComponent: ProductsComponent;
  let fixture: ComponentFixture<ProductsComponent>;
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const spy_p = jasmine.createSpyObj('ProductsService', ['getAll']);
    const spy_v = jasmine.createSpyObj('ValueService', ['getPromiseValue']);

    await TestBed.configureTestingModule({
      imports: [ProductsComponent, ProductComponent],
      providers: [
        { provide: ProductsService, useValue: spy_p },
        { provide: ValueService, useValue: spy_v },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductsComponent);
    productsComponent = fixture.componentInstance;
    productsServiceSpy = TestBed.inject(
      ProductsService,
    ) as jasmine.SpyObj<ProductsService>;
    valueServiceSpy = TestBed.inject(
      ValueService,
    ) as jasmine.SpyObj<ValueService>;

    const productsMock = generateManyProducts(5);
    productsServiceSpy.getAll.and.returnValue(observableMock(productsMock));

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
      productsServiceSpy.getAll.and.returnValue(observableMock(productsMock));

      const buttonDebug = queryElementByTestId(fixture, 'btn-more');
      buttonDebug.triggerEventHandler('click');

      expect(productsComponent.products().length).toBe(
        currentTotalProducts + productsMock.length,
      );
    });

    it('should render the list of products', () => {
      const currentTotalProducts = productsComponent.products().length;

      const productsMock = generateManyProducts(3);
      productsServiceSpy.getAll.and.returnValue(observableMock(productsMock));

      const buttonDebug = queryElementByTestId(fixture, 'btn-more');
      buttonDebug.triggerEventHandler('click');

      fixture.detectChanges();

      const productsDebug = queryAllElements(fixture, 'app-product');

      expect(productsDebug.length).toBe(
        currentTotalProducts + productsMock.length,
      );
    });

    it('should change the status property from "loading" to "success"', fakeAsync(() => {
      const productsMock = generateManyProducts(4);
      productsServiceSpy.getAll.and.returnValue(asyncData(productsMock));

      const buttonDebug = queryElementByTestId(fixture, 'btn-more');
      buttonDebug.triggerEventHandler('click');

      expect(productsComponent.status).toBe(BTN_STATUS.LOADING);

      tick(); // resuelve lo que está pendiente de forma asíncrona, como por ejemplo un observable, una promesa, un setTimeout.

      expect(productsComponent.status).toBe(BTN_STATUS.SUCCESS);
    }));

    it('should render the button with the text content "Loading..."', fakeAsync(() => {
      const productsMock = generateManyProducts(2);
      productsServiceSpy.getAll.and.returnValue(asyncData(productsMock));

      const buttonDebug = queryElementByTestId(fixture, 'btn-more');
      buttonDebug.triggerEventHandler('click');

      fixture.detectChanges();

      const buttonTextContentBefore = getTextContent(fixture, 'btn-more');
      expect(buttonTextContentBefore).toBe('Loading...');

      tick();
      fixture.detectChanges();

      const buttonTextContentAfter = getTextContent(fixture, 'btn-more');
      expect(buttonTextContentAfter).toBe('Load more');
    }));

    it('should change the status property from "loading" to "error"', fakeAsync(() => {
      productsServiceSpy.getAll.and.returnValue(asyncError('Errorcito!!!'));

      const buttonDebug = queryElementByTestId(fixture, 'btn-more');
      buttonDebug.triggerEventHandler('click');

      expect(productsComponent.status).toBe(BTN_STATUS.LOADING);

      tick(3000); // wait 3s before resolve, because we have a setTimeout of 2s in the "error: () => {}" from the observable.

      expect(productsComponent.status).toBe(BTN_STATUS.ERROR);
    }));

    it('should render the button with the text content "Ups, error!"', fakeAsync(() => {
      productsServiceSpy.getAll.and.returnValue(asyncError('Errorcito!!!'));

      const buttonDebug = queryElementByTestId(fixture, 'btn-more');
      buttonDebug.triggerEventHandler('click');

      fixture.detectChanges();

      const buttonTextContentBefore = getTextContent(fixture, 'btn-more');
      expect(buttonTextContentBefore).toBe('Loading...');

      tick(3000);
      fixture.detectChanges();

      const buttonTextContentAfter = getTextContent(fixture, 'btn-more');
      expect(buttonTextContentAfter).toBe('Ups, error!');
    }));
  });

  describe('Test for "callPromise" method', () => {
    it("should set 'response' correctly, and also call ValueServices's getPromiseValue method", async () => {
      const mockValue = 'my mock string';

      valueServiceSpy.getPromiseValue.and.returnValue(promiseMock(mockValue));

      await productsComponent.callPromise();

      expect(productsComponent.response).toBe(mockValue);
      expect(valueServiceSpy.getPromiseValue).toHaveBeenCalled();
      expect(valueServiceSpy.getPromiseValue).toHaveBeenCalledTimes(1);
    });

    it('should render a paragraph with the promise value when the button is clicked', fakeAsync(() => {
      const mockValue = 'my mock value';

      valueServiceSpy.getPromiseValue.and.returnValue(promiseMock(mockValue));

      const buttonDebug = queryElementByTestId(fixture, 'btn-promise');

      buttonDebug.triggerEventHandler('click');

      tick();
      fixture.detectChanges();

      const paragraphTextContent = getTextContent(fixture, 'promise-response');

      expect(paragraphTextContent).toBe(mockValue);
      expect(valueServiceSpy.getPromiseValue).toHaveBeenCalled();
      expect(valueServiceSpy.getPromiseValue).toHaveBeenCalledTimes(1);
    }));
  });
});
