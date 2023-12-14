import { Injectable, inject } from '@angular/core';
import { ValueService } from './value.service';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  constructor(private _valueService: ValueService) {}

  getTheValue() {
    return this._valueService.getValue();
  }
}
