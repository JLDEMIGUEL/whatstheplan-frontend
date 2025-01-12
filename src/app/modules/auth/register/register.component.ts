import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {CommonModule, NgOptimizedImage} from '@angular/common';
import {notEmailValidator} from '../../../utils/validation-utils';

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
      username: ['', [Validators.required, notEmailValidator]],
      email: ['', [Validators.required, Validators.email]],
      firstName: ['', [Validators.required]],
      lastName: ['', [Validators.required]],
      password: ['', [
        Validators.required,
        Validators.minLength(8),
        Validators.pattern(/^(?=.*[a-z])(?=.*[A-Z])(?=.*\d)(?=.*[@$!%*?&])[A-Za-z\d@$!%*?&]{8,}$/)
      ]]
    });
  }

  async onSubmit() {
    if (this.registerForm.valid) {
      const {username, email, firstName, lastName, password} = this.registerForm.value;
      try {
        await this.authService.signUp(username, email, firstName, lastName, password);
        localStorage.setItem('pendingUsername', username);
        localStorage.setItem('pendingEmail', email);
        await this.router.navigate(['/confirmation-code']);
      } catch (error) {
        if (error instanceof Error) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        console.error(this.errorMessage)
      }
    }
  }

  signInWithGoogle() {
    this.authService.signInWithGoogle();
  }
}
