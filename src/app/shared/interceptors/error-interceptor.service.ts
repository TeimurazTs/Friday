import { Injectable } from '@angular/core';
import {
  HttpEvent,
  HttpInterceptor,
  HttpHandler,
  HttpRequest,
} from '@angular/common/http';
import { EMPTY, Observable, catchError, throwError } from 'rxjs';
import { ToastService } from '../services/toast.service';

@Injectable({
  providedIn: 'root',
})
export class ErrorInterceptorService implements HttpInterceptor {
  constructor(private toast: ToastService) {}

  intercept(
    req: HttpRequest<any>,
    next: HttpHandler
  ): Observable<HttpEvent<any>> {
    return next.handle(req).pipe(
      catchError((err) => {
        if (err.status === 500) {
          this.toast.showError('Server had an error');
          return EMPTY;
        }
        return throwError(() => err);
      })
    );
  }
}
