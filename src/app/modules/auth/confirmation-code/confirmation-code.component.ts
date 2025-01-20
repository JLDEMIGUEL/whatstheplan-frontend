import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-confirmation-code',
  imports: [
    NgIf,
    ReactiveFormsModule
  ],
  templateUrl: './confirmation-code.component.html',
  styleUrls: ['./confirmation-code.component.scss']
})
export class ConfirmationCodeComponent implements OnInit {
  confirmationCodeForm!: FormGroup;
  errorMessage!: string;
  userId!: string;
  isResendDisabled = false;
  successMessage = '';


  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.userId = localStorage.getItem('pendingUserId') || '';
    if (!this.userId) {
      this.router.navigate(['/sign-up']);
    }
    this.confirmationCodeForm = this.fb.group({
      confirmationCode: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.confirmationCodeForm.valid) {
      const {confirmationCode} = this.confirmationCodeForm.value;
      try {
        await this.authService.confirmCode(this.userId, confirmationCode);
        this.successMessage = 'Confirmation successful! Redirecting to login...';
        this.errorMessage = '';
        localStorage.removeItem('pendingUserId')
        setTimeout(() => this.router.navigate(['/login']), 2000);
      } catch (error) {
        if (error instanceof Error) {
          if (error?.message?.includes('Invalid')) {
            this.errorMessage = 'The confirmation code is incorrect. Please try again.';
          } else if (error?.message?.includes('Expired')) {
            this.errorMessage = 'The confirmation code has expired. Please request a new one.';
          } else {
            this.errorMessage = 'An unexpected error occurred. Please try again.';
          }
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        console.error('Error confirming code:', error);
      }
    }
  }

  async onResendCode() {
    this.isResendDisabled = true;

    await this.authService.resendCode(this.userId)

    setTimeout(() => {
      this.isResendDisabled = false;
    }, 10000);
  }

  isFieldInvalid(field: string): boolean {
    const control: AbstractControl | null = this.confirmationCodeForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }
}
