import { ComponentFixture } from '@angular/core/testing';
import { queryElement, queryElementByTestId } from './finders';

export function fillInput<T>(
  fixture: ComponentFixture<T>,
  selector: string,
  inputValue: string = '',
  isTestId: boolean = false,
) {
  let inputDebugElement;

  if (isTestId) {
    inputDebugElement = queryElementByTestId(fixture, selector);
  } else {
    inputDebugElement = queryElement(fixture, selector);
  }

  const inputElement = inputDebugElement.nativeElement as HTMLInputElement;

  inputElement.value = inputValue;

  inputElement.dispatchEvent(new Event('input'));
  inputElement.dispatchEvent(new Event('blur'));
}
