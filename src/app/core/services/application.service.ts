import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';

import { Observable } from 'rxjs';
import { Application } from '../../shared/interfaces/application.interface';
import { ApplicationStatus } from '../../shared/enums/application-status.enum';
import { environment } from '../../../environments/environment';

@Injectable({
  providedIn: 'root',
})
export class ApplicationService {
  private http = inject(HttpClient);

  private apiUrl = `${environment.apiUrl}/applications`;

  applyToCampaign(campaignId: string): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/campaigns/${campaignId}/apply`, {});
  }

  getMyApplications(): Observable<{
    success: boolean;
    message: string;
    data: Application[];
  }> {
    return this.http.get<{
      success: boolean;
      message: string;
      data: Application[];
    }>(`${this.apiUrl}/my`);
  }

  getCampaignApplications(campaignId: string): Observable<{
    success: boolean;
    message: string;
    data: Application[];
  }> {
    return this.http.get<{
      success: boolean;
      message: string;
      data: Application[];
    }>(`${this.apiUrl}/campaigns/${campaignId}`);
  }

  updateApplicationStatus(
    applicationId: string,
    status: ApplicationStatus,
  ): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.patch<{
      success: boolean;
      message: string;
    }>(`${this.apiUrl}/${applicationId}/status`, { status });
  }
}
