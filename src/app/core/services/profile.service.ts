import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { InfluencerProfile } from '../../features/profile/interfaces/influencer-profile.interface';

import { BrandProfile } from '../../features/profile/interfaces/brand-profile.interface';

@Injectable({
  providedIn: 'root',
})
export class ProfileService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/profile`;

  private influencerProfileSubject = new BehaviorSubject<InfluencerProfile | null>(null);

  private brandProfileSubject = new BehaviorSubject<BrandProfile | null>(null);

  influencerProfile$ = this.influencerProfileSubject.asObservable();

  brandProfile$ = this.brandProfileSubject.asObservable();

  createInfluencerProfile(profile: InfluencerProfile, image?: File): Observable<InfluencerProfile> {
    const formData = new FormData();

    Object.entries(profile).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (image) {
      formData.append('profileImage', image);
    }

    return this.http.post<InfluencerProfile>(`${this.apiUrl}/influencer`, formData).pipe(
      tap((response) => {
        this.influencerProfileSubject.next(response);
      }),
    );
  }

  createBrandProfile(profile: BrandProfile, logo?: File): Observable<BrandProfile> {
    const formData = new FormData();

    Object.entries(profile).forEach(([key, value]) => {
      formData.append(key, String(value));
    });

    if (logo) {
      formData.append('logo', logo);
    }

    return this.http.post<BrandProfile>(`${this.apiUrl}/brand`, formData).pipe(
      tap((response) => {
        this.brandProfileSubject.next(response);
      }),
    );
  }
}
