import { Component } from '@angular/core';
import { CommonModule } from '@angular/common';
import {
  NonNullableFormBuilder,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';
import { UsersService } from '@services/users.service';
import {
  matchPasswords,
  validPassword,
  validateEmailAsync,
} from '../../../utils/validators';

@Component({
  selector: 'app-register',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './register.component.html',
  styleUrl: './register.component.css',
})
export default class RegisterComponent {
  form = this._formBuilder.group(
    {
      name: ['', [Validators.required]],
      email: [
        '',
        [Validators.required, Validators.email],
        [validateEmailAsync(this._usersService)],
      ],
      password: [
        '',
        [Validators.required, Validators.minLength(6), validPassword],
      ],
      confirmPassword: ['', [Validators.required]],
      checkTerms: [false, [Validators.requiredTrue]],
    },
    {
      validators: matchPasswords,
    },
  );

  status: 'init' | 'loading' | 'success' | 'error' = 'init';

  constructor(
    private _formBuilder: NonNullableFormBuilder,
    private _usersService: UsersService,
  ) {}

  ngOnInit(): void {}

  register() {
    if (this.form.invalid) {
      this.form.markAllAsTouched();
      return;
    }

    this.status = 'loading';

    this._usersService.create(this.form.value).subscribe({
      next: (rta) => {
        this.status = 'success';
        console.log(rta);
      },
      error: (err) => {
        this.status = 'error';
        console.log(err);
      },
    });
  }

  get nameField() {
    return this.form.get('name');
  }

  get lastNameField() {
    return this.form.get('lastName');
  }

  get emailField() {
    return this.form.get('email');
  }

  get passwordField() {
    return this.form.get('password');
  }

  get confirmPasswordField() {
    return this.form.get('confirmPassword');
  }

  get checkTermsField() {
    return this.form.get('checkTerms');
  }

  get formControls() {
    return this.form.controls;
  }
}
