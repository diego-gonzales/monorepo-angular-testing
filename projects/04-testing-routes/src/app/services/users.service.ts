import { Injectable } from '@angular/core';
import { environment } from '../../environments/environment';
import { HttpClient } from '@angular/common/http';
import { CreateUserDTO, User } from '@models/user.interface';

@Injectable({
  providedIn: 'root',
})
export class UsersService {
  private apiUrl = `${environment.API_URL}`;

  constructor(private _httpClient: HttpClient) {}

  create(dto: any) {
    const dtoModified = {
      ...dto,
      avatar: 'https://test.test',
    };

    return this._httpClient.post<User>(`${this.apiUrl}/users`, dtoModified);
  }

  getAll() {
    return this._httpClient.get<User[]>(`${this.apiUrl}/users`);
  }

  isAvailableByEmail(email: string) {
    return this._httpClient.post<{ isAvailable: boolean }>(
      `${this.apiUrl}/users/is-available`,
      { email },
    );
  }
}
