import { ComponentFixture, TestBed } from '@angular/core/testing';
import { RouterTestingModule } from '@angular/router/testing';
import { AppComponent } from './app.component';
import {
  // RouterLinkDirectiveStub,
  queryAllElementsByDirective,
} from '../testing';
import { RouterLink, RouterLinkWithHref } from '@angular/router';
import { Component, NO_ERRORS_SCHEMA } from '@angular/core';

@Component({
  standalone: true,
  selector: 'app-header',
  template: '',
})
class HeaderComponentStub {}

@Component({
  standalone: true,
  selector: 'app-footer',
  template: '',
})
class FooterComponentStub {}

describe('@AppComponent', () => {
  let appComponent: AppComponent;
  let fixture: ComponentFixture<AppComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [
        AppComponent,
        RouterTestingModule,
        HeaderComponentStub,
        FooterComponentStub,
      ],
      // declarations: [RouterLinkDirectiveStub],
      // schemas: [NO_ERRORS_SCHEMA],
    }).compileComponents();

    fixture = TestBed.createComponent(AppComponent);
    appComponent = fixture.componentInstance;

    fixture.detectChanges();

    console.log(fixture.nativeElement);
  });

  it('#should create the app', () => {
    expect(appComponent).toBeTruthy();
  });

  it('#should show 3 elements with the "routerLink" directive', () => {
    const elements = queryAllElementsByDirective(fixture, RouterLinkWithHref);

    expect(elements.length).toBe(3);
  });

  it('#should match routerLinks with routes', () => {
    const elements = queryAllElementsByDirective(fixture, RouterLinkWithHref);

    const routerLinks = elements.map((element) =>
      element.injector.get(RouterLink),
    );

    expect(routerLinks[0].href).toEqual('/products');
    expect(routerLinks[1].href).toEqual('/auth/login');
    expect(routerLinks[2].href).toEqual('/auth/register');
  });
});

// NO ESTÁ FUNCIONANDO OBTENER REFERENCIA DE LOS ELEMENTOS CON BY.DIRECTIVE DE ROUTERLINKDIRECTIVESTUB, PERO SÍ CON ROUTERLINK

/*
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
*/
