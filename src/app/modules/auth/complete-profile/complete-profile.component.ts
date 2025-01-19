import {Component, OnInit} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {Router} from '@angular/router';
import {CommonModule} from '@angular/common';
import {notEmailValidator} from '../../../utils/validation-utils';
import {UserService} from '../../../services/users.service';

@Component({
  selector: 'app-complete-profile',
  standalone: true,
  imports: [CommonModule, ReactiveFormsModule],
  templateUrl: './complete-profile.component.html',
  styleUrls: ['./complete-profile.component.scss']
})
export class CompleteProfileComponent implements OnInit {
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

  async onSubmit() {
    if (this.completeProfileForm.valid) {
      try {
        await this.userService.createUser(this.completeProfileForm.value);
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

  cities: string[] = [
    'Madrid',
    'Barcelona',
    'Sevilla',
    'Valencia',
    'Bilbao',
    'London',
    'Paris',
    'Berlin'
  ];

  preferencesList: string[] = [
    'Soccer',
    'Basketball',
    'Tennis',
    'Swimming',
    'Running',
    'Cycling',
    'Golf',
    'Baseball',
    'Martial Arts',
    'Yoga',
    'Snowboarding',
    'Climbing',
    'Music',
    'Arts',
    'Technology',
    'Education',
    'Outdoors',
    'Food & Dining',
    'Social Events',
    'Wellness & Fitness',
    'Networking',
    'Gaming',
    'Travel',
    'Volunteering',
    'Shopping',
    'Reading',
    'Writing',
    'Photography',
    'Gardening',
    'Cooking',
    'Baking',
    'Fashion & Style',
    'Film & Movies',
    'Fitness & Bodybuilding',
    'Meditation & Mindfulness',
    'Fishing',
    'Hiking',
    'Board Games',
    'Dancing',
    'Language Learning',
    'Painting'
  ];

}
