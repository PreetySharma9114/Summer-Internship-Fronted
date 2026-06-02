import { inject } from '@angular/core';

import { CanActivateFn, Router } from '@angular/router';

import { AuthService } from '../services/auth.service';

import { UserRole } from '../../features/auth/enums/user-role.enum';

import { ProfileStatus } from '../../features/profile/enums/profile-status.enum';

export const profileGuard: CanActivateFn = () => {
  const authService = inject(AuthService);

  const router = inject(Router);

  const user = authService.getCurrentUser();
  console.log('PROFILE GUARD USER', user);
  if (!user) {
    router.navigate(['/login']);

    return false;
  }

  if (user.profileStatus === ProfileStatus.COMPLETE) {
    return true;
  }

  switch (user.role) {
    case UserRole.INFLUENCER:
      return router.createUrlTree(['/influencer-profile']);

    case UserRole.BRAND:
      return router.createUrlTree(['/brand-profile']);

    default:
      return router.createUrlTree(['/login']);
  }

  return false;
};
