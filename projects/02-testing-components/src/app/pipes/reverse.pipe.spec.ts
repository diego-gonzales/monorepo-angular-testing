import { Component } from '@angular/core';
import { ReversePipe } from './reverse.pipe';
import { FormControl, ReactiveFormsModule } from '@angular/forms';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Testing without environment (only with his instance)
describe('ReversePipe', () => {
  it('create an instance', () => {
    const pipe = new ReversePipe();
    expect(pipe).toBeTruthy();
  });

  it('should transform "perro" to "orrep"', () => {
    const reversePipe = new ReversePipe();
    expect(reversePipe.transform('perro')).toBe('orrep');
  });
});

// Testing with environment (Test Component)
@Component({
  template: `
    <input type="text" [formControl]="inputTextControl" />
    <p>{{ inputTextControl.value | reverse }}</p>
  `,
})
class TestComponent {
  inputTextControl = new FormControl('pruebita', { nonNullable: true });
}

describe('ReversePipe with environment', () => {
  let testComponent: TestComponent;
  let fixture: ComponentFixture<TestComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [TestComponent],
      imports: [ReactiveFormsModule, ReversePipe],
    }).compileComponents();

    fixture = TestBed.createComponent(TestComponent);
    testComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create TestComponent', () => {
    expect(testComponent).toBeTruthy();
  });

  it('should works with input value', () => {
    const paragraphDebug = fixture.debugElement.query(By.css('p'));
    const paragraph = paragraphDebug.nativeElement as HTMLParagraphElement;

    expect(paragraph.textContent).toBe('atibeurp');

    const inputDebug = fixture.debugElement.query(By.css('input'));
    const input = inputDebug.nativeElement as HTMLInputElement;

    input.value = 'hello, world';

    input.dispatchEvent(new Event('input'));
    fixture.detectChanges();

    expect(paragraph.textContent).toBe('dlrow ,olleh');
  });
});
