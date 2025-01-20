import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';

@Component({
  selector: 'app-register',
  imports: [CommonModule, ReactiveFormsModule, NgOptimizedImage],
  templateUrl: './register.component.html',
  styleUrl: './register.component.scss'
})
export class RegisterComponent implements OnInit {
  registerForm!: FormGroup;
  errorMessage!: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.registerForm = this.fb.group({
      email: ['', [Validators.required, Validators.email]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]]
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const {email, password} = this.registerForm.value;
      try {
        const signUpOutput = await this.authService.register(email, password);
        localStorage.setItem('pendingUserId', signUpOutput.userId?.toString() || '');
        await this.router.navigate(['/confirmation-code']);
      } catch (error) {
        if (error instanceof Error) {
          if (error.name === 'UserLambdaValidationException') {
            this.errorMessage = 'An account with this email already exists. Please log in or use a different email.';
          } else if (error.name === 'InvalidPasswordException') {
            this.errorMessage = 'Your password does not meet the security requirements.';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again later.';
          }
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        console.error(this.errorMessage)
      }
    }
  }

  signInWithGoogle() {
    this.authService.loginWithGoogle();
  }

  isFieldInvalid(field: string): boolean {
    const control: AbstractControl | null = this.registerForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
