import { Routes } from '@angular/router';

import { authGuard } from './core/guards/auth.guard';

import { profileGuard } from './core/guards/profile.guard';

export const routes: Routes = [
  {
    path: '',
    redirectTo: 'login',
    pathMatch: 'full',
  },

  {
    path: 'register',
    loadComponent: () =>
      import('./pages/auth/register/register.page').then(
        (m) => m.RegisterPage,
      ),
  },

  {
    path: 'verify-otp',
    loadComponent: () =>
      import('./pages/auth/verify-otp/verify-otp.page').then(
        (m) => m.VerifyOtpPage,
      ),
  },

  {
    path: 'create-password',
    loadComponent: () =>
      import('./pages/auth/create-password/create-password.page').then(
        (m) => m.CreatePasswordPage,
      ),
  },

  {
    path: 'login',
    loadComponent: () =>
      import('./pages/auth/login/login.page').then(
        (m) => m.LoginPage,
      ),
  },

  {
    path: 'influencer-profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './pages/profile/influencer-profile/influencer-profile.page'
      ).then((m) => m.InfluencerProfilePage),
  },

  {
    path: 'brand-profile',
    canActivate: [authGuard],
    loadComponent: () =>
      import(
        './pages/profile/brand-profile/brand-profile.page'
      ).then((m) => m.BrandProfilePage),
  },

  {
    path: 'home',
    canActivate: [authGuard, profileGuard],
    loadComponent: () =>
      import('./pages/home/home.page').then(
        (m) => m.HomePage,
      ),
  },

  {
    path: '**',
    redirectTo: 'login',
  },
];