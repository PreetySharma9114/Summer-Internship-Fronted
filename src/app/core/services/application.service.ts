import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';

import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/applications`;

  applyToCampaign(campaignId: string): Observable<any> {
    return this.http.post(
      `${this.apiUrl}/campaigns/${campaignId}/apply`,
      {},
    );
  }

  getMyApplications(): Observable<any> {
    return this.http.get(`${this.apiUrl}/my`);
  }

  getCampaignApplications(campaignId: string): Observable<any> {
    return this.http.get(
      `${this.apiUrl}/campaigns/${campaignId}`,
    );
  }

  updateApplicationStatus(
    applicationId: string,
    status: string,
  ): Observable<any> {
    return this.http.patch(
      `${this.apiUrl}/${applicationId}/status`,
      { status },
    );
  }
}