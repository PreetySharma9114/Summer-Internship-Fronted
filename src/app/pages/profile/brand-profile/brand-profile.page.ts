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

import { ToastService } from '../../../core/services/toast.service';

import { ProfileService } from '../../../core/services/profile.service';

import { BrandIndustry } from '../../../core/enums/brand-industry.enum';

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

      const reader = new FileReader();

      reader.onload = () => {
        this.logoPreview = reader.result as string;
      };

      reader.readAsDataURL(this.selectedLogo);
    }
  }

  submitProfile(): void {
    if (this.brandProfileForm.invalid) {
      this.brandProfileForm.markAllAsTouched();

      return;
    }

    this.loading = true;

    const formData = new FormData();

    Object.entries(this.brandProfileForm.value).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (this.selectedLogo) {
      formData.append('logo', this.selectedLogo);
    }

    this.profileService
      .createBrandProfile(formData)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: () => {
          this.toastService
            .showSuccessToast('Profile completed successfully')
            .subscribe((toast) => {
              toast.present();
            });

          this.router.navigate(['/home']);
        },

        error: (error) => {
          const message = error?.error?.message ?? 'Failed to complete profile';

          this.toastService.showErrorToast(message).subscribe((toast) => {
            toast.present();
          });
        },
      });
  }
}
