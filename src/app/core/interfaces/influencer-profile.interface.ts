import { InfluencerNiche } from '../enums/influencer-niche.enum';

export interface InfluencerProfile {
  fullName: string;
  username: string;
  bio: string;
  niche: InfluencerNiche;
  instagramUsername: string;
  youtubeUsername: string;
  followersCount: number;
  profileImage?: File;
}
