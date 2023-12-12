import { TestBed } from '@angular/core/testing';

import { MasterService } from './master.service';
import { ValueService } from './value.service';
import { ValueMockService } from './value-mock.service';

fdescribe('MasterService', () => {
  it('should return "my value" from the real service', () => {
    // IMPORTANT 👀: Normally in unit tests, if we have dependencies, they will be mocked. For example: In this case 'ValueService' is a dependency of 'MasterService', so it will be mocked. We don't care if 'getValue' method from 'ValueService' works or not(for that, ValueService should have its own unit tests).
    const valueService = new ValueService();
    const masterService = new MasterService(valueService);

    const value = 'my value';
    expect(masterService.getTheValue()).toBe(value);
  });

  it('should return "mock value" from the mock service', () => {
    const valueMockService = new ValueMockService();
    const masterService = new MasterService(
      valueMockService as unknown as ValueService
    );

    const value = 'mock value';
    expect(masterService.getTheValue()).toBe(value);
  });

  it('should return "fake value from an object" from the fake object', () => {
    const fakeObject = {
      getValue: () => 'fake value from an object',
    };

    const masterService = new MasterService(fakeObject as ValueService);

    const value = 'fake value from an object';
    expect(masterService.getTheValue()).toBe(value);
  });

  it('should call "getValue" method from ValueService', () => {
    const valueServiceSpy = jasmine.createSpyObj('ValueService', ['getValue']);
    // valueServiceSpy.getValue.and.returnValue('fake value');

    const masterService = new MasterService(valueServiceSpy);

    // expect(masterService.getTheValue()).toBe('fake value');
    masterService.getTheValue();
    expect(valueServiceSpy.getValue).toHaveBeenCalled();
    expect(valueServiceSpy.getValue).toHaveBeenCalledTimes(1);
  });
});
