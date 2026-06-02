import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { InfluencerProfile } from '../../features/profile/interfaces/influencer-profile.interface';

import { BrandProfile } from '../../features/profile/interfaces/brand-profile.interface';
import { buildFormData } from '../../shared/helpers/form-data.helper';

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
    const formData = buildFormData(profile, image, 'profileImage');
    return this.http.post<InfluencerProfile>(`${this.apiUrl}/influencer`, formData).pipe(
      tap((response) => {
        this.influencerProfileSubject.next(response);
      }),
    );
  }

  createBrandProfile(profile: BrandProfile, logo?: File): Observable<BrandProfile> {
    const formData = buildFormData(profile, logo, 'logo');
    return this.http.post<BrandProfile>(`${this.apiUrl}/brand`, formData).pipe(
      tap((response) => {
        this.brandProfileSubject.next(response);
      }),
    );
  }
}
