import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import ProductDetailComponent from './product-detail.component';
import { ActivatedRoute } from '@angular/router';
import {
  ActivatedRouteStub,
  asyncData,
  getTextContent,
  observableMock,
  queryElementByTestId,
} from '../../../testing';
import { ProductsService } from '@services/products.service';
import { Location } from '@angular/common';
import { generateOneProduct } from '@mocks/product.mock';

describe('@ProductDetailComponent', () => {
  let component: ProductDetailComponent;
  let fixture: ComponentFixture<ProductDetailComponent>;
  let activatedRouteStub: ActivatedRouteStub;
  let productServiceSpy: jasmine.SpyObj<ProductsService>;
  let locationSpy: jasmine.SpyObj<Location>;

  beforeEach(async () => {
    const stub = new ActivatedRouteStub();
    const spy = jasmine.createSpyObj('ProductsService', ['getOne']);
    const spyL = jasmine.createSpyObj('Location', ['back']);

    await TestBed.configureTestingModule({
      imports: [ProductDetailComponent],
      // providers: [{ provide: ActivatedRoute, useClass: ActivatedRouteStub }],
      providers: [
        { provide: ActivatedRoute, useValue: stub },
        { provide: ProductsService, useValue: spy },
        { provide: Location, useValue: spyL },
      ],
    }).compileComponents();
  });

  beforeEach(() => {
    fixture = TestBed.createComponent(ProductDetailComponent);
    component = fixture.componentInstance;
    activatedRouteStub = TestBed.inject(
      ActivatedRoute,
    ) as unknown as ActivatedRouteStub;
    productServiceSpy = TestBed.inject(
      ProductsService,
    ) as jasmine.SpyObj<ProductsService>;
    locationSpy = TestBed.inject(Location) as jasmine.SpyObj<Location>;
  });

  it('#should create', () => {
    const productId = '1';
    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    activatedRouteStub.setParamMap({ id: productId });
    productServiceSpy.getOne.and.returnValue(observableMock(productMock));

    fixture.detectChanges(); // ngOnInit

    expect(component).toBeTruthy();
  });

  it('#should render the product when there is an id param', () => {
    const productId = '2';
    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    activatedRouteStub.setParamMap({ id: productId });
    productServiceSpy.getOne.and.returnValue(observableMock(productMock));

    fixture.detectChanges();

    const imgElement: HTMLImageElement = queryElementByTestId(
      fixture,
      'product-image',
    ).nativeElement;
    const h1TextContent = getTextContent(fixture, 'product-title');
    const h2TextContent = getTextContent(fixture, 'product-price');
    const pTextContent = getTextContent(fixture, 'product-description');

    expect(imgElement.src).toBe(productMock.images[0]);
    expect(h1TextContent).toBe(productMock.title);
    expect(h2TextContent).toContain(productMock.price.toString());
    expect(pTextContent).toBe(productMock.description);

    expect(productServiceSpy.getOne).toHaveBeenCalledOnceWith(productId);
  });

  it('should go back to the previous page when there is no an id param', () => {
    activatedRouteStub.setParamMap({});
    locationSpy.back.and.callThrough();

    fixture.detectChanges();

    expect(locationSpy.back).toHaveBeenCalled();
  });

  it('should change "isLoading" variable to "true"', fakeAsync(() => {
    const productId = '10';
    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    activatedRouteStub.setParamMap({ id: productId });
    productServiceSpy.getOne.and.returnValue(asyncData(productMock));

    fixture.detectChanges();

    expect(component.isLoading).toBeTruthy();

    tick();

    expect(component.isLoading).toBeFalsy();
  }));

  it('should show a loader before get the product', fakeAsync(() => {
    const productId = '10';
    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    activatedRouteStub.setParamMap({ id: productId });
    productServiceSpy.getOne.and.returnValue(asyncData(productMock));

    fixture.detectChanges();

    const loaderElementBefore = queryElementByTestId(fixture, 'loader');

    expect(loaderElementBefore).toBeDefined();

    tick();

    fixture.detectChanges();

    const loaderElementAfter = queryElementByTestId(fixture, 'loader');
    expect(loaderElementAfter).toBeNull();
  }));

  describe('When the type query param is sent', () => {
    it('#should be "customer"', () => {
      const productId = '11';
      const productMock = {
        ...generateOneProduct(),
        id: productId,
      };
      const typeQueryParamValue = 'customer';

      activatedRouteStub.setParamMap({ id: productId });
      activatedRouteStub.setQueryParamMap({ type: typeQueryParamValue });
      productServiceSpy.getOne.and.returnValue(observableMock(productMock));

      fixture.detectChanges();

      expect(component.typeQueryParam).toBe(typeQueryParamValue);
    });
  });
});
