import { BrandIndustry } from '../enums/brand-industry.enum';

export interface BrandProfile {
  brandName: string;

  website: string;

  description: string;

  industry: BrandIndustry;

  instagramUsername: string;

  logo?: string;
}
