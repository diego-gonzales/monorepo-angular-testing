import { TestBed } from '@angular/core/testing';
import { ValueService } from './value.service';

describe('ValueService', () => {
  let service: ValueService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [ValueService],
    });

    service = TestBed.inject(ValueService);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('Tests fot getValue method', () => {
    it('should return "my value"', () => {
      const value = 'my value';
      expect(service.getValue()).toBe(value);
    });
  });

  describe('Tests for setValue method', () => {
    it('should change the value to "new value"', () => {
      const newValue = 'new value';
      service.setValue(newValue);
      expect(service.getValue()).toBe(newValue);
    });
  });

  describe('Tests for getPromiseValue method using "then"', () => {
    it('should return "value from promise"', (doneFn) => {
      const value = 'value from promise';
      service.getPromiseValue().then((resp) => {
        expect(resp).toBe(value);
        doneFn();
      });
    });
  });

  describe('Tests for getPromiseValue method using async-await', () => {
    it('should return "value from promise"', async () => {
      const value = 'value from promise';
      expect(await service.getPromiseValue()).toBe(value);
    });
  });

  describe('Tests for getObservableValue method', () => {
    it('should return "value from observable"', () => {
      const value = 'value from observable';
      service.getObservableValue().subscribe((resp) => {
        expect(resp).toBe(value);
      });
    });
  });
});
