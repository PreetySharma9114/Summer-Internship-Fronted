import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

import { RouterLink } from '@angular/router';

import {
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonSpinner,
} from '@ionic/angular/standalone';

import { finalize } from 'rxjs';

import { AuthService } from '../../../../core/services/auth.service';

import { LoginDto } from '../../dto/login.dto';
import { ToastService } from '../../../../core/services/toast.service';

@Component({
  selector: 'app-login',

  standalone: true,

  templateUrl: './login.page.html',

  imports: [
    CommonModule,
    ReactiveFormsModule,
    RouterLink,

    IonContent,
    IonItem,
    IonInput,
    IonButton,
    IonSpinner,
    IonInputPasswordToggle,
  ],
})
export class LoginPage implements OnInit {
  private fb = inject(FormBuilder);

  private authService = inject(AuthService);

  private toastService = inject(ToastService);

  loginForm!: FormGroup;

  loading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],

      password: ['', Validators.required],
    });
  }

  login(): void {
    if (this.loginForm.invalid) {
      this.loginForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload: LoginDto = this.loginForm.value;

    this.authService
      .login(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next:async () => {
          await this.toastService.showSuccessToast('Login successful');
        },

        error: async(error) => {
          console.log('LOGIN ERROR:', error);

          console.log('LOGIN ERROR BODY:', JSON.stringify(error.error, null, 2));

          const message = error?.error?.message ?? 'Login failed';
          await this.toastService.showErrorToast(message);
        },
      });
  }
}
