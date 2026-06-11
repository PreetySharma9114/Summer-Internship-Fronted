import { Component, OnInit, inject } from '@angular/core';
import { Router, RouterLink } from '@angular/router';
import { CommonModule } from '@angular/common';
import { AuthValidators } from '../../../../shared/validators/auth.validators';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { getValidationMessage } from '../../../../shared/helpers/validation-message.helper';
import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';
import {
  IonButton,
  IonContent,
  IonInput,
  IonInputPasswordToggle,
  IonItem,
  IonSpinner,
} from '@ionic/angular/standalone';
import { UserRole } from '../../enums/user-role.enum';
import { finalize } from 'rxjs';
import { ProfileStatus } from 'src/app/features/profile/enums/profile-status.enum';
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
  private router = inject(Router);
  private toastService = inject(ToastService);
  protected readonly getValidationMessage = getValidationMessage;
  loginForm!: FormGroup;

  loading = false;

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.loginForm = this.fb.group({
      email: ['', AuthValidators.email],
      password: ['', AuthValidators.password],
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
        next: async () => {
          await this.toastService.showSuccessToast('Login successful');

          const user = this.authService.getCurrentUser();
          if (!user) {
            return;
          }

          if (user.profileStatus === ProfileStatus.COMPLETE) {
            this.router.navigate(['/home']);
            return;
          }

          switch (user.role) {
            case UserRole.INFLUENCER:
              this.router.navigate(['/influencer-profile']);
              break;

            case UserRole.BRAND:
              this.router.navigate(['/brand-profile']);
              break;
          }
        },

        error: async (error) => {
          await this.toastService.showErrorToast(getErrorMessage(error, 'Login failed'));
        },
      });
  }
}
