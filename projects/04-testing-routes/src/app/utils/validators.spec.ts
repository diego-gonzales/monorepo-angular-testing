import { FormControl, FormGroup } from '@angular/forms';
import {
  matchPasswords,
  validPassword,
  validateEmailAsync,
} from './validators';
import { UsersService } from '@services/users.service';
import { observableMock } from '../../testing';

describe('Test Validators', () => {
  describe('Test for "validPassword"', () => {
    it('the password value should be valid', () => {
      const control = new FormControl('123456');

      const result = validPassword(control);

      expect(result).toBeNull();
    });

    it('the password should be invalid', () => {
      const control = new FormControl('abcdef');

      const result = validPassword(control);

      expect(result).not.toBeNull();
    });
  });

  describe('Test for "matchPasswordd"', () => {
    it('should match passwords', () => {
      const formGroup = new FormGroup({
        password: new FormControl('123456'),
        confirmPassword: new FormControl('123456'),
      });

      const result = matchPasswords(formGroup);

      expect(result).toBeNull();
    });

    it('should not match passwords', () => {
      const formGroup = new FormGroup({
        password: new FormControl('123456'),
        confirmPassword: new FormControl('abcdef'),
      });

      const result = matchPasswords(formGroup);

      expect(result).not.toBeNull();
    });

    it('should throw an error when fields are not defined', () => {
      const errorMsg = 'Password or confirmPassword is not defined';

      const formGroup = new FormGroup({
        field_1: new FormControl('123456'),
        field_2: new FormControl(''),
      });

      const fn = () => matchPasswords(formGroup);

      expect(fn).toThrowError(errorMsg);
    });
  });

  describe('Test for "validateEmailAsync"', () => {
    it('the email should be available', (doneFn: DoneFn) => {
      const usersService: jasmine.SpyObj<UsersService> = jasmine.createSpyObj(
        'UsersService',
        ['isAvailableByEmail'],
      );

      const control = new FormControl('abcd@email.com');

      usersService.isAvailableByEmail.and.returnValue(
        observableMock({ isAvailable: true }),
      );

      const result = validateEmailAsync(usersService)(control);

      result.subscribe((value) => {
        expect(value).toBeNull();
        doneFn();
      });
    });

    it('the email should not be available', (doneFn: DoneFn) => {
      const usersService: jasmine.SpyObj<UsersService> = jasmine.createSpyObj(
        'UsersService',
        ['isAvailableByEmail'],
      );

      const control = new FormControl('repetead@email.com');

      usersService.isAvailableByEmail.and.returnValue(
        observableMock({ isAvailable: false }),
      );

      const result = validateEmailAsync(usersService)(control);

      result.subscribe((value) => {
        expect(value).not.toBeNull();
        doneFn();
      });
    });
  });
});
