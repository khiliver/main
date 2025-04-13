import { Component } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-login',
  templateUrl: './login.component.html',
  styleUrls: ['./login.component.css']
})
export class LoginComponent {
  loginForm: FormGroup;
  isLoading: boolean = false;
  errorMessage: string = '';

  constructor(
    private fb: FormBuilder,
    private authService: AuthService
  ) {
    this.loginForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onLogin(): void {
    if (this.loginForm.invalid) {
      return;
    }

    this.isLoading = true;
    this.errorMessage = '';  // Reset the error message

    const { email, password } = this.loginForm.value;

    // Call the AuthService loginUser method
    this.authService.loginUser(email, password).subscribe({
      next: (response: { token: string }) => {
        this.isLoading = false;
        console.log('Login successful:', response);

        // Store token in localStorage
        localStorage.setItem('token', response.token);

        // Navigate to a protected route after successful login
        // this.router.navigate(['/dashboard']);
      },
      error: (error: any) => {
        this.isLoading = false;
        this.errorMessage = error?.error?.message || 'Login failed';
        console.error('Login error:', error);
      }
    });
  }
}
