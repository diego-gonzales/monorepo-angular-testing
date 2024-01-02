import { ComponentFixture, TestBed } from '@angular/core/testing';

import ProductsComponent from './products.component';
import { ProductComponent } from '@components/product/product.component';
import { ProductsService } from '@services/products.service';
import { generateManyProducts } from '@mocks/product.mock';
import { of } from 'rxjs';

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

  it('should call the "getAll" method', () => {
    expect(productsServiceSpy.getAll).toHaveBeenCalled();
    expect(productsServiceSpy.getAll).toHaveBeenCalledTimes(1);
  });
});
