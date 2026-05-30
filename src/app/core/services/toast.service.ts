import { inject, Injectable } from '@angular/core';

import { ToastController, ToastOptions } from '@ionic/angular';

import { from, Observable } from 'rxjs';

import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastController = inject(ToastController);

  showSuccessToast(message: string): Observable<HTMLIonToastElement> {
    return this.showToast({
      message,

      color: 'success',
    });
  }

  showErrorToast(message: string): Observable<HTMLIonToastElement> {
    return this.showToast({
      message,

      color: 'danger',
    });
  }

  showWarningToast(message: string): Observable<HTMLIonToastElement> {
    return this.showToast({
      message,

      color: 'warning',
    });
  }

  showInfoToast(message: string): Observable<HTMLIonToastElement> {
    return this.showToast({
      message,

      color: 'primary',
    });
  }

  private showToast(options: ToastOptions): Observable<HTMLIonToastElement> {
    return from(
      this.toastController.create({
        ...options,

        duration: APP_CONSTANTS.TOAST_DURATION,

        position: APP_CONSTANTS.TOAST_POSITION as 'top' | 'bottom' | 'middle',
      }),
    );
  }
}
