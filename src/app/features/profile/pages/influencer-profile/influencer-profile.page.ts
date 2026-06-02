import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';
import { getValidationMessage } from '../../../../shared/helpers/validation-message.helper';
import { FormBuilder, FormGroup, ReactiveFormsModule, Validators } from '@angular/forms';
import { InfluencerProfile } from '../../interfaces/influencer-profile.interface';
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
    IonSelect,
    IonSelectOption,
    IonSpinner,
  ],
})
export class InfluencerProfilePage implements OnInit {
  private fb = inject(FormBuilder);

  private profileService = inject(ProfileService);

  private toastService = inject(ToastService);
  protected readonly getValidationMessage = getValidationMessage;
  private router = inject(Router);

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

      niche: ['', Validators.required],

      instagramUsername: [''],

      youtubeUsername: [''],

      instagramFollowers: ['', Validators.required],
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
