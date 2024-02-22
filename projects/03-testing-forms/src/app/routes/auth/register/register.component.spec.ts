import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import RegisterComponent from './register.component';
import { UsersService } from '@services/users.service';
import {
  getTextContent,
  queryElement,
  fillInput,
  observableMock,
  asyncData,
  checkInput,
  triggerClickElement,
  asyncError,
} from '../../../../testing';
import { generateOneUser } from '@mocks/user.mock';

fdescribe('RegisterComponent', () => {
  let registerComponent: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;

  beforeEach(async () => {
    const spy = jasmine.createSpyObj('UsersService', [
      'create',
      'isAvailableByEmail',
    ]);

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

  beforeEach(() => {
    // We need this because internally the control 'email' is using the method 'isAvailableByEmail' from the service, in the custom async validator (validateEmailAsync)
    usersServiceSpy.isAvailableByEmail.and.returnValue(
      observableMock({ isAvailable: true }),
    );
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

    it('email should already be taken', () => {
      // this code should be here because we need to change the return value of the spy before the user types the email
      usersServiceSpy.isAvailableByEmail.and.returnValue(
        observableMock({ isAvailable: false }),
      );

      fillInput(fixture, 'input#email', 'taken@email.com');

      fixture.detectChanges();

      const emailErrorTextContent = getTextContent(
        fixture,
        'email-taken-error',
      );

      expect(emailErrorTextContent).toContain('Email has already been taken');
      expect(usersServiceSpy.isAvailableByEmail).toHaveBeenCalledTimes(1);
    });

    it('password field should be invalid', () => {
      fillInput(fixture, 'input#password', '');

      fixture.detectChanges();

      const passwordErrorTextContent = getTextContent(
        fixture,
        'pass-required-error',
      );

      expect(passwordErrorTextContent).toContain('Required');
    });

    it('checkTerms field should be valid', () => {
      const inputDebug = queryElement(fixture, 'input#terms');
      const input = inputDebug.nativeElement as HTMLInputElement;

      input.checked = true;
      input.dispatchEvent(new Event('change'));

      fixture.detectChanges();

      expect(registerComponent.checkTermsField?.valid).toBeTruthy();
    });
  });

  describe('Test submit entire form from Logic', () => {
    it('the form submit should call the service', () => {
      registerComponent.form.patchValue({
        name: 'test',
        email: 'test@email.com',
        password: '123456',
        confirmPassword: '123456',
        checkTerms: true,
      });

      const mockUser = generateOneUser();

      usersServiceSpy.create.and.returnValue(observableMock(mockUser));

      registerComponent.register();

      expect(usersServiceSpy.create).toHaveBeenCalled();
      expect(usersServiceSpy.create).toHaveBeenCalledTimes(1);
    });

    it('should change the "status" variable from "loading" to "success"', fakeAsync(() => {
      registerComponent.form.patchValue({
        name: 'test',
        email: 'test@email.com',
        password: '123456',
        confirmPassword: '123456',
        checkTerms: true,
      });

      const mockUser = generateOneUser();

      usersServiceSpy.create.and.returnValue(asyncData(mockUser));

      registerComponent.register();

      expect(registerComponent.status).toBe('loading');

      tick(); // this function finish all the async operations

      expect(registerComponent.status).toBe('success');
    }));
  });

  describe('Test submit entire form from UI', () => {
    it('the form submit should call the service and change the "status" variable from "loading" to "success"', fakeAsync(() => {
      const mockData = generateOneUser();

      fillInput(fixture, 'input#name', 'test');
      fillInput(fixture, 'input#email', 'test@email.com');
      fillInput(fixture, 'input#password', '123456');
      fillInput(fixture, 'input#confirmPassword', '123456');
      checkInput(fixture, 'input#terms', true);

      const debugForm = queryElement(fixture, 'form');

      usersServiceSpy.create.and.returnValue(asyncData(mockData));

      // 1st way
      // debugForm.triggerEventHandler('submit');

      // 2nd way
      // const form = debugForm.nativeElement as HTMLFormElement;
      // form.dispatchEvent(new Event('submit'));

      // 3rd way
      triggerClickElement(fixture, 'btn-submit', true);

      expect(registerComponent.status).toBe('loading');

      tick();

      expect(usersServiceSpy.create).toHaveBeenCalledTimes(1);
      expect(registerComponent.status).toBe('success');
    }));

    it('should change "status" variable from "loading" to "error"', fakeAsync(() => {
      fillInput(fixture, 'input#name', 'test');
      fillInput(fixture, 'input#email', 'test@email.com');
      fillInput(fixture, 'input#password', '123456');
      fillInput(fixture, 'input#confirmPassword', '123456');
      checkInput(fixture, 'input#terms', true);

      const debugForm = queryElement(fixture, 'form');

      usersServiceSpy.create.and.returnValue(asyncError('Errorcito'));

      triggerClickElement(fixture, 'btn-submit', true);

      expect(registerComponent.status).toBe('loading');

      tick();

      expect(usersServiceSpy.create).toHaveBeenCalledTimes(1);
      expect(registerComponent.status).toBe('error');
    }));
  });
});
