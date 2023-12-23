import { TestBed } from '@angular/core/testing';

import { AuthService } from './auth.service';
import {
  HttpClientTestingModule,
  HttpTestingController,
} from '@angular/common/http/testing';
import { TokenService } from './token.service';
import { Auth } from '@models/auth.interface';
import { environment } from '../../environments/environment';

fdescribe('AuthService', () => {
  let authService: AuthService;
  let httpTestingController: HttpTestingController;
  let tokenService: TokenService;

  beforeEach(() => {
    TestBed.configureTestingModule({
      imports: [HttpClientTestingModule],
      providers: [AuthService, TokenService],
    });

    authService = TestBed.inject(AuthService);
    httpTestingController = TestBed.inject(HttpTestingController);
    tokenService = TestBed.inject(TokenService);
  });

  afterEach(() => {
    httpTestingController.verify();
  });

  it('should be created', () => {
    expect(authService).toBeTruthy();
  });

  describe('test for "login" method', () => {
    it('should return access_token', (doneFn) => {
      const mockData: Auth = {
        access_token: '123456789',
      };
      const email = 'test@test.com';
      const password = '123456';

      authService.login(email, password).subscribe((resp) => {
        expect(resp).toEqual(mockData);
        doneFn();
      });

      const requestedUrl = `${environment.API_URL}/auth/login`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(mockData);
    });

    it('should call "saveToken" method of TokenService', (doneFn) => {
      const mockData: Auth = {
        access_token: '123456789',
      };
      const email = 'test@test.com';
      const password = '123456';
      spyOn(tokenService, 'saveToken').and.callThrough(); // con esto le indico que solo voy a espiar al método, mas no llamarlo.

      authService.login(email, password).subscribe(() => {
        expect(tokenService.saveToken).toHaveBeenCalledTimes(1);
        expect(tokenService.saveToken).toHaveBeenCalledWith(
          mockData.access_token,
        );
        doneFn();
      });

      const requestedUrl = `${environment.API_URL}/auth/login`;
      const req = httpTestingController.expectOne(requestedUrl);
      req.flush(mockData);
    });
  });
});
