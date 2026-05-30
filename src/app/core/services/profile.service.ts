import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { InfluencerProfile } from '../interfaces/influencer-profile.interface';

import { BrandProfile } from '../interfaces/brand-profile.interface';

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

  createInfluencerProfile(formData: FormData): Observable<InfluencerProfile> {
    return this.http.post<InfluencerProfile>(`${this.apiUrl}/influencer`, formData).pipe(
      tap((profile) => {
        this.influencerProfileSubject.next(profile);
      }),
    );
  }

  createBrandProfile(formData: FormData): Observable<BrandProfile> {
    return this.http.post<BrandProfile>(`${this.apiUrl}/brand`, formData).pipe(
      tap((profile) => {
        this.brandProfileSubject.next(profile);
      }),
    );
  }
}
