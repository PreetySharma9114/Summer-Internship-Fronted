import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonSpinner,
  IonInputPasswordToggle,
} from '@ionic/angular/standalone';
import { AuthValidators } from '../../../../shared/validators/auth.validators';
import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';

import { ToastService } from '../../../../core/services/toast.service';
import { getValidationMessage } from '../../../../shared/helpers/validation-message.helper';

import { CustomValidators } from '../../../../shared/validators/custom.validators';
import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';
import { VALIDATION } from '../../../../core/constants/validation.constants';
@Component({
  selector: 'app-create-password',

  standalone: true,

  templateUrl: './create-password.page.html',

  imports: [
    CommonModule,
    ReactiveFormsModule,

    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
    IonInputPasswordToggle,
  ],
})
export class CreatePasswordPage implements OnInit {
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private toastService = inject(ToastService);

  private router = inject(Router);
  protected readonly getValidationMessage = getValidationMessage;

  private route = inject(ActivatedRoute);

  createPasswordForm!: FormGroup;

  loading = false;

  userId = '';

  ngOnInit(): void {
    this.userId = this.route.snapshot.queryParams['id'];

    this.initializeForm();
  }

  private initializeForm(): void {
    this.createPasswordForm = this.fb.group(
      {
        password: ['', AuthValidators.password],
        confirmPassword: ['', Validators.required],
      },

      {
        validators: CustomValidators.passwordMatchValidator('password', 'confirmPassword'),
      },
    );
  }

  createPassword(): void {
    if (this.createPasswordForm.invalid) {
      this.createPasswordForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload = {
      id: this.userId,

      password: this.createPasswordForm.value.password,

      confirmPassword: this.createPasswordForm.value.confirmPassword,
    };

    this.authService
      .createPassword(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: async () => {
          await this.toastService.showSuccessToast('Password created successfully');
          this.router.navigate(['/login']);
        },

        error: async (error) => {
          await this.toastService.showErrorToast(
            getErrorMessage(error, 'Failed to create password'),
          );
        },
      });
  }
}
