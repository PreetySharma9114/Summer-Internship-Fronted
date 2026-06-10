import { CommonModule, TitleCasePipe } from '@angular/common';
import { Component, inject } from '@angular/core';
import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { Router } from '@angular/router';

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
  ],
})
export class CreateCampaignPage {
  private fb = inject(FormBuilder);

  private campaignService = inject(CampaignService);

  private router = inject(Router);

  industries = Object.values(Industry);

  platforms = Object.values(Platform);

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

    const payload = this.form.getRawValue() as CreateCampaignDto;

    this.campaignService.createCampaign(payload).subscribe({
      next: () => {
        this.router.navigate(['/my-campaigns']);
      },
    });
  }
}
