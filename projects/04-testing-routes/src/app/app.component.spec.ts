import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {
  RouterLinkDirectiveStub,
  queryAllElementsByDirective,
} from '../testing';
import { RouterLink } from '@angular/router';

fdescribe('@AppComponent', () => {
  let appComponent: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [AppComponent, RouterTestingModule],
      declarations: [RouterLinkDirectiveStub],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;

    fixture.detectChanges();
  });

  it('#should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  it('#should show 3 elements with the "routerLink" directive', () => {
    const elements = queryAllElementsByDirective(
      fixture,
      RouterLinkDirectiveStub,
    );

    expect(elements.length).toBe(3);
  });

  it('#should match routerLinks with routes', () => {
    const elements = queryAllElementsByDirective(
      fixture,
      RouterLinkDirectiveStub,
    );

    const routerLinks = elements.map((element) =>
      element.injector.get(RouterLinkDirectiveStub),
    );

    expect(routerLinks[0].linkParams).toEqual('/products');
    expect(routerLinks[1].linkParams).toEqual('/auth/login');
    expect(routerLinks[2].linkParams).toEqual('/auth/register');
  });
});

// NO ESTÁ FUNCIONANDO OBTENER REFERENCIA DE LOS ELEMENTOS CON BY.DIRECTIVE
