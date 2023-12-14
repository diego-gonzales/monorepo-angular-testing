import {
  HttpClient,
  HttpErrorResponse,
  HttpParams,
  HttpStatusCode,
} from '@angular/common/http';
import { Injectable } from '@angular/core';
import {
  CreateProductDTO,
  Product,
  UpdateProductDTO,
} from '@models/products.interface';
import { catchError, map, retry, zipWith } from 'rxjs/operators';
import { throwError } from 'rxjs';
import { environment } from '../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ProductsService {
  private _apiUrl = `${environment.API_URL}`;

  constructor(private http: HttpClient) {}

  getByCategory(categoryId: string, limit?: number, offset?: number) {
    let params = new HttpParams();

    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }

    return this.http.get<Product[]>(
      `${this._apiUrl}/categories/${categoryId}/products`,
    );
  }

  getAllSimple() {
    return this.http.get<Product[]>(`${this._apiUrl}/products`);
  }

  getAll(limit?: number, offset?: number) {
    let params = new HttpParams();

    if (limit && offset != null) {
      params = params.set('limit', limit);
      params = params.set('offset', offset);
    }
    return this.http
      .get<Product[]>(`${this._apiUrl}/products`, { params })
      .pipe(
        retry(3),
        map((products) =>
          products.map((item) => {
            return {
              ...item,
              taxes: item.price > 0 ? 0.19 * item.price : 0,
            };
          }),
        ),
      );
  }

  fetchReadAndUpdate(id: string, dto: UpdateProductDTO) {
    return zipWith(this.getOne(id), this.update(id, dto));
  }

  getOne(id: string) {
    return this.http.get<Product>(`${this._apiUrl}/products/${id}`).pipe(
      catchError((error: HttpErrorResponse) => {
        if (error.status === HttpStatusCode.Conflict) {
          return throwError('Algo esta fallando en el server');
        }
        if (error.status === HttpStatusCode.NotFound) {
          return throwError('El producto no existe');
        }
        if (error.status === HttpStatusCode.Unauthorized) {
          return throwError('No estas permitido');
        }
        return throwError('Ups algo salio mal');
      }),
    );
  }

  create(dto: CreateProductDTO) {
    return this.http.post<Product>(`${this._apiUrl}/products`, dto);
  }

  update(id: string, dto: UpdateProductDTO) {
    return this.http.put<Product>(`${this._apiUrl}/products/${id}`, dto);
  }

  delete(id: string) {
    return this.http.delete<boolean>(`${this._apiUrl}/products/${id}`);
  }
}
