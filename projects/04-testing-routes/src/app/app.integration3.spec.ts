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
  observableMock,
  queryAllElementsByDirective,
  triggerClickElement,
} from '../testing';
import { routes } from './app.routes';
import ProductsComponent from '@components/products/products.component';
import ProductDetailComponent from '@components/product-detail/product-detail.component';
import { NO_ERRORS_SCHEMA } from '@angular/core';
import { ProductsService } from '@services/products.service';
import { ValueService } from '@services/value.service';
import OtherComponent from '@components/other/other.component';
import { AuthService } from '@services/auth.service';
import { generateOneUser } from '@mocks/user.mock';
import LoginComponent from '@routes/auth/login/login.component';

describe('@AppComponent integration test with real components and routes', () => {
  let appComponent: AppComponent;
  let fixture: ComponentFixture<AppComponent>;
  let router: Router;

  // Al realizar pruebas de integración estamos usando los componentes reales, y estos tienen sus propias dependencias, así que tenemos que mockearlas
  let productsServiceSpy: jasmine.SpyObj<ProductsService>;
  let valueServiceSpy: jasmine.SpyObj<ValueService>;
  let authServiceSpy: jasmine.SpyObj<AuthService>;

  beforeEach(async () => {
    const spyPS = jasmine.createSpyObj('ProductsService', ['getAll', 'getOne']);
    const spyVS = jasmine.createSpyObj('ValueService', ['getPromiseValue']);
    const spyAS = jasmine.createSpyObj('AuthService', ['getUser']);

    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        ProductsComponent,
        ProductDetailComponent,
        OtherComponent,
        LoginComponent,
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
        {
          provide: AuthService,
          useValue: spyAS,
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
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;

    router.initialNavigation();

    tick(); // wait while navigation end

    fixture.detectChanges(); // rendered component ngOnInit() (which router-outlet renders)
  }));

  it('#should create', () => {
    expect(appComponent).toBeTruthy();
  });

  it('#should show 4 elements with the "routerLink" directive', () => {
    const elements = queryAllElementsByDirective(fixture, RouterLinkWithHref);

    expect(elements.length).toBe(4);
  });

  // In this block of code we have an integration in OtherComponent, which has a guard.
  describe('when link "Other" is clicked and we have a session (guard allows us to enter)', () => {
    it('#should change the url name', fakeAsync(() => {
      const expectedUrl = '/other';
      const userMock = generateOneUser();

      authServiceSpy.getUser.and.returnValue(observableMock(userMock));

      triggerClickElement(fixture, 'route-other', true);

      tick(); // while navigation end

      fixture.detectChanges(); // ProductsComponent ngOnInit()

      tick(); // to resolve async data

      fixture.detectChanges();

      expect(router.url).toBe(expectedUrl);
    }));
  });

  // In this block of code we have an integration in OtherComponent, which has a guard.
  describe('when link "Other" is clicked and we do not have a session (guard does not allow us to enter)', () => {
    it('#should redirect to "login" page', fakeAsync(() => {
      const expectedUrl = '/';

      authServiceSpy.getUser.and.returnValue(observableMock(null));

      triggerClickElement(fixture, 'route-other', true);

      tick(); // while navigation end

      fixture.detectChanges(); // ProductsComponent ngOnInit()

      tick(); // to resolve async data

      fixture.detectChanges();

      expect(router.url).toBe(expectedUrl);
    }));
  });
});
