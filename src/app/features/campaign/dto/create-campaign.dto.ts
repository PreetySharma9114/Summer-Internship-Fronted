import { Industry } from '../../../shared/enums/industry.enum';
import { Platform } from '../../../shared/enums/platform.enum';

export interface CreateCampaignDto {
  title: string;
  description: string;
  category: Industry;
  platforms: Platform[];
  budgetPerInfluencer: number;
  totalSlots: number;
  startDate: string;
  endDate: string;
}