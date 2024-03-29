import { ComponentFixture } from '@angular/core/testing';
import { queryElement, queryElementByTestId } from './finders';

// trigger event (click) on an element
export function triggerClickEvent<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  isTestId: boolean = false,
  event: unknown = null,
) {
  let debugElement;

  if (isTestId) {
    debugElement = queryElementByTestId(fixture, selector);
  } else {
    debugElement = queryElement(fixture, selector);
  }

  debugElement.triggerEventHandler('click', event);
}

// trigger click on an element
export function triggerClickElement<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  isTestId: boolean = false,
) {
  let debugElement;

  if (isTestId) {
    debugElement = queryElementByTestId(fixture, selector);
  } else {
    debugElement = queryElement(fixture, selector);
  }

  const element = debugElement.nativeElement as HTMLElement;
  element.click();
}
