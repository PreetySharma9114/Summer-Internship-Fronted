import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';
import { finalize } from 'rxjs';

import { ToastService } from '../../../../core/services/toast.service';

import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';

import { IonSpinner, IonCheckbox } from '@ionic/angular/standalone';
import {
  IonContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonButton,
} from '@ionic/angular/standalone';

import { CampaignService } from '../../../../core/services/campaign.service';
import { Industry } from '../../../../shared/enums/industry.enum';
import { Platform } from '../../../../shared/enums/platform.enum';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';

@Component({
  selector: 'app-create-campaign',
  standalone: true,
  templateUrl: './create-campaign.page.html',
  imports: [
  CommonModule,
  ReactiveFormsModule,
  TitleCasePipe,
  IonContent,
  IonItem,
  IonInput,
  IonTextarea,
  IonSelect,
  IonSelectOption,
  IonButton,
  IonDatetime,
  IonDatetimeButton,
  IonModal,
  IonSpinner,
  IonCheckbox,
]
})
export class CreateCampaignPage {
  private fb = inject(FormBuilder);

  private campaignService = inject(CampaignService);

  private router = inject(Router);
  private toastService = inject(ToastService);

  industries = Object.values(Industry);

  platforms = Object.values(Platform);
  loading = false;
  form = this.fb.group({
    title: ['', Validators.required],
    description: ['', Validators.required],
    category: ['', Validators.required],
    platforms: this.fb.control<Platform[]>([], Validators.required),
    budgetPerInfluencer: [0, Validators.required],
    totalSlots: [1, Validators.required],
    startDate: [new Date().toISOString()],
    endDate: [new Date().toISOString()],
  });

  submit(): void {
    if (this.form.invalid) {
      this.form.markAllAsTouched();

      return;
    }

    this.loading = true;

    const payload = this.form.getRawValue() as CreateCampaignDto;

    this.campaignService
      .createCampaign(payload)
      .pipe(
        finalize(() => {
          this.loading = false;
        }),
      )
      .subscribe({
        next: async () => {
          await this.toastService.showSuccessToast('Campaign created successfully');

          this.router.navigate(['/my-campaigns']);
        },

        error: async (error) => {
          await this.toastService.showErrorToast(
            getErrorMessage(error, 'Failed to create campaign'),
          );
        },
      });
  }
  isPlatformSelected(platform: Platform): boolean {
    const selectedPlatforms = this.form.get('platforms')?.value ?? [];

    return selectedPlatforms.includes(platform);
  }

  togglePlatform(platform: Platform, checked: boolean): void {
    const control = this.form.get('platforms');

    const selectedPlatforms: Platform[] = [...(control?.value ?? [])];

    if (checked) {
      selectedPlatforms.push(platform);
    } else {
      const index = selectedPlatforms.indexOf(platform);

      if (index > -1) {
        selectedPlatforms.splice(index, 1);
      }
    }

    control?.setValue(selectedPlatforms);

    control?.markAsTouched();
  }
}
