import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { Router } from '@angular/router';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { AuthResponse } from '../interfaces/auth-response.interface';

import { User } from '../interfaces/user.interface';

import { Session } from '../interfaces/session.interface';

import { UserRole } from '../enums/user-role.enum';

import { ProfileStatus } from '../enums/profile-status.enum';

export interface RegisterDto {
  email: string;

  role: UserRole;
}

export interface VerifyOtpDto {
  id: string;

  otp: string;
}

export interface CreatePasswordDto {
  id: string;

  password: string;

  confirmPassword: string;
}

export interface LoginDto {
  email: string;

  password: string;
}

@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);

  private router = inject(Router);

  private apiUrl = `${environment.apiUrl}/auth`;

  private readonly SESSION_KEY = 'creatorhub_session';

  private sessionSubject = new BehaviorSubject<Session | null>(null);

  session$ = this.sessionSubject.asObservable();

  private currentUserSubject = new BehaviorSubject<User | null>(null);

  currentUser$ = this.currentUserSubject.asObservable();

  constructor() {
    this.restoreSession();
  }

  register(data: RegisterDto): Observable<{ id: string }> {
    return this.http.post<{
      id: string;
    }>(`${this.apiUrl}/register`, data);
  }

  verifyOtp(data: VerifyOtpDto): Observable<{ success: boolean }> {
    return this.http.post<{
      success: boolean;
    }>(`${this.apiUrl}/verify-otp`, data);
  }

  resendOtp(id: string): Observable<{ success: boolean }> {
    return this.http.post<{
      success: boolean;
    }>(`${this.apiUrl}/resend-otp`, { id });
  }

  createPassword(data: CreatePasswordDto): Observable<{ success: boolean }> {
    return this.http.post<{
      success: boolean;
    }>(`${this.apiUrl}/create-password`, data);
  }

  login(data: LoginDto): Observable<AuthResponse> {
    return this.http.post<AuthResponse>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        this.saveSession({
          token: response.token,

          user: response.user,
        });

        this.handleProfileNavigation(response.user);
      }),
    );
  }

  getCurrentUser(): User | null {
    return this.currentUserSubject.value;
  }

  setCurrentUser(user: User): void {
    this.currentUserSubject.next(user);
  }

  getToken(): string | null {
    return this.sessionSubject.value?.token ?? null;
  }

  isAuthenticated(): boolean {
    return !!this.getToken();
  }

  logout(): void {
    localStorage.removeItem(this.SESSION_KEY);

    this.sessionSubject.next(null);

    this.currentUserSubject.next(null);

    this.router.navigate(['/login']);
  }

  private restoreSession(): void {
    const storedSession = localStorage.getItem(this.SESSION_KEY);

    if (!storedSession) {
      return;
    }

    const session: Session = JSON.parse(storedSession);

    this.sessionSubject.next(session);

    this.currentUserSubject.next(session.user);
  }

  private saveSession(session: Session): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

    this.sessionSubject.next(session);

    this.currentUserSubject.next(session.user);
  }

  private handleProfileNavigation(user: User): void {
    if (user.profileStatus === ProfileStatus.INCOMPLETE) {
      if (user.role === UserRole.INFLUENCER) {
        this.router.navigate(['/influencer-profile']);

        return;
      }

      this.router.navigate(['/brand-profile']);

      return;
    }

    this.router.navigate(['/home']);
  }
}
