import { defer, of } from 'rxjs';

export function asyncData<T>(data: T) {
  return defer(() => Promise.resolve(data));
}

export function asyncError(error: unknown) {
  return defer(() => Promise.reject(error));
}

export function observableMock<T>(data: T) {
  return of(data);
}

export function promiseMock<T>(data: T) {
  return Promise.resolve(data);
}
