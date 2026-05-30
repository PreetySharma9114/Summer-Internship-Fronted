import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonButton, IonContent, IonSpinner, IonInputOtp } from '@ionic/angular/standalone';

import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs';

import { AuthService, VerifyOtpDto } from '../../../core/services/auth.service';

import { ToastService } from '../../../core/services/toast.service';

@Component({
  selector: 'app-verify-otp',

  standalone: true,

  templateUrl: './verify-otp.page.html',

  imports: [CommonModule, ReactiveFormsModule, IonContent, IonButton, IonSpinner, IonInputOtp],
})
export class VerifyOtpPage implements OnInit {
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private toastService = inject(ToastService);

  private route = inject(ActivatedRoute);

  private router = inject(Router);

  verifyOtpForm!: FormGroup;

  loading = false;

  resendLoading = false;

  userId = '';

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParams['id'];

    this.initializeForm();
  }

  private initializeForm(): void {
    this.verifyOtpForm = this.fb.group({
      otp: ['', [Validators.required, Validators.minLength(6), Validators.maxLength(6)]],
    });
  }

  verifyOtp(): void {
    if (this.verifyOtpForm.invalid) {
      this.verifyOtpForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload: VerifyOtpDto = {
      id: this.userId,

      otp: String(this.verifyOtpForm.value.otp),
    };

    this.authService
      .verifyOtp(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.showSuccessToast('OTP verified successfully').subscribe((toast) => {
            toast.present();
          });

          this.router.navigate(['/create-password'], {
            queryParams: {
              id: this.userId,
            },
          });
        },

        error: (error) => {
          const message = error?.error?.message ?? 'Invalid OTP';

          this.toastService.showErrorToast(message).subscribe((toast) => {
            toast.present();
          });
        },
      });
  }

  resendOtp(): void {
    this.resendLoading = true;

    this.authService
      .resendOtp(this.userId)
      .pipe(
        finalize(() => {
          this.resendLoading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.toastService.showSuccessToast('OTP resent successfully').subscribe((toast) => {
            toast.present();
          });
        },

        error: (error) => {
          const message = error?.error?.message ?? 'Failed to resend OTP';

          this.toastService.showErrorToast(message).subscribe((toast) => {
            toast.present();
          });
        },
      });
  }
}
