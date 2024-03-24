import {
  ComponentFixture,
  TestBed,
  fakeAsync,
  tick,
} from '@angular/core/testing';

import RegisterComponent from './register.component';
import { UsersService } from '@services/users.service';
import {
  queryElement,
  fillInput,
  observableMock,
  asyncData,
  checkInput,
  triggerClickElement,
  asyncError,
} from '../../../../testing';
import { generateOneUser } from '@mocks/user.mock';
import { Router } from '@angular/router';

describe('@RegisterComponent', () => {
  let registerComponent: RegisterComponent;
  let fixture: ComponentFixture<RegisterComponent>;
  let usersServiceSpy: jasmine.SpyObj<UsersService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(async () => {
    const spyS = jasmine.createSpyObj('UsersService', [
      'create',
      'isAvailableByEmail',
    ]);

    const spyR = jasmine.createSpyObj('Router', ['navigateByUrl']);

    await TestBed.configureTestingModule({
      imports: [RegisterComponent],
      providers: [
        { provide: UsersService, useValue: spyS },
        { provide: Router, useValue: spyR },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(RegisterComponent);
    registerComponent = fixture.componentInstance;
    usersServiceSpy = TestBed.inject(
      UsersService,
    ) as jasmine.SpyObj<UsersService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;

    fixture.detectChanges();
  });

  beforeEach(() => {
    // We need this because internally the control 'email' is using the method 'isAvailableByEmail' from the service, in the custom async validator (validateEmailAsync)
    usersServiceSpy.isAvailableByEmail.and.returnValue(
      observableMock({ isAvailable: true }),
    );
  });

  it('#should create', () => {
    expect(registerComponent).toBeTruthy();
  });

  describe('When submit register form', () => {
    it('#should call navigateByUrl', fakeAsync(() => {
      const mockData = generateOneUser();

      fillInput(fixture, 'input#name', 'test');
      fillInput(fixture, 'input#email', 'test@email.com');
      fillInput(fixture, 'input#password', '123456');
      fillInput(fixture, 'input#confirmPassword', '123456');
      checkInput(fixture, 'input#terms', true);

      const debugForm = queryElement(fixture, 'form');

      usersServiceSpy.create.and.returnValue(asyncData(mockData));

      triggerClickElement(fixture, 'btn-submit', true);

      tick();

      expect(routerSpy.navigateByUrl).toHaveBeenCalledWith('/auth/login');
    }));

    // it('should change "status" variable from "loading" to "error"', fakeAsync(() => {
    //   fillInput(fixture, 'input#name', 'test');
    //   fillInput(fixture, 'input#email', 'test@email.com');
    //   fillInput(fixture, 'input#password', '123456');
    //   fillInput(fixture, 'input#confirmPassword', '123456');
    //   checkInput(fixture, 'input#terms', true);

    //   const debugForm = queryElement(fixture, 'form');

    //   usersServiceSpy.create.and.returnValue(asyncError('Errorcito'));

    //   triggerClickElement(fixture, 'btn-submit', true);

    //   expect(registerComponent.status).toBe('loading');

    //   tick();

    //   expect(usersServiceSpy.create).toHaveBeenCalledTimes(1);
    //   expect(registerComponent.status).toBe('error');
    // }));
  });
});
