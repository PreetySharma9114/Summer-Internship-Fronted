import { Component, DestroyRef, OnInit, inject } from '@angular/core';

import { IonContent, IonSpinner, IonButton } from '@ionic/angular/standalone';
import { ApplicationStatus } from '../../../../shared/enums/application-status.enum';
import { ActivatedRoute } from '@angular/router';
import { Application } from '../../../../shared/interfaces/application.interface';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';
import { CommonModule, CurrencyPipe, TitleCasePipe } from '@angular/common';
import { CampaignService } from '../../../../core/services/campaign.service';
import { AuthService } from '../../../../core/services/auth.service';
import { Campaign } from '../../../../shared/interfaces/campaign.interface';
import { ApplicationService } from '../../../../core/services/application.service';
import { ToastService } from '../../../../core/services/toast.service';
import { getErrorMessage } from '../../../../shared/helpers/error-message.helper';
@Component({
  selector: 'app-campaign-details',
  standalone: true,
  templateUrl: './campaign-details.page.html',
  imports: [CommonModule, IonContent, IonSpinner, IonButton, CurrencyPipe, TitleCasePipe],
})
export class CampaignDetailsPage implements OnInit {
  private route = inject(ActivatedRoute);
  private authService = inject(AuthService);
  user = this.authService.getCurrentUser();
  private campaignService = inject(CampaignService);
  private applicationService = inject(ApplicationService);
  private destroyRef = inject(DestroyRef);
  private toastService = inject(ToastService);
  campaign?: Campaign;
  applications: Application[] = [];

  protected readonly applicationStatus = ApplicationStatus;

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
      next: async (response) => {
        await this.toastService.showSuccessToast(response.message);
      },

      error: async (error) => {
        await this.toastService.showErrorToast(getErrorMessage(error, 'Failed to apply'));
      },
    });
  }
  viewApplications(): void {
    if (!this.campaign) {
      return;
    }

    this.applicationService.getCampaignApplications(this.campaign._id).subscribe({
      next: (response) => {
        this.applications = response.data;
      },

      error: async (error) => {
        await this.toastService.showErrorToast(
          getErrorMessage(
            error,
            'Failed to load applications',
          ),
        );
      },
    });
  }

updateApplicationStatus(
  applicationId: string,
  status: ApplicationStatus,
): void {
  this.applicationService
    .updateApplicationStatus(applicationId, status)
    .subscribe({
      next: async (response) => {
        await this.toastService.showSuccessToast(
          response.message,
        );

        this.viewApplications();

        if (!this.campaign) {
          return;
        }

        this.campaignService
          .getCampaignById(this.campaign._id)
          .subscribe({
            next: (campaignResponse) => {
              this.campaign =
                campaignResponse.data;
            },
          });
      },

      error: async (error) => {
        await this.toastService.showErrorToast(
          getErrorMessage(
            error,
            'Failed to update application',
          ),
        );
      },
    });
}
}
