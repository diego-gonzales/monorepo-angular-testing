import { TestBed } from '@angular/core/testing';
import { CanActivateFn, Router } from '@angular/router';

import { authGuard } from './auth.guard';
import { AuthService } from '@services/auth.service';
import { generateOneUser } from '@mocks/user.mock';
import { observableMock } from '../../testing';
import {
  fakeActivatedRouteSnapshot,
  fakeRouterStateSnapshot,
} from '../../testing/guard-params-mocks';
import { Observable } from 'rxjs';

fdescribe('@authGuard', () => {
  const executeGuard: CanActivateFn = (...guardParameters) =>
    TestBed.runInInjectionContext(() => authGuard(...guardParameters));
  let authServiceSpy: jasmine.SpyObj<AuthService>;
  let routerSpy: jasmine.SpyObj<Router>;

  beforeEach(() => {
    const spyS = jasmine.createSpyObj('AuthService', ['getUser']);
    const spyR = jasmine.createSpyObj('Router', ['navigate']);

    TestBed.configureTestingModule({
      providers: [
        { provide: AuthService, useValue: spyS },
        { provide: Router, useValue: spyR },
      ],
    });
  });

  beforeEach(() => {
    authServiceSpy = TestBed.inject(AuthService) as jasmine.SpyObj<AuthService>;
    routerSpy = TestBed.inject(Router) as jasmine.SpyObj<Router>;
  });

  it('should be created', () => {
    expect(executeGuard).toBeTruthy();
  });

  it('should return true if user is logged in', (done) => {
    const mockUser = generateOneUser();
    const activatedRouteMock = fakeActivatedRouteSnapshot({});
    const routerStateMock = fakeRouterStateSnapshot({});

    authServiceSpy.getUser.and.returnValue(observableMock(mockUser));

    const guardResult = executeGuard(
      activatedRouteMock,
      routerStateMock,
    ) as Observable<boolean>;

    guardResult.subscribe((result) => {
      expect(result).toBeTrue();
      done();
    });
  });

  it('should return false if user is not logged in', (done) => {
    const activatedRouteMock = fakeActivatedRouteSnapshot({});
    const routerStateMock = fakeRouterStateSnapshot({});

    authServiceSpy.getUser.and.returnValue(observableMock(null));

    const guardResult = executeGuard(
      activatedRouteMock,
      routerStateMock,
    ) as Observable<boolean>;

    guardResult.subscribe((result) => {
      expect(result).toBeFalse();
      done();
    });
  });
});
