import { CommonModule } from '@angular/common';

import { Component, DestroyRef, OnInit, inject } from '@angular/core';

import { IonContent, IonSpinner, IonButton } from '@ionic/angular/standalone';

import { ActivatedRoute } from '@angular/router';

import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { CampaignService } from '../../../../core/services/campaign.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Campaign } from '../../../../shared/interfaces/campaign.interface';
import { ApplicationService } from '../../../../core/services/application.service';
@Component({
  selector: 'app-campaign-details',
  standalone: true,
  templateUrl: './campaign-details.page.html',
  imports: [CommonModule, IonContent, IonSpinner, IonButton],
})
export class CampaignDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  user = this.authService.getCurrentUser();
  private campaignService = inject(CampaignService);
  private applicationService = inject(ApplicationService);
  private destroyRef = inject(DestroyRef);

  campaign?: Campaign;

  loading = true;

  ngOnInit(): void {
    const id = this.route.snapshot.paramMap.get('id');

    if (!id) {
      return;
    }

    this.campaignService
      .getCampaignById(id)
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.campaign = response.data;

          this.loading = false;
        },

        error: () => {
          this.loading = false;
        },
      });
  }
  applyToCampaign(): void {
    if (!this.campaign) {
      return;
    }

    this.applicationService.applyToCampaign(this.campaign._id).subscribe({
      next: (response) => {
        alert(response.message);
      },

      error: (error) => {
        alert(error.error?.message ?? 'Failed to apply');
      },
    });
  }
}
