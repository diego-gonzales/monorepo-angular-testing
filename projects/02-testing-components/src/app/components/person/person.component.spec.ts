import { ComponentFixture, TestBed } from '@angular/core/testing';

import PersonComponent from './person.component';
import { Component, DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';
import { Person } from '@models/person.model';

describe('PersonComponent', () => {
  let personComponent: PersonComponent;
  let fixture: ComponentFixture<PersonComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(PersonComponent);
    personComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(personComponent).toBeTruthy();
  });

  it('should render a <p> with the text content "My height is {person.height}"', () => {
    const text = `My height is ${personComponent.person.height}`;

    const compiled = fixture.nativeElement as HTMLElement;
    const paragraph = compiled.querySelector('p');

    expect(paragraph?.textContent).toBe(text);
  });

  // Tests for @Input() in components
  it('should render a <p> with the text content "My height is {person.height}" - with "debugElement"', () => {
    personComponent.person = new Person('Tony', 'Stark', 29, 70, 1.68);
    const text = `My height is ${personComponent.person.height}`;

    fixture.detectChanges();

    // Si queremos ser agnósticos a donde se este corriendo nuestra app (cuando trabajamos fuera del browser, por ejemplo cuando usamos SSR), es una buena práctica obtener el 'nativeElement' a partir del 'debugElement'
    const debug = fixture.debugElement as DebugElement;
    const compiled = debug.nativeElement as HTMLElement;
    const paragrah = compiled.querySelector('p');

    expect(paragrah?.textContent).toBe(text);
    expect(paragrah?.textContent).toContain(personComponent.person.height);
  });

  it('should render a <h3> with the text "¡Hello {{person.name}}!" - with debugElement and By.css', () => {
    personComponent.person = new Person('Batman', 'Wayne', 30, 80, 1.72);
    const text = `¡Hello ${personComponent.person.name}!`;

    // tenemos que usar el detectChanges ya que abajo estamos haciendo una prueba con el render; nuestro template tiene que reflejar esos nuevos cambios que acabamos de hacer, de lo contrario la prueba fallaría.
    fixture.detectChanges();

    // Otra opción para ser agnósticos es hacerlo de la siguiente manera, usar el 'debugElement' junto con el 'By.css'
    const debug = fixture.debugElement as DebugElement;
    const h3Debug = debug.query(By.css('h3')) as DebugElement;
    const h3 = h3Debug.nativeElement as HTMLElement;

    expect(h3.textContent).toBe(text);
  });

  it('should the property person name be "Diego"', () => {
    personComponent.person = new Person('Diego', 'Gonzales', 28, 56, 1.7);
    expect(personComponent.person.name).toBe('Diego');
  });

  // Tests for user events (click)
  it('should display a text with the IMC when we execute the method "calculateIMC()"', () => {
    personComponent.person = new Person('Black', 'Widow', 32, 76, 1.68);
    const expectedIMC = personComponent.person.calculateIMC();

    personComponent.calculateIMC(); // we can execute directly the method (instead do click)
    fixture.detectChanges();

    const compiled = fixture.nativeElement as HTMLElement;
    const h5 = compiled.querySelector('h5');

    expect(h5?.textContent).toContain(expectedIMC);
  });

  it('should display a text with the IMC when a user clicks the button', () => {
    personComponent.person = new Person('Green', 'Arrow', 28, 50, 1.7);
    const expectedIMC = personComponent.person.calculateIMC();

    const buttonDebug = fixture.debugElement.query(By.css('button.btn-imc'));

    buttonDebug.triggerEventHandler('click');
    fixture.detectChanges();

    const h5 = (fixture.nativeElement as HTMLElement).querySelector('h5');

    expect(h5?.textContent).toContain(expectedIMC);
  });

  // Tests for @Output() in components
  it('should emit the person correctly when click the button "Emit person"', () => {
    const expectedPerson = new Person('Homero', 'Simpson', 40, 120, 1.6);
    personComponent.person = expectedPerson;

    let person: Person | undefined;
    personComponent.onEmitPerson.subscribe((value) => {
      person = value;
    });

    const buttonDebug = fixture.debugElement.query(By.css('button.btn-emit'));
    buttonDebug.triggerEventHandler('click');

    fixture.detectChanges();

    expect(person).toEqual(expectedPerson);
  });
});

// Pruebas aisladas al componente
@Component({
  template:
    '<app-person [person]="person" (onEmitPerson)="onEmittedPerson($event)" />',
})
class HostComponent {
  person = new Person('Bart', 'Simpson', 10, 28, 1.4);
  emittedPerson: Person | undefined;

  onEmittedPerson(person: Person) {
    this.emittedPerson = person;
  }
}

describe('PersonComponent from HostComponent', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [PersonComponent],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create ', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should display the person name', () => {
    const expectedName = hostComponent.person.name;
    const h3Debug = fixture.debugElement.query(By.css('app-person h3'));
    const h3 = h3Debug.nativeElement as HTMLHeadingElement;

    fixture.detectChanges();

    expect(h3.textContent).toContain(expectedName);
  });

  it('should emit the person correctly when click the button "Emit person"', () => {
    const expectedPerson = hostComponent.person;

    const buttonDebug = fixture.debugElement.query(
      By.css('app-person .btn-emit'),
    );

    buttonDebug.triggerEventHandler('click');
    fixture.detectChanges();

    expect(hostComponent.emittedPerson).toEqual(expectedPerson);
  });
});
