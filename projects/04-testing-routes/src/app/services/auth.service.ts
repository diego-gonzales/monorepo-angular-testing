import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { TokenService } from './token.service';
import { Auth } from '@models/auth.interface';
import { switchMap, tap } from 'rxjs/operators';
import { User } from '@models/user.interface';
import { Observable } from 'rxjs';

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private _apiUrl = environment.API_URL;

  constructor(
    private _httpClient: HttpClient,
    private _tokenService: TokenService,
  ) {}

  getUser() {
    return this._getProfile();
  }

  login(email: string, password: string) {
    return this._httpClient
      .post<Auth>(`${this._apiUrl}/auth/login`, { email, password })
      .pipe(
        tap((response) => this._tokenService.saveToken(response.access_token)),
      );
  }

  loginAndGetProfile(email: string, password: string) {
    return this.login(email, password).pipe(
      switchMap(() => this._getProfile()),
    );
  }

  private _getProfile(): Observable<User | null> {
    return this._httpClient.get<User>(`${this._apiUrl}/auth/profile`);
  }
}
