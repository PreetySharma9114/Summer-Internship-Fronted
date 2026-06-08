import { CampaignStatus } from '../enums/campaign-status.enum';
import { Industry } from '../enums/industry.enum';
import { Platform } from '../enums/platform.enum';

export interface Campaign {
  _id: string;

  brandId: string;

  title: string;

  description: string;

  category: Industry;

  platforms: Platform[];

  budgetPerInfluencer: number;

  totalSlots: number;

  filledSlots: number;

  startDate: string;

  endDate: string;

  status: CampaignStatus;

  createdAt: string;

  updatedAt: string;
}