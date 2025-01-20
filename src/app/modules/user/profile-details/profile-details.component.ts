import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {UserService} from '../../../services/users.service';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {categorizePreferences, PreferenceCategory} from '../../../shared/constants/preferences.constants';

interface UserProfile {
  username: string;
  firstName: string;
  lastName: string;
  city: string;
  preferences: string[];
}

@Component({
  selector: 'app-profile-details',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './profile-details.component.html',
  styleUrls: ['./profile-details.component.scss']
})
export class ProfileDetailsComponent implements OnInit {
  userProfile!: UserProfile;
  preferencesSelected!: PreferenceCategory [];
  isLoading: boolean = true;
  errorMessage!: string;

  constructor(
    private userService: UserService,
    private router: Router
  ) {
  }

  ngOnInit(): void {
    this.fetchUserProfile();
  }

  fetchUserProfile(): void {
    this.userService.getUser().subscribe({
      next: (profile: UserProfile) => {
        this.userProfile = profile;
        this.preferencesSelected = categorizePreferences(profile.preferences)
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

  editProfile(): void {
    this.router.navigate(['/edit-profile']);
  }
}
