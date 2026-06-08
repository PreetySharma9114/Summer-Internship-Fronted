import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { BehaviorSubject, Observable, tap } from 'rxjs';
import { environment } from '../../../environments/environment';
import { Campaign } from '../../shared/interfaces/campaign.interface';
import { CreateCampaignDto } from '../../features/campaign/dto/create-campaign.dto';
@Injectable({
  providedIn: 'root',
})
export class CampaignService {
  private http = inject(HttpClient);

  private readonly apiUrl = `${environment.apiUrl}/campaigns`;

  private campaignsSubject = new BehaviorSubject<Campaign[]>([]);

  campaigns$ = this.campaignsSubject.asObservable();

  getCampaigns(): Observable<{
    success: boolean;
    message: string;
    data: Campaign[];
  }> {
    return this.http
      .get<{
        success: boolean;
        message: string;
        data: Campaign[];
      }>(this.apiUrl)
      .pipe(
        tap((response) => {
          this.campaignsSubject.next(response.data);
        }),
      );
  }
  getCampaignById(id: string): Observable<{
    success: boolean;
    message: string;
    data: Campaign;
  }> {
    return this.http.get<{
      success: boolean;
      message: string;
      data: Campaign;
    }>(`${this.apiUrl}/${id}`);
  }
  createCampaign(data: CreateCampaignDto): Observable<{
    success: boolean;
    message: string;
  }> {
    return this.http.post<{
      success: boolean;
      message: string;
    }>(this.apiUrl, data);
  }
  getMyCampaigns(): Observable<{
  success: boolean;
  message: string;
  data: Campaign[];
}> {
  return this.http.get<{
    success: boolean;
    message: string;
    data: Campaign[];
  }>(`${this.apiUrl}/my`);
}
}
