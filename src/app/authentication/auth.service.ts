import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { AuthData } from './auth-data.model';
import { Observable, Subject } from 'rxjs';

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:3000/api/user';
  private token: string = '';
  private tokenTimer: any;
  private isAuthenticated = false;
  private authStatusListener = new Subject<boolean>();

  constructor(private http: HttpClient, private router: Router) {}

  createUser(email: string, password: string): Observable<any> {
    const authData: AuthData = { email, password };
    return this.http.post(`${this.API_URL}/signup`, authData);
  }

  loginUser(email: string, password: string): Observable<{ token: string; expiresIn: number }> {
    const authData: AuthData = { email, password };
    return this.http.post<{ token: string; expiresIn: number }>(`${this.API_URL}/login`, authData);
  }

  autoAuthUser(): void {
    const authInformation = this.getAuthData();
    if (!authInformation) {
      return;
    }

    const now = new Date();
    const isInFuture = authInformation.expirationDate > now;

    if (isInFuture) {
      this.token = authInformation.token;
      this.isAuthenticated = true;
      const expiresIn = authInformation.expirationDate.getTime() - now.getTime();
      this.setAuthTimer(expiresIn / 1000);
      this.authStatusListener.next(true);
    } else {
      this.logout();
    }
  }

  logout(): void {
    this.token = '';
    this.isAuthenticated = false;
    this.clearAuthData();
    clearTimeout(this.tokenTimer);
    this.authStatusListener.next(false);
    this.router.navigate(['/login']);
  }

  getToken(): string {
    return this.token || localStorage.getItem('token')!;
  }

  getIsAuth(): boolean {
    return this.isAuthenticated;
  }

  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();
  }

  private saveAuthData(token: string, expirationDate: Date): void {
    localStorage.setItem('token', token);
    localStorage.setItem('expiration', expirationDate.toString());
  }

  private clearAuthData(): void {
    localStorage.removeItem('token');
    localStorage.removeItem('expiration');
  }

  private getAuthData(): { token: string; expirationDate: Date } | null {
    const token = localStorage.getItem('token');
    const expirationDate = localStorage.getItem('expiration');
    if (!token || !expirationDate) return null;
    return {
      token: token,
      expirationDate: new Date(expirationDate)
    };
  }

  private setAuthTimer(duration: number): void {
    this.tokenTimer = setTimeout(() => {
      this.logout();
    }, duration * 1000);
  }
}
