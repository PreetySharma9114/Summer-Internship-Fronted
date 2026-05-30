import { Component, OnDestroy, OnInit, inject } from '@angular/core';

import { CommonModule } from '@angular/common';

import { IonButton, IonContent, IonSpinner } from '@ionic/angular/standalone';

import { Router } from '@angular/router';

import { Subject, takeUntil } from 'rxjs';

import { AuthService } from '../../core/services/auth.service';

import { User } from '../../core/interfaces/user.interface';

import { UserRole } from '../../core/enums/user-role.enum';

import { ProfileStatus } from '../../core/enums/profile-status.enum';

@Component({
  selector: 'app-home',

  standalone: true,

  templateUrl: './home.page.html',
  imports: [CommonModule, IonContent,IonSpinner],
})
export class HomePage implements OnInit, OnDestroy {
  private authService = inject(AuthService);

  private router = inject(Router);

  private destroy$ = new Subject<void>();

  user: User | null = null;

  loading = true;

  readonly userRole = UserRole;

  ngOnInit(): void {
    this.listenToUserState();
  }

  private listenToUserState(): void {
    this.authService.currentUser$.pipe(takeUntil(this.destroy$)).subscribe((user) => {
      this.user = user;

      this.loading = false;

      if (!user) {
        this.router.navigate(['/login']);

        return;
      }

      this.handleProfileRedirect(user);
    });
  }

  private handleProfileRedirect(user: User): void {
    if (user.profileStatus === ProfileStatus.COMPLETE) {
      return;
    }

    if (user.role === UserRole.INFLUENCER) {
      this.router.navigate(['/influencer-profile']);

      return;
    }

    this.router.navigate(['/brand-profile']);
  }

  ngOnDestroy(): void {
    this.destroy$.next();

    this.destroy$.complete();
  }
}
