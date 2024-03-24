import { AbstractControl, ValidatorFn } from '@angular/forms';
import { UsersService } from '@services/users.service';
import { map } from 'rxjs/operators';

export const isPriceValid: ValidatorFn = (control: AbstractControl) => {
  const controlValue = control.value;

  return controlValue > 10000 ? { is_invalid: true } : null;
};

export const validPassword: ValidatorFn = (control: AbstractControl) => {
  const controlValue = control.value;

  return !containsNumber(controlValue) ? { invalid_password: true } : null;
};

export const matchPasswords: ValidatorFn = (form: AbstractControl) => {
  const password = form.get('password')?.value;
  const confirmPassword = form.get('confirmPassword')?.value;

  if (password == null || confirmPassword == null) {
    throw new Error('Password or confirmPassword is not defined');
  }

  return password !== confirmPassword ? { match_password: true } : null;
};

export const validateEmailAsync =
  (userService: UsersService) => (control: AbstractControl) => {
    const email = control.value;

    return userService.isAvailableByEmail(email).pipe(
      map(({ isAvailable }) => {
        return isAvailable ? null : { email_taken: true };
      }),
    );
  };

function containsNumber(value: string) {
  return value.split('').some((character) => isNumber(character));
}

function isNumber(value: string) {
  return !isNaN(parseInt(value, 10));
}
