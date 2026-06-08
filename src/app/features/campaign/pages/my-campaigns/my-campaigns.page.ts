import { CommonModule } from '@angular/common';

import {
  Component,
  DestroyRef,
  OnInit,
  inject,
} from '@angular/core';

import {
  IonContent,
  IonSpinner,
} from '@ionic/angular/standalone';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CampaignService } from '../../../../core/services/campaign.service';

import { Campaign } from '../../../../shared/interfaces/campaign.interface';

import { CampaignCardComponent } from '../../../../shared/components/campaign-card/campaign-card.component';

@Component({
  selector: 'app-my-campaigns',
  standalone: true,
  templateUrl: './my-campaigns.page.html',
  imports: [
    CommonModule,
    IonContent,
    IonSpinner,
    CampaignCardComponent,
  ],
})
export class MyCampaignsPage implements OnInit {
  private campaignService = inject(CampaignService);

  private destroyRef = inject(DestroyRef);

  campaigns: Campaign[] = [];

  loading = true;

  ngOnInit(): void {
    this.loadMyCampaigns();
  }

  private loadMyCampaigns(): void {
    this.campaignService
      .getMyCampaigns()
      .pipe(
        takeUntilDestroyed(
          this.destroyRef,
        ),
      )
      .subscribe({
        next: (response) => {
          this.campaigns = response.data;

          this.loading = false;
        },

        error: () => {
          this.loading = false;
        },
      });
  }
}