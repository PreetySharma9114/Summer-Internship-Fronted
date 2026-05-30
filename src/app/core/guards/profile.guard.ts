import { inject } from "@angular/core";

import { CanActivateFn, Router } from "@angular/router";

export const profileGuard: CanActivateFn = () => {
  const router = inject(Router);

  const isProfileComplete = localStorage.getItem("isProfileComplete");

  const role = localStorage.getItem("role");

  if (isProfileComplete === "true") {
    return true;
  }

  if (role === "INFLUENCER") {
    router.navigate(["/influencer-profile"]);
  } else {
    router.navigate(["/brand-profile"]);
  }

  return false;
};
