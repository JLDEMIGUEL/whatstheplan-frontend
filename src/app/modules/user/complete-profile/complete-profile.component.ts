import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {notEmailValidator} from '../../../utils/validation-utils';
import {UserService} from '../../../services/users.service';
import {HttpErrorResponse} from '@angular/common/http';
import {CITIES_LIST} from '../../../shared/constants/cities.constants';
import {PREFERENCES_LIST} from '../../../shared/constants/preferences.constants';

interface PreferenceCategory {
  category: string;
  preferences: string[];
}

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {
  cities: string[] = CITIES_LIST;
  preferencesList: PreferenceCategory[] = PREFERENCES_LIST;

  completeProfileForm!: FormGroup;
  errorMessage!: string;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit() {
    this.completeProfileForm = this.fb.group({
      username: ['', [Validators.required, notEmailValidator]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      city: ['', Validators.required],
      preferences: [[]]
    });
  }

  togglePreference(pref: string): void {
    const selectedPrefs = this.completeProfileForm.get('preferences')?.value as string[];
    if (selectedPrefs.includes(pref)) {
      this.completeProfileForm.patchValue({
        preferences: selectedPrefs.filter(p => p !== pref)
      });
    } else {
      this.completeProfileForm.patchValue({
        preferences: [...selectedPrefs, pref]
      });
    }
  }

  isPreferenceSelected(pref: string): boolean {
    return this.completeProfileForm.get('preferences')?.value.includes(pref);
  }

  async onSubmit() {
    if (this.completeProfileForm.valid) {
      console.log(this.completeProfileForm.value)
      this.userService.createUser(this.completeProfileForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/']);
        },
        error: (error) => {
          if (error instanceof HttpErrorResponse) {
            this.errorMessage = error.error.reason;
          } else {
            this.errorMessage = 'An unexpected error occurred.';
          }
          console.error(this.errorMessage);
        }
      });
    }
  }
}
