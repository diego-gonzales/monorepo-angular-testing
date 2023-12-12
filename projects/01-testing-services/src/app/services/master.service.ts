import { Injectable, inject } from '@angular/core';
import { ValueService } from './value.service';

@Injectable({
  providedIn: 'root',
})
export class MasterService {
  // private _valueService = inject(ValueService);

  constructor(private _valueService: ValueService) {}

  getTheValue() {
    return this._valueService.getValue();
  }
}
