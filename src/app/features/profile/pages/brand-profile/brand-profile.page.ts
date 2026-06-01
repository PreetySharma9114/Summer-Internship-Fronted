import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';

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
import { FileUploadHelper } from '../../../../shared/helpers/file-upload.helper';
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
      brandName: ['', Validators.required],

      website: ['', Validators.required],

      description: ['', Validators.required],

      industry: ['', Validators.required],

      instagramUsername: [''],
    });
  }

  onLogoChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedLogo = input.files[0];

      FileUploadHelper.generatePreview(this.selectedLogo, (preview) => {
        this.logoPreview = preview;
      });
    }
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
        },

        error: async (error) => {
          const message = error?.error?.message ?? 'Failed to complete profile';

          await this.toastService.showErrorToast(message);
        },
      });
  }
}
