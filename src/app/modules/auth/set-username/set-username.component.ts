import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {notEmailValidator} from '../../../utils/validation-utils';

@Component({
  selector: 'app-setUsername',
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './set-username.component.html',
  styleUrl: './set-username.component.scss'
})
export class SetUsernameComponent implements OnInit {
  setUsernameForm!: FormGroup;
  errorMessage!: string;

  constructor(private fb: FormBuilder, private authService: AuthService, private router: Router) {
  }

  ngOnInit() {
    this.setUsernameForm = this.fb.group({
      username: ['', [Validators.required, notEmailValidator]]
    });
  }

  async onSubmit() {
    if (this.setUsernameForm.valid) {
      const {username} = this.setUsernameForm.value;
      try {
        await this.authService.setUsername(username);
        this.router.navigate(['/']);
      } catch (error) {
        if (error instanceof Error) {
          this.errorMessage = error.message;
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        console.error(this.errorMessage);
      }
    }
  }
}
