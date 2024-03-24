import { ComponentFixture, TestBed } from '@angular/core/testing';

import ProductDetailComponent from './product-detail.component';
import { ActivatedRoute } from '@angular/router';
import { ActivatedRouteStub, observableMock } from '../../../testing';
import { ProductsService } from '@services/products.service';
import { Location } from '@angular/common';
import { generateOneProduct } from '@mocks/product.mock';

fdescribe('ProductDetailComponent', () => {
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

    const productId = '1';
    const productMock = {
      ...generateOneProduct(),
      id: productId,
    };

    activatedRouteStub.setParamMap({ id: '1' });
    productServiceSpy.getOne.and.returnValue(observableMock(productMock));

    fixture.detectChanges(); // ngOnInit
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
