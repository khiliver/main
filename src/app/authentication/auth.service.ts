import { Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { AuthData } from './auth-data.model';
import { Observable } from 'rxjs';
import { tap } from 'rxjs/operators';  // Import tap for side-effects
import { Subject } from "rxjs";  // Import Subject

@Injectable({ providedIn: 'root' })
export class AuthService {
  private API_URL = 'http://localhost:3000/api/user';  // URL of the API
  private token: string = '';  // Store token in the service
  private authStatusListener = new Subject<boolean>();  // Subject to listen to auth status changes

  constructor(private http: HttpClient) {}

  // Method to create a user
  createUser(email: string, password: string): Observable<any> {
    const authData: AuthData = { email, password };
    return this.http.post(`${this.API_URL}/signup`, authData);
  }

  // Method to login a user and store the token
  loginUser(email: string, password: string): Observable<any> {
    const authData: AuthData = { email, password };
    return this.http.post<{ token: string }>(`${this.API_URL}/login`, authData).pipe(
      tap(response => {
        // Save the token locally
        this.token = response.token;
        localStorage.setItem('token', response.token);  // Store the token in localStorage

        // Notify the status listener that the user is authenticated
        this.authStatusListener.next(true);  // Authentication status changed to true
      })
    );
  }

  // Method to get the token from the service or localStorage
  getToken(): string {
    // Return the token from the service or localStorage
    return this.token || localStorage.getItem('token')!;
  }

  // Method to log out the user
  logout(): void {
    this.token = '';  // Clear token from the service
    localStorage.removeItem('token');  // Remove token from localStorage

    // Notify the status listener that the user is logged out
    this.authStatusListener.next(false);  // Authentication status changed to false
  }

  // Method to get the authentication status listener
  getAuthStatusListener(): Observable<boolean> {
    return this.authStatusListener.asObservable();  // Return the status listener as observable
  }
}
