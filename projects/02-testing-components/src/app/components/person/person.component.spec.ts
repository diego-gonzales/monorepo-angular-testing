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

  // Tests for @Input() in components
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

  // Tests for user events (click)
  it('should display a text with the IMC when we execute the method "calculateIMC()"', () => {
    appComponent.person = new Person('Black', 'Widow', 32, 76, 1.68);
    const expectedIMC = appComponent.person.calculateIMC();

    appComponent.calculateIMC(); // we can execute directly the method (instead do click)
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const h5 = compiled.querySelector('h5');

    expect(h5?.textContent).toContain(expectedIMC);
  });

  it('should display a text with the IMC when a user clicks the button', () => {
    appComponent.person = new Person('Green', 'Arrow', 28, 50, 1.7);
    const expectedIMC = appComponent.person.calculateIMC();

    const buttonDebug = fixture.debugElement.query(By.css('button.btn-imc'));
    const h5 = (fixture.nativeElement as HTMLElement).querySelector('h5');

    buttonDebug.triggerEventHandler('click');
    fixture.detectChanges();

    expect(h5?.textContent).toContain(expectedIMC);
  });
});
