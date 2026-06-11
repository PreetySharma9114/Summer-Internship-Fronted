import { Component, OnInit, inject } from '@angular/core';
import { AuthService } from '../../../../core/services/auth.service';
import { ProfileStatus } from '../../enums/profile-status.enum';
import { CommonModule } from '@angular/common';
import { getValidationMessage } from '../../../../shared/helpers/validation-message.helper';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InfluencerProfile } from '../../interfaces/influencer-profile.interface';
import {
  IonButton,
  IonContent,
  IonInput,
  IonItem,
  IonTextarea,
  IonSpinner,
  IonCheckbox,
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';

import { finalize } from 'rxjs';

import { ToastService } from '../../../../core/services/toast.service';

import { ProfileService } from '../../../../core/services/profile.service';
import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';
import { InfluencerNiche } from '../../enums/influencer-niche.enum';
import { generatePreview } from '../../../../shared/helpers/file-upload.helper';
import { ProfileValidators } from '../../../../shared/validators/profile.validators';
import { validateImageFile } from '../../../../shared/helpers/file-validation.helper';
@Component({
  selector: 'app-influencer-profile',

  standalone: true,

  templateUrl: './influencer-profile.page.html',

  imports: [
    CommonModule,
    ReactiveFormsModule,

    IonContent,
    IonItem,
    IonInput,
    IonTextarea,
    IonButton,
    IonCheckbox,
    IonSpinner,
  ],
})
export class InfluencerProfilePage implements OnInit {
  private fb = inject(FormBuilder);

  private profileService = inject(ProfileService);

  private toastService = inject(ToastService);
  protected readonly getValidationMessage = getValidationMessage;
  private router = inject(Router);
  private authService = inject(AuthService);
  influencerProfileForm!: FormGroup;

  loading = false;

  selectedImage: File | null = null;

  imagePreview: string | null = null;

  readonly niches = Object.values(InfluencerNiche);

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.influencerProfileForm = this.fb.group({
      fullName: ['', ProfileValidators.fullName],

      username: ['', ProfileValidators.username],

      bio: ['', ProfileValidators.bio],

      niches: [[], Validators.required],

      instagramUsername: [''],

      youtubeUsername: [''],

      instagramFollowers: [0, ProfileValidators.instagramFollowers],
    });
  }

  onFileChange(event: Event): void {
    const input = event.target as HTMLInputElement;

    if (input.files && input.files.length > 0) {
      this.selectedImage = input.files[0];
      generatePreview(this.selectedImage, (preview: string) => {
        this.imagePreview = preview;
      });
    }
  }

  submitProfile(): void {
    if (this.influencerProfileForm.invalid) {
      this.influencerProfileForm.markAllAsTouched();

      return;
    }

    this.loading = true;
    const profile: InfluencerProfile = this.influencerProfileForm.getRawValue();

    this.profileService
      .createInfluencerProfile(profile, this.selectedImage ?? undefined)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: async () => {
          const user = this.authService.getCurrentUser();

          if (user) {
            this.authService.setCurrentUser({
              ...user,
              profileStatus: ProfileStatus.COMPLETE,
            });
          }

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
  isNicheSelected(niche: InfluencerNiche): boolean {
  const selectedNiches =
    this.influencerProfileForm.get('niches')?.value ?? [];

  return selectedNiches.includes(niche);
}
toggleNiche(
  niche: InfluencerNiche,
  checked: boolean,
): void {
  const control =
    this.influencerProfileForm.get('niches');

  const selectedNiches: InfluencerNiche[] = [
    ...(control?.value ?? []),
  ];

  if (checked) {
    selectedNiches.push(niche);
  } else {
    const index =
      selectedNiches.indexOf(niche);

    if (index > -1) {
      selectedNiches.splice(index, 1);
    }
  }

  control?.setValue(selectedNiches);
  control?.markAsTouched();
}
}
