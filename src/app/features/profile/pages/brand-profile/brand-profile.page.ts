import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { getValidationMessage } from '../../../../shared/helpers/validation-message.helper';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { validateImageFile } from '../../../../shared/helpers/file-validation.helper';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonSelect,
  IonSelectOption,
  IonTextarea,
  IonSpinner,
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';

import { finalize } from 'rxjs';

import { ToastService } from '../../../../core/services/toast.service';

import { ProfileService } from '../../../../core/services/profile.service';

import { BrandIndustry } from '../../enums/brand-industry.enum';
import { BrandProfile } from '../../interfaces/brand-profile.interface';
import { generatePreview } from '../../../../shared/helpers/file-upload.helper';
import { ProfileValidators } from '../../../../shared/validators/profile.validators';
import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';

@Component({
  selector: 'app-brand-profile',

  standalone: true,

  templateUrl: './brand-profile.page.html',

  imports: [
    CommonModule,
    ReactiveFormsModule,

    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonSelect,
    IonSelectOption,
    IonSpinner,
  ],
})
export class BrandProfilePage implements OnInit {
  private fb = inject(FormBuilder);

  private profileService = inject(ProfileService);

  private toastService = inject(ToastService);

  private router = inject(Router);
  protected readonly getValidationMessage = getValidationMessage;
  brandProfileForm!: FormGroup;

  loading = false;

  selectedLogo: File | null = null;

  logoPreview: string | null = null;

  readonly industries = Object.values(BrandIndustry);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.brandProfileForm = this.fb.group({
      brandName: ['', ProfileValidators.brandName],

      website: ['', ProfileValidators.website],

      description: ['', ProfileValidators.description],

      industry: ['', Validators.required],

      instagramUsername: ['', ProfileValidators.instagramUsername],
    });
  }

  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (!input.files?.length) {
      return;
    }

    const file = input.files[0];

    const error = validateImageFile(file);

    if (error) {
      void this.toastService.showErrorToast(error);

      input.value = '';

      return;
    }

    this.selectedLogo = file;

    generatePreview(file, (preview: string) => {
      this.logoPreview = preview;
    });
  }

  submitProfile(): void {
    if (this.brandProfileForm.invalid) {
      this.brandProfileForm.markAllAsTouched();

      return;
    }

    this.loading = true;
    const profile: BrandProfile = this.brandProfileForm.getRawValue();

    this.profileService
      .createBrandProfile(profile, this.selectedLogo ?? undefined)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: async () => {
          await this.toastService.showSuccessToast('Profile completed successfully');

          this.router.navigate(['/home']);
        },

        error: async (error) => {
          await this.toastService.showErrorToast(
            getErrorMessage(error, 'Failed to complete profile'),
          );
        },
      });
  }
}
