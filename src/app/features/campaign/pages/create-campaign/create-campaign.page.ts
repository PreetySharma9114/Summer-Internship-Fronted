import { CommonModule } from '@angular/common';

import { Component, inject } from '@angular/core';

import { FormBuilder, ReactiveFormsModule, Validators } from '@angular/forms';
import { CreateCampaignDto } from '../../dto/create-campaign.dto';
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
  IonLabel,
} from '@ionic/angular/standalone';

import { Router } from '@angular/router';

import { CampaignService } from '../../../../core/services/campaign.service';

import { Industry } from '../../../../shared/enums/industry.enum';
import { Platform } from '../../../../shared/enums/platform.enum';

@Component({
  selector: 'app-create-campaign',
  standalone: true,
  templateUrl: './create-campaign.page.html',
  imports: [
    CommonModule,
    ReactiveFormsModule,
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
    IonLabel,
  ],
})
export class CreateCampaignPage {
  private fb = inject(FormBuilder);

  private campaignService = inject(CampaignService);

  private router = inject(Router);

  industries = Object.values(Industry);

  platforms = Object.values(Platform);

  form = this.fb.nonNullable.group({
    title: ['', Validators.required],

    description: ['', Validators.required],

    category: ['', Validators.required],

    platforms: this.fb.nonNullable.control<Platform[]>([], Validators.required),
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

    const payload: CreateCampaignDto = {
      title: this.form.value.title!,
      description: this.form.value.description!,
      category: this.form.value.category as Industry,
      platforms: this.form.value.platforms as Platform[],
      budgetPerInfluencer: this.form.value.budgetPerInfluencer!,
      totalSlots: this.form.value.totalSlots!,
      startDate: this.form.value.startDate!,
      endDate: this.form.value.endDate!,
    };

    this.campaignService.createCampaign(payload).subscribe({
      next: () => {
        this.router.navigate(['/my-campaigns']);
      },
    });
  }
}
