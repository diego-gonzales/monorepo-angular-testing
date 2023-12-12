export class ValueMockService {
  getValue() {
    return 'mock value';
  }

  setValue(value: string) {}

  getPromiseValue() {
    return Promise.resolve('mock value from promise');
  }
}
