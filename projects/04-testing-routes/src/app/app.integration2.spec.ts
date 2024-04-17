// This test are made to MODULE level, so we can't testing routes loaded lazily, we should test this routes in his respective module.

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Router, RouterLinkWithHref } from '@angular/router';
import {
  asyncData,
  observableMock,
  queryAllElements,
  queryAllElementsByDirective,
  queryElement,
  triggerClickElement,
} from '../testing';
import { routes } from './app.routes';
import ProductsComponent from '@components/products/products.component';
import ProductDetailComponent from '@components/product-detail/product-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductsService } from '@services/products.service';
import { ValueService } from '@services/value.service';
import { generateManyProducts } from '@mocks/product.mock';

fdescribe('@AppComponent integration test with real components and routes', () => {
  let appComponent: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  // Al realizar pruebas de integración estamos usando los componentes reales, y estos tienen sus propias dependencias, así que tenemos que mockearlas
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;

  beforeEach(async () => {
    const spyPS = jasmine.createSpyObj('ProductsService', ['getAll', 'getOne']);
    const spyVS = jasmine.createSpyObj('ValueService', ['getPromiseValue']);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        ProductsComponent,
        ProductDetailComponent,
        RouterTestingModule.withRoutes(routes),
      ],
      providers: [
        {
          provide: ProductsService,
          useValue: spyPS,
        },
        {
          provide: ValueService,
          useValue: spyVS,
        },
      ],
      // schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;

    fixture.detectChanges();

    router = TestBed.inject(Router);
    productsServiceSpy = TestBed.inject(
      ProductsService,
    ) as jasmine.SpyObj<ProductsService>;
    valueServiceSpy = TestBed.inject(
      ValueService,
    ) as jasmine.SpyObj<ValueService>;

    router.initialNavigation();

    tick(); // wait while navigation end

    fixture.detectChanges(); // rendered component ngOnInit() (which router-outlet renders)
  }));

  it('#should create', () => {
    expect(appComponent).toBeTruthy();
  });

  it('#should show 3 elements with the "routerLink" directive', () => {
    const elements = queryAllElementsByDirective(fixture, RouterLinkWithHref);

    expect(elements.length).toBe(3);
  });

  describe('when link "Products" is clicked', () => {
    it('#should change the url name', fakeAsync(() => {
      const expectedUrl = '/products';
      const productsMock = generateManyProducts(5);

      productsServiceSpy.getAll.and.returnValue(asyncData(productsMock));

      triggerClickElement(fixture, 'route-products', true);

      tick(); // while navigation end

      fixture.detectChanges(); // ProductsComponent ngOnInit()

      expect(router.url).toBe(expectedUrl);
    }));

    it('#should render products component', fakeAsync(() => {
      const productsMock = generateManyProducts(5);

      productsServiceSpy.getAll.and.returnValue(asyncData(productsMock));

      triggerClickElement(fixture, 'route-products', true);

      tick(); // while navigation end

      fixture.detectChanges(); // ProductsComponent ngOnInit()

      const productsElement = queryElement(fixture, 'app-products');

      expect(productsElement).toBeDefined();
    }));

    it('#should render the correct quantity of "app-product"', fakeAsync(() => {
      const totalProducts = 5;
      const productsMock = generateManyProducts(totalProducts);

      productsServiceSpy.getAll.and.returnValue(asyncData(productsMock));

      triggerClickElement(fixture, 'route-products', true);

      tick(); // while navigation end

      fixture.detectChanges(); // ProductsComponent ngOnInit()

      tick(); // to resolve async data

      fixture.detectChanges(); // Después del ngOnInit

      const productElements = queryAllElements(fixture, 'app-product');

      expect(productElements.length).toBe(totalProducts);
    }));
  });
});
