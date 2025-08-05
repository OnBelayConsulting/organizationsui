import { Injectable, signal } from '@angular/core';
import {ServerErrorResponse} from '../model/error-response.model';

@Injectable({
  providedIn: 'root'
})
export class ErrorService {
  private _error = signal<ServerErrorResponse | undefined>(undefined);

  error = this._error.asReadonly();

  showError(title: string, code: string, message?: string) {
    console.log(code  + "::" + message);
    this._error.set({
      title: title,
      errorCode: code,
      errorMessage: message
    });
  }

  clearError() {
    this._error.set(undefined);
  }
}
