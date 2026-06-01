import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { Router } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonItem,
  IonInput,
  IonSelect,
  IonSelectOption,
  IonSpinner,
} from '@ionic/angular/standalone';

import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';

import { RegisterDto } from '../../dto/register.dto';
import { ToastService } from '../../../../core/services/toast.service';

import { UserRole } from '../../enums/user-role.enum';

@Component({
  selector: 'app-register',

  standalone: true,

  templateUrl: './register.page.html',

  imports: [
    CommonModule,
    ReactiveFormsModule,

    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonSpinner,
  ],
})
export class RegisterPage implements OnInit {
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private toastService = inject(ToastService);

  private router = inject(Router);

  registerForm!: FormGroup;

  loading = false;

  readonly userRoles = Object.values(UserRole);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      role: ['', Validators.required],
    });
  }

  register(): void {
    if (this.registerForm.invalid) {
      this.registerForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload: RegisterDto = this.registerForm.value;
    console.log('REGISTER PAYLOAD', payload);
    this.authService
      .register(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: async (response) => {
          await this.toastService.showSuccessToast('OTP sent successfully');

          this.router.navigate(['/verify-otp'], {
            queryParams: {
              id: response.id,
            },
          });
        },

        error: async (error) => {
          const message = error?.error?.message ?? 'Registration failed';

          await this.toastService.showErrorToast(message);
        },
      });
  }
}
