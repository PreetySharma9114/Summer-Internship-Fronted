import { Component, Input, inject } from '@angular/core';

import { Router } from '@angular/router';

import { IonCard } from '@ionic/angular/standalone';

import { Campaign } from '../../interfaces/campaign.interface';

@Component({
  selector: 'app-campaign-card',
  standalone: true,
  imports: [
    IonCard,
  ],
  templateUrl: './campaign-card.component.html',
})
export class CampaignCardComponent {

  private router = inject(Router);

  @Input({ required: true })
  campaign!: Campaign;

  viewDetails(): void {
    this.router.navigate([
      '/campaign-details',
      this.campaign._id,
    ]);
  }
}