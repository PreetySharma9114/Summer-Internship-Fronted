import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { IonButton, IonContent, IonSpinner, IonInputOtp } from '@ionic/angular/standalone';

import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs';
import { getValidationMessage } from '../../../../shared/helpers/validation-message.helper';
import { AuthValidators } from '../../../../shared/validators/auth.validators';
import { AuthService } from '../../../../core/services/auth.service';
import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';
import { VerifyOtpDto } from '../../dto/verify-otp.dto';
import { ToastService } from '../../../../core/services/toast.service';
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

  protected readonly getValidationMessage = getValidationMessage;
  verifyOtpForm!: FormGroup;

  loading = false;

  resendLoading = false;

  userId = '';

  ngOnInit(): void {
    this.initializeForm();

    const queryId = this.route.snapshot.queryParams['id'];

    const storedId = this.authService.getRegistrationId();
    console.log('QUERY ID:', queryId);
    console.log('STORED ID:', storedId);
    this.userId = queryId || storedId || '';
    console.log('USER ID:', this.userId);
    if (!this.userId) {
      this.router.navigate(['/register']);

      return;
    }
  }

  private initializeForm(): void {
    this.verifyOtpForm = this.fb.group({
      otp: ['', AuthValidators.otp],
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
        next: async () => {
          const storedId = this.authService.getRegistrationId();

          await this.toastService.showSuccessToast('OTP verified successfully');

          this.router.navigate(['/create-password'], {
            queryParams: {
              id: this.userId,
            },
          });
        },

        error: async (error) => {
          await this.toastService.showErrorToast(getErrorMessage(error, 'Invalid OTP'));
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
        next: async () => {
          await this.toastService.showSuccessToast('OTP resent successfully');
        },

        error: async (error) => {
          await this.toastService.showErrorToast(getErrorMessage(error, 'Failed to resend OTP'));
        },
      });
  }
}
