import { Component } from '@angular/core';
import { HighlightDirective } from './highlight.directive';
import { ComponentFixture, TestBed } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

// Create a host component to test our directive
@Component({
  template: `
    <p class="p-first">My first value</p>
    <p highlight>My second value</p>
    <p highlight="yellow">My third value</p>
  `,
})
class HostComponent {}

fdescribe('HighlightDirective', () => {
  let hostComponent: HostComponent;
  let fixture: ComponentFixture<HostComponent>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      declarations: [HostComponent],
      imports: [HighlightDirective],
    }).compileComponents();

    fixture = TestBed.createComponent(HostComponent);
    hostComponent = fixture.componentInstance;
    fixture.detectChanges();
  });

  // it('should create an instance', () => {
  //   const directive = new HighlightDirective();
  //   expect(directive).toBeTruthy();
  // });

  it('should create the hostComponent', () => {
    expect(hostComponent).toBeTruthy();
  });

  it('should exist 2 elements with the HighlightDirective', () => {
    const elementsWithDirective = fixture.debugElement.queryAll(
      By.directive(HighlightDirective),
    );

    expect(elementsWithDirective.length).toBe(2);
  });

  it('should exist 1 element without the HighlightDirective', () => {
    const elementsWithoutDirective = fixture.debugElement.queryAll(
      By.css('*:not([highlight])'),
    );

    expect(elementsWithoutDirective.length).toBe(1);
  });

  it('the elements should match "bgColor"', () => {
    const elementsWithDirective = fixture.debugElement.queryAll(
      By.directive(HighlightDirective),
    );
    const firstElement = elementsWithDirective[0].nativeElement as HTMLElement;
    const secondElement = elementsWithDirective[1].nativeElement as HTMLElement;

    expect(firstElement.style.backgroundColor).toBe('gray');
    expect(secondElement.style.backgroundColor).toBe('yellow');
  });

  it('the "p.first" element should have the default color', () => {
    const paragraphDebug = fixture.debugElement.query(By.css('p.p-first'));
    const highlightDirective = paragraphDebug.injector.get(HighlightDirective);

    const paragraph = paragraphDebug.nativeElement as HTMLElement;
    const defaultColor = highlightDirective.defaultColor;

    expect(paragraph.style.backgroundColor).toBe(defaultColor);
  });
});
