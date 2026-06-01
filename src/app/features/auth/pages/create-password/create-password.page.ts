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

import { ActivatedRoute, Router } from '@angular/router';

import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';

import { ToastService } from '../../../../core/services/toast.service';

import { CustomValidators } from '../../../../shared/validators/custom.validators';

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
        password: ['', [Validators.required, Validators.minLength(6)]],

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
          const message = error?.error?.message ?? 'Failed to create password';

          await this.toastService.showErrorToast(message);
        },
      });
  }
}
