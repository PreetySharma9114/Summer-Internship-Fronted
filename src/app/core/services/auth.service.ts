import { inject, Injectable } from '@angular/core';

import { HttpClient } from '@angular/common/http';

import { BehaviorSubject, Observable, tap } from 'rxjs';

import { environment } from '../../../environments/environment';

import { User } from '../../shared/interfaces/user.interface';
import { Session } from '../../features/auth/interfaces/session.interface';
import { RegisterDto } from '../../features/auth/dto/register.dto';

import { LoginDto } from '../../features/auth/dto/login.dto';

import { VerifyOtpDto } from '../../features/auth/dto/verify-otp.dto';
import { STORAGE_KEYS } from '../constants/app.constants';
import { CreatePasswordDto } from '../../features/auth/dto/create-password.dto';
@Injectable({
  providedIn: 'root',
})
export class AuthService {
  private http = inject(HttpClient);
  private apiUrl = `${environment.apiUrl}/auth`;

  private readonly SESSION_KEY = STORAGE_KEYS.SESSION;
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

  login(data: LoginDto): Observable<Session> {
    return this.http.post<Session>(`${this.apiUrl}/login`, data).pipe(
      tap((response) => {
        this.saveSession({
          token: response.token,

          user: response.user,
        });
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
  }

  private restoreSession(): void {
    const storedSession = localStorage.getItem(this.SESSION_KEY);

    if (!storedSession) {
      return;
    }

    try {
      const session: Session = JSON.parse(storedSession);

      this.sessionSubject.next(session);
      this.currentUserSubject.next(session.user);
    } catch {
      this.logout();
    }
  }

  private saveSession(session: Session): void {
    localStorage.setItem(this.SESSION_KEY, JSON.stringify(session));

    this.sessionSubject.next(session);

    this.currentUserSubject.next(session.user);
  }
}
