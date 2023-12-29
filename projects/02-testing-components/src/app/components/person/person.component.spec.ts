import { ComponentFixture, TestBed } from '@angular/core/testing';

import PersonComponent from './person.component';
import { DebugElement } from '@angular/core';
import { By } from '@angular/platform-browser';

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

  it('should render a <p> with the text content "I am a paragraph"', () => {
    const text = 'I am a paragraph';

    const compiled = fixture.nativeElement as HTMLElement;
    const paragraph = compiled.querySelector('p');

    expect(paragraph?.textContent).toBe(text);
  });

  it('should render a <p> with the text content "I am a paragraph" - with "debugElement"', () => {
    const text = 'I am a paragraph';
    // Si queremos ser agnósticos a donde se este corriendo nuestra app (cuando trabajamos fuera del browser, por ejemplo cuando usamos SSR), es una buena práctica obtener el 'nativeElement' a partir del 'debugElement'
    const debug = fixture.debugElement as DebugElement;
    const compiled = debug.nativeElement as HTMLElement;
    const paragrah = compiled.querySelector('p');

    expect(paragrah?.textContent).toBe(text);
  });

  it('should render a <h3> with the text "¡Hello from the Person Component!" - with debugElement and By.css', () => {
    const text = '¡Hello from the Person Component!';
    // Otra opción para ser agnósticos es hacerlo de la siguiente manera, usar el 'debugElement' junto con el 'By.css'
    const debug = fixture.debugElement as DebugElement;
    const h3Debug = debug.query(By.css('h3')) as DebugElement;
    const h3 = h3Debug.nativeElement as HTMLElement;

    expect(h3.textContent).toBe(text);
  });
});
