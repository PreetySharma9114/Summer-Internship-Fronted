import { CommonModule } from '@angular/common';

import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { CampaignCardComponent } from '../../../../shared/components/campaign-card/campaign-card.component';
import {
  IonContent,
  IonSpinner,
} from '@ionic/angular/standalone';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CampaignService } from '../../../../core/services/campaign.service';

import { Campaign } from '../../../../shared/interfaces/campaign.interface';

@Component({
  selector: 'app-campaign-list',
  standalone: true,
  templateUrl: './campaign-list.page.html',
  imports: [
    CommonModule,
    IonContent,
    IonSpinner,
    CampaignCardComponent,
  ],
})
export class CampaignListPage implements OnInit {
  private campaignService = inject(CampaignService);

  private destroyRef = inject(DestroyRef);

  campaigns: Campaign[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadCampaigns();
  }

  private loadCampaigns(): void {
    this.campaignService.campaigns$
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe((campaigns) => {
        this.campaigns = campaigns;
        this.loading = false;
      });

    this.campaignService
      .getCampaigns()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        error: () => {
          this.loading = false;
        },
      });
  }
}
