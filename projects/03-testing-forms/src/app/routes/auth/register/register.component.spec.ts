import { ComponentFixture, TestBed } from '@angular/core/testing';

import RegisterComponent from './register.component';
import { UsersService } from '@services/users.service';
import { NonNullableFormBuilder } from '@angular/forms';

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
