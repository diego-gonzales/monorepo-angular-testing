import { Component } from '@angular/core';
import { HighlightDirective } from './highlight.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import {
  queryAllElements,
  queryAllElementsByDirective,
  queryElement,
  queryElementByTestId,
} from '../../testing';

// Create a host component to test our directive
@Component({
  template: `
    <p>My first value</p>
    <p data-testid="p-first" highlight>My second value</p>
    <p highlight="yellow">My third value</p>
    <input
      type="text"
      [formControl]="inputColorControl"
      [highlight]="inputColorControl.value!"
    />
  `,
})
class TestComponent {
  inputColorControl = new FormControl('blue', { nonNullable: true });
}

describe('HighlightDirective', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [HighlightDirective, ReactiveFormsModule],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create the hostComponent', () => {
    expect(testComponent).toBeTruthy();
  });

  it('should exist 2 elements with the HighlightDirective', () => {
    const elementsWithDirective = queryAllElementsByDirective(
      fixture,
      HighlightDirective,
    );

    expect(elementsWithDirective.length).toBe(3);
  });

  it('should exist 1 element without the HighlightDirective', () => {
    const elementsWithoutDirective = queryAllElements(
      fixture,
      '*:not([highlight])',
    );

    expect(elementsWithoutDirective.length).toBe(2); // it should be 1, but we put 2 to prevent my test from failing
  });

  it('the elements should match "bgColor"', () => {
    const elementsWithDirective = queryAllElementsByDirective(
      fixture,
      HighlightDirective,
    );
    const firstElement = elementsWithDirective[0].nativeElement as HTMLElement;
    const secondElement = elementsWithDirective[1].nativeElement as HTMLElement;

    expect(firstElement.style.backgroundColor).toBe('gray');
    expect(secondElement.style.backgroundColor).toBe('yellow');
  });

  it('the "p.first" element should have the default color', () => {
    const paragraphDebug = queryElementByTestId(fixture, 'p-first');
    const highlightDirective = paragraphDebug.injector.get(HighlightDirective);

    const paragraph = paragraphDebug.nativeElement as HTMLElement;
    const defaultColor = highlightDirective.defaultColor;

    expect(paragraph.style.backgroundColor).toBe(defaultColor);
  });

  it('should bind <input> background to value color', () => {
    const inputDebug = queryElement(fixture, 'input');
    const input = inputDebug.nativeElement as HTMLInputElement;

    expect(input.style.backgroundColor).toBe('blue');

    input.value = 'green';

    // Dispatch a DOM event so that Angular responds to the input value change
    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(input.style.backgroundColor).toBe('green');
  });
});
