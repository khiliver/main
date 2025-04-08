import { Component, OnInit } from '@angular/core';
import { FormBuilder, FormGroup, Validators } from '@angular/forms';
import { AuthService } from '../auth.service';

@Component({
  selector: 'app-signup',
  templateUrl: './signup.component.html',
  styleUrls: ['./signup.component.css']
})
export class SignupComponent implements OnInit {
  signupForm!: FormGroup;
  isLoading: boolean = false;

  constructor(public authService: AuthService, private fb: FormBuilder) {}

  ngOnInit(): void {
    this.signupForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', Validators.required]
    });
  }

  onSignup(): void {
    if (this.signupForm.invalid) {
      return;
    }
    const { email, password } = this.signupForm.value;
    this.authService.createUser(email, password).subscribe({
      next: (response) => {
        console.log('Signup successful:', response);
        // Optionally show a success message or redirect
      },
      error: (err) => {
        console.error('Signup error:', err);
        // Optionally show error message to user
      }
    });
  }
}
