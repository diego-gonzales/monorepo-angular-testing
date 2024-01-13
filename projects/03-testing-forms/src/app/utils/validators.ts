import { AbstractControl, ValidatorFn } from '@angular/forms';

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

  return password !== confirmPassword ? { match_password: true } : null;
};

function containsNumber(value: string) {
  return value.split('').some((character) => isNumber(character));
}

function isNumber(value: string) {
  return !isNaN(parseInt(value, 10));
}
