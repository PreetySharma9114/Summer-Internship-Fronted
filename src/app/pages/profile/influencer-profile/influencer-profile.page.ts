import { Component, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import {
  FormBuilder,
  FormGroup,
  ReactiveFormsModule,
  Validators,
} from '@angular/forms';

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

import { InfluencerNiche } from '../../../core/enums/influencer-niche.enum';

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

  private router = inject(Router);

  influencerProfileForm!: FormGroup;

  loading = false;

  selectedImage: File | null = null;

  imagePreview: string | null = null;

  readonly niches = Object.values(
    InfluencerNiche,
  );

  ngOnInit(): void {
    this.initializeForm();
  }

  private initializeForm(): void {
    this.influencerProfileForm =
      this.fb.group({
        fullName: [
          '',
          Validators.required,
        ],

        username: [
          '',
          Validators.required,
        ],

        bio: [
          '',
          Validators.required,
        ],

        niche: [
          '',
          Validators.required,
        ],

        instagramUsername: [''],

        youtubeUsername: [''],

        followersCount: [
          '',
          Validators.required,
        ],
      });
  }

  onFileChange(
    event: Event,
  ): void {

    const input =
      event.target as HTMLInputElement;

    if (
      input.files &&
      input.files.length > 0
    ) {

      this.selectedImage =
        input.files[0];

      const reader =
        new FileReader();

      reader.onload = () => {

        this.imagePreview =
          reader.result as string;
      };

      reader.readAsDataURL(
        this.selectedImage,
      );
    }
  }

  submitProfile(): void {

    if (
      this.influencerProfileForm.invalid
    ) {

      this.influencerProfileForm
        .markAllAsTouched();

      return;
    }

    this.loading = true;

    const formData =
      new FormData();

    Object.entries(
      this.influencerProfileForm.value,
    ).forEach(
      ([key, value]) => {

        formData.append(
          key,
          String(value),
        );
      },
    );

    if (
      this.selectedImage
    ) {

      formData.append(
        'profileImage',
        this.selectedImage,
      );
    }

    this.profileService
      .createInfluencerProfile(
        formData,
      )
      .pipe(
        finalize(() => {

          this.loading =
            false;
        }),
      )
      .subscribe({
        next: () => {

          this.toastService
            .showSuccessToast(
              'Profile completed successfully',
            )
            .subscribe(
              (toast) => {

                toast.present();
              },
            );

          this.router.navigate([
            '/home',
          ]);
        },

        error: (error) => {

          const message =
            error?.error?.message ??
            'Failed to complete profile';

          this.toastService
            .showErrorToast(
              message,
            )
            .subscribe(
              (toast) => {

                toast.present();
              },
            );
        },
      });
  }
}