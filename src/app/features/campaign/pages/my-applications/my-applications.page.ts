import { CommonModule } from '@angular/common';
import { Component, DestroyRef, OnInit, inject } from '@angular/core';
import { takeUntilDestroyed } from '@angular/core/rxjs-interop';

import { IonContent, IonSpinner } from '@ionic/angular/standalone';

import { ApplicationService } from '../../../../core/services/application.service';

@Component({
  selector: 'app-my-applications',
  standalone: true,
  templateUrl: './my-applications.page.html',
  imports: [CommonModule, IonContent, IonSpinner],
})
export class MyApplicationsPage implements OnInit {
  private applicationService = inject(ApplicationService);

  private destroyRef = inject(DestroyRef);

  applications: any[] = [];

  loading = true;

  ngOnInit(): void {
    this.applicationService
      .getMyApplications()
      .pipe(takeUntilDestroyed(this.destroyRef))
      .subscribe({
        next: (response) => {
          this.applications = response.data;

          this.loading = false;
        },

        error: (error) => {
          console.log('APPLICATIONS ERROR', error);
          this.loading = false;
        },
      });
  }
}
