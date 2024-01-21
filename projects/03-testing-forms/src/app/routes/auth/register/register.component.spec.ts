import { ComponentFixture, TestBed } from '@angular/core/testing';

import RegisterComponent from './register.component';
import { UsersService } from '@services/users.service';
import { NonNullableFormBuilder } from '@angular/forms';
import {
  getTextContent,
  queryElement,
  queryElementByTestId,
} from '../../../../testing';

fdescribe('RegisterComponent', () => {
  let registerComponent: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsersService', ['create']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [{ provide: UsersService, useValue: spy }],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    registerComponent = fixture.componentInstance;
    usersServiceSpy = TestBed.inject(
      UsersService,
    ) as jasmine.SpyObj<UsersService>;

    fixture.detectChanges();
  });

  it('should create', () => {
    expect(registerComponent).toBeTruthy();
  });

  describe('Testing from logic', () => {
    it('email field should be invalid', () => {
      registerComponent.emailField?.setValue('');
      expect(registerComponent.emailField?.invalid)
        .withContext('empty email')
        .toBeTruthy();

      registerComponent.emailField?.setValue('test_email');
      expect(registerComponent.emailField?.invalid)
        .withContext('wrong email')
        .toBeTruthy();
    });

    it('password field should be invalid', () => {
      registerComponent.passwordField?.setValue('');
      expect(registerComponent.passwordField?.invalid)
        .withContext('empty password')
        .toBeTruthy();

      registerComponent.passwordField?.setValue('12345');
      expect(registerComponent.passwordField?.invalid)
        .withContext('short password')
        .toBeTruthy();

      registerComponent.passwordField?.setValue('asasasasasasa');
      expect(registerComponent.passwordField?.invalid)
        .withContext('no number')
        .toBeTruthy();

      registerComponent.passwordField?.setValue('Mypass123');
      expect(registerComponent.passwordField?.valid)
        .withContext('correct password')
        .toBeTruthy();
    });

    it('the form should be invalid', () => {
      registerComponent.form.patchValue({
        name: 'test',
        email: 'test@email.com',
        password: '123456',
        confirmPassword: '123456',
        checkTerms: false,
      });

      expect(registerComponent.form.valid).toBeFalsy();
    });
  });

  describe('Test from UI', () => {
    it('email field should invalid', () => {
      const inputDebug = queryElement(fixture, 'input#email');
      const input = inputDebug.nativeElement as HTMLInputElement;

      input.value = 'test_email';
      input.dispatchEvent(new Event('input'));
      input.dispatchEvent(new Event('blur')); // we need this event because the error message in only showed when th user clicks outside the input box.

      fixture.detectChanges();

      expect(registerComponent.emailField?.valid).toBeFalsy();

      const emailErrorTextContent = getTextContent(
        fixture,
        'email-invalid-error',
      );

      expect(emailErrorTextContent).toContain("It's not a email");
    });
  });
});
