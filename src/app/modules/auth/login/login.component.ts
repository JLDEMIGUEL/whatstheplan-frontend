import { Component, OnInit } from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import { AuthService } from '../../../services/auth.service';
import { Router } from '@angular/router';
import {CommonModule} from '@angular/common';

@Component({
  selector: 'app-login',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './login.component.html',
  styleUrl: './login.component.scss'
})
export class LoginComponent implements OnInit {
  loginForm!: FormGroup;
  errorMessage!: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {}

  ngOnInit() {
    this.loginForm = this.fb.group({
      username: ['', Validators.required],
      password: ['', Validators.required]
    });
  }

  async onSubmit() {
    if (this.loginForm.valid) {
      const { username, password } = this.loginForm.value;
      try {
        await this.authService.signIn(username, password);
        await this.router.navigate(['/']);
      } catch (error) {
        if (error instanceof Error) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        console.log(this.errorMessage)
      }
    }
  }
}
