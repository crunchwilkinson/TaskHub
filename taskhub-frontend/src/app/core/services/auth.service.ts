import { Injectable, inject } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { tap } from 'rxjs/operators';
import { Observable } from 'rxjs';

// This interface matches the exact JSON payload returned by .NET 8 Identity API
export interface IdentityTokenResponse {
  tokenType: string;
  accessToken: string;
  expiresIn: number;
  refreshToken: string;
}

@Injectable({
  providedIn: 'root' // This makes the service a singleton available everywhere in the app
})
export class AuthService {
  // Modern Angular dependency injection
  private http = inject(HttpClient);
  
  // CRITICAL: Ensure this port matches the HTTPS port your .NET API is running on
  private apiUrl = 'http://localhost:5142'; 

  /**
   * Sends the user's email and password to the .NET backend.
   * If successful, saves the JWT to localStorage.
   */
  login(credentials: any): Observable<IdentityTokenResponse> {
    return this.http.post<IdentityTokenResponse>(`${this.apiUrl}/login`, credentials).pipe(
      tap(response => {
        // Intercept the response before it reaches the component and save the token
        localStorage.setItem('jwt', response.accessToken);
      })
    );
  }

  /**
   * Removes the JWT from localStorage, effectively logging the user out.
   */
  logout(): void {
    localStorage.removeItem('jwt');
  }

  /**
   * Retrieves the current JWT from localStorage.
   * Used primarily by the AuthInterceptor to attach the token to outbound requests.
   */
  getToken(): string | null {
    return localStorage.getItem('jwt');
  }

  /**
   * Returns true if a token exists, false otherwise.
   * Used primarily by the AuthGuard to protect routes.
   */
  isAuthenticated(): boolean {
    return !!this.getToken();
  }
}