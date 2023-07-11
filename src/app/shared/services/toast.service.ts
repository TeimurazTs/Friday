import { Injectable } from '@angular/core';
import { NgToastService } from 'ng-angular-popup';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  constructor(private toast: NgToastService) {}

  showSuccess(information: string) {
    this.toast.success({
      detail: 'SUCCESS',
      summary: information,
      duration: 5000,
    });
  }

  showError(information: string) {
    this.toast.error({
      detail: 'ERROR',
      summary: information,
      duration: 5000,
    });
  }
}
