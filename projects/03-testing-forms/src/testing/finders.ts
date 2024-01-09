import { Type } from '@angular/core';
import { ComponentFixture } from '@angular/core/testing';
import { By } from '@angular/platform-browser';

export function queryElement<T>(
  fixture: ComponentFixture<T>,
  selector: string,
) {
  return fixture.debugElement.query(By.css(selector));
}

export function queryElementByTestId<T>(
  fixture: ComponentFixture<T>,
  testId: string,
) {
  return fixture.debugElement.query(By.css(`[data-testid="${testId}"]`));
}

export function queryAllElements<T>(
  fixture: ComponentFixture<T>,
  selector: string,
) {
  return fixture.debugElement.queryAll(By.css(selector));
}

export function queryAllElementsByDirective<T, K>(
  fixture: ComponentFixture<T>,
  directive: Type<K>,
) {
  return fixture.debugElement.queryAll(By.directive(directive));
}
