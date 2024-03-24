import { ComponentFixture } from '@angular/core/testing';
import { queryElementByTestId } from './finders';

export function getTextContent<T>(
  fixture: ComponentFixture<T>,
  testId: string,
) {
  const debugElement = queryElementByTestId(fixture, testId);
  const element = debugElement.nativeElement as HTMLElement;

  return element.textContent;
}
