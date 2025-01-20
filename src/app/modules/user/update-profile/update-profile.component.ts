import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {CommonModule} from '@angular/common';
import {UserService} from '../../../services/users.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {notEmailValidator} from '../../../utils/validation-utils';
import {CITIES_LIST} from '../../../shared/constants/cities.constants';
import {PreferenceCategory, PREFERENCES_LIST} from '../../../shared/constants/preferences.constants';
import {UserProfile} from '../../../shared/model/users-profile.model';

@Component({
  selector: 'app-profile-update',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './update-profile.component.html',
  styleUrls: ['./update-profile.component.scss']
})
export class UpdateProfileComponent implements OnInit {
  cities: string[] = CITIES_LIST;
  preferencesList: PreferenceCategory[] = PREFERENCES_LIST;
  profileUpdateForm!: FormGroup;
  errorMessage!: string;
  isLoading: boolean = true;

  constructor(
    private fb: FormBuilder,
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.initializeForm();
    this.fetchUserProfile();
  }

  initializeForm(): void {
    this.profileUpdateForm = this.fb.group({
      username: ['', [Validators.required, notEmailValidator]],
      firstName: ['', Validators.required],
      lastName: ['', Validators.required],
      city: ['', Validators.required],
      preferences: [[]]
    });
  }

  fetchUserProfile(): void {
    this.userService.getUser().subscribe({
      next: (profile: UserProfile) => {
        this.profileUpdateForm.patchValue({
          username: profile.username,
          firstName: profile.firstName,
          lastName: profile.lastName,
          city: profile.city,
          preferences: profile.preferences
        });
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error instanceof HttpErrorResponse) {
          this.errorMessage = error.error.reason || 'Failed to load profile.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        console.error(this.errorMessage);
      }
    });
  }

  togglePreference(pref: string): void {
    const selectedPrefs = this.profileUpdateForm.get('preferences')?.value as string[];
    if (selectedPrefs.includes(pref)) {
      this.profileUpdateForm.patchValue({
        preferences: selectedPrefs.filter(p => p !== pref)
      });
    } else {
      this.profileUpdateForm.patchValue({
        preferences: [...selectedPrefs, pref]
      });
    }
  }

  isPreferenceSelected(pref: string): boolean {
    return this.profileUpdateForm.get('preferences')?.value.includes(pref);
  }

  async onSubmit() {
    if (this.profileUpdateForm.valid) {
      this.userService.updateUser(this.profileUpdateForm.value).subscribe({
        next: (response) => {
          this.router.navigate(['/profile']);
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
