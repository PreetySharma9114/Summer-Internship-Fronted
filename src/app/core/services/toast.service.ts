import { inject, Injectable } from '@angular/core';

import { ToastController, ToastOptions } from '@ionic/angular';

import { APP_CONSTANTS } from '../constants/app.constants';

@Injectable({
  providedIn: 'root',
})
export class ToastService {
  private toastController = inject(ToastController);

  async showSuccessToast(message: string): Promise<void> {
    await this.showToast({
      message,
      color: 'success',
    });
  }

  async showErrorToast(message: string): Promise<void> {
    await this.showToast({
      message,
      color: 'danger',
    });
  }

  async showWarningToast(message: string): Promise<void> {
    await this.showToast({
      message,
      color: 'warning',
    });
  }

  private async showToast(options: ToastOptions): Promise<void> {
    const toast = await this.toastController.create({
      ...options,
      duration: APP_CONSTANTS.TOAST_DURATION,
      position: APP_CONSTANTS.TOAST_POSITION as 'top' | 'bottom' | 'middle',
    });

    await toast.present();
  }
}
