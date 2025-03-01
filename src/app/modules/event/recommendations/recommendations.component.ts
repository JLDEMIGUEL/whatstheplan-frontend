import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {EventsService} from '../../../services/events.service';
import {WTPEvent} from '../../../shared/model/events.model';
import {environment} from '../../../../environments/environment';
import {ACTIVITY_TYPE, ActivityCategory} from '../../../shared/constants/activities.constants';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  s3BaseUrl: string = environment.s3BaseUrl;
  recommendations: WTPEvent[] = [];
  errorMessage!: string;
  isLoading: boolean = true;

  // Filters object
  filters = {
    location: '',
    durationFrom: '',
    durationTo: '',
    dateTimeFrom: '',
    dateTimeTo: '',
    activityTypes: [] as string[]
  };

  // List of available cities for the location dropdown
  availableCities: string[] = [
    'Madrid',
    'Barcelona',
    'Sevilla',
    'Valencia',
    'Bilbao',
    'London',
    'Paris',
    'Berlin'
  ];

  // Activity types from the ACTIVITY_TYPE constant
  activityTypes: ActivityCategory[] = ACTIVITY_TYPE;

  // Dropdown toggles for range pickers
  durationDropdownOpen: boolean = false;
  dateTimeDropdownOpen: boolean = false;
  activityDropdownOpen: boolean = false;

  constructor(private eventsService: EventsService, private router: Router) {
  }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventsService.getEvents().subscribe({
      next: (events: WTPEvent[]) => {
        this.recommendations = events;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error instanceof HttpErrorResponse) {
          this.errorMessage = error.error.reason || 'Failed to load events.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        console.error(this.errorMessage);
      }
    });
  }

  getImageUrl(s3key: string): string {
    return `${this.s3BaseUrl}${s3key}`;
  }

  async viewEventDetails(event: WTPEvent): Promise<void> {
    await this.router.navigate([`/events/${event.id}`]);
  }

  async createNewEvent(): Promise<void> {
    await this.router.navigate(['/events-create']);
  }

  // Toggle methods for dropdowns
  toggleDurationDropdown(): void {
    this.dateTimeDropdownOpen = false;
    this.durationDropdownOpen = !this.durationDropdownOpen;
  }

  closeDurationDropdown(): void {
    this.durationDropdownOpen = false;
  }

  toggleDateTimeDropdown(): void {
    this.durationDropdownOpen = false;
    this.dateTimeDropdownOpen = !this.dateTimeDropdownOpen;
  }

  closeDateTimeDropdown(): void {
    this.dateTimeDropdownOpen = false;
  }

  // Toggle Activity Types Dropdown
  toggleActivityDropdown(): void {
    this.activityDropdownOpen = !this.activityDropdownOpen;
  }

  closeActivityDropdown(): void {
    this.activityDropdownOpen = false;
  }

  // Update filters when an activity checkbox is toggled
  onActivityChange(activity: string, event: any): void {
    if (event.target.checked) {
      if (!this.filters.activityTypes.includes(activity)) {
        this.filters.activityTypes.push(activity);
      }
    } else {
      const index = this.filters.activityTypes.indexOf(activity);
      if (index > -1) {
        this.filters.activityTypes.splice(index, 1);
      }
    }
  }

  // Helper to show selected activity types as a comma-separated string
  getSelectedActivityTypes(): string {
    return this.filters.activityTypes.join(', ');
  }

  // Stub for applying filters
  applyFilters(): void {
    console.log('Applied filters:', this.filters);
    // TODO: Call service to query events with these filters.
  }
}
