// This test are made to MODULE level, so we can't testing routes loaded lazily, we should test this routes in his respective module.

import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';
import { AppComponent } from './app.component';
import { RouterTestingModule } from '@angular/router/testing';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';
import { Router, RouterLinkWithHref } from '@angular/router';
import {
  queryAllElementsByDirective,
  queryElement,
  triggerClickElement,
} from '../testing';

// Using fake components and routes
@Component({
  standalone: true,
  selector: 'app-products',
  template: '',
})
class ProductsComponent {}

@Component({
  standalone: true,
  selector: 'app-product-detail',
  template: '',
})
class ProductDetailComponent {}

const routes = [
  {
    path: 'products',
    component: ProductsComponent,
  },
  {
    path: 'products/:id',
    component: ProductDetailComponent,
  },
];

describe('@AppComponent integration test with fake components and routes', () => {
  let appComponent: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        ProductsComponent,
        ProductDetailComponent,
        RouterTestingModule.withRoutes(routes),
      ],
      // schemas: [NO_ERRORS_SCHEMA]
    }).compileComponents();
  });

  beforeEach(fakeAsync(() => {
    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;

    fixture.detectChanges();

    router = TestBed.inject(Router);
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

      triggerClickElement(fixture, 'route-products', true);

      tick();

      fixture.detectChanges(); // ProductsComponent ngOnInit()

      expect(router.url).toBe(expectedUrl);
    }));

    it('#should render products component', fakeAsync(() => {
      triggerClickElement(fixture, 'route-products', true);

      tick();

      fixture.detectChanges(); // ProductsComponent ngOnInit()

      const productsElement = queryElement(fixture, 'app-products');

      expect(productsElement).toBeDefined();
    }));
  });
});
