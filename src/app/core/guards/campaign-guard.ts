import { CanActivateFn } from '@angular/router';

export const campaignGuard: CanActivateFn = (route, state) => {
  return true;
};
