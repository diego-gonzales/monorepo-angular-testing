import { FormControl, FormGroup } from '@angular/forms';
import { matchPasswords, validPassword } from './validators';

fdescribe('Test Validators', () => {
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
});
