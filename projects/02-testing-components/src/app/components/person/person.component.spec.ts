import { ComponentFixture, TestBed } from '@angular/core/testing';

import PersonComponent from './person.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Person } from '@models/person.model';

fdescribe('PersonComponent', () => {
  let appComponent: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    appComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(appComponent).toBeTruthy();
  });

  it('should render a <p> with the text content "My height is {person.height}"', () => {
    const text = `My height is ${appComponent.person.height}`;

    const compiled = fixture.nativeElement as HTMLElement;
    const paragraph = compiled.querySelector('p');

    expect(paragraph?.textContent).toBe(text);
  });

  it('should render a <p> with the text content "My height is {person.height}" - with "debugElement"', () => {
    appComponent.person = new Person('Tony', 'Stark', 29, 70, 1.68);
    const text = `My height is ${appComponent.person.height}`;

    fixture.detectChanges();

    // Si queremos ser agnósticos a donde se este corriendo nuestra app (cuando trabajamos fuera del browser, por ejemplo cuando usamos SSR), es una buena práctica obtener el 'nativeElement' a partir del 'debugElement'
    const debug = fixture.debugElement as DebugElement;
    const compiled = debug.nativeElement as HTMLElement;
    const paragrah = compiled.querySelector('p');

    expect(paragrah?.textContent).toBe(text);
    expect(paragrah?.textContent).toContain(appComponent.person.height);
  });

  it('should render a <h3> with the text "¡Hello {{person.name}}!" - with debugElement and By.css', () => {
    appComponent.person = new Person('Batman', 'Wayne', 30, 80, 1.72);
    const text = `¡Hello ${appComponent.person.name}!`;

    // tenemos que usar el detectChanges ya que abajo estamos haciendo una prueba con el render; nuestro template tiene que reflejar esos nuevos cambios que acabamos de hacer, de lo contrario la prueba fallaría.
    fixture.detectChanges();

    // Otra opción para ser agnósticos es hacerlo de la siguiente manera, usar el 'debugElement' junto con el 'By.css'
    const debug = fixture.debugElement as DebugElement;
    const h3Debug = debug.query(By.css('h3')) as DebugElement;
    const h3 = h3Debug.nativeElement as HTMLElement;

    expect(h3.textContent).toBe(text);
  });

  it('should the property person name be "Diego"', () => {
    appComponent.person = new Person('Diego', 'Gonzales', 28, 56, 1.7);
    expect(appComponent.person.name).toBe('Diego');
  });
});
