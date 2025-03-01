import {Component, OnInit} from '@angular/core';
import {CommonModule, NgForOf, NgIf} from '@angular/common';
import {FormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {EventsService} from '../../../services/events.service';
import {WTPEvent} from '../../../shared/model/events.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [
    NgIf,
    NgForOf,
    FormsModule,
    CommonModule
  ],
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

  // Example list of activity types
  availableActivityTypes: string[] = ['Music', 'Sports', 'Arts', 'Technology'];

  // Dropdown toggles for range pickers
  durationDropdownOpen: boolean = false;
  dateTimeDropdownOpen: boolean = false;

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

  // Method to toggle the duration dropdown
  toggleDurationDropdown(): void {
    this.dateTimeDropdownOpen = false;
    this.durationDropdownOpen = !this.durationDropdownOpen;
  }

  // Close duration dropdown (e.g., after selection)
  closeDurationDropdown(): void {
    this.durationDropdownOpen = false;
  }

  // Method to toggle the datetime dropdown
  toggleDateTimeDropdown(): void {
    this.durationDropdownOpen = false;
    this.dateTimeDropdownOpen = !this.dateTimeDropdownOpen;
  }

  // Close datetime dropdown (e.g., after selection)
  closeDateTimeDropdown(): void {
    this.dateTimeDropdownOpen = false;
  }

  // Stub for applying filters
  applyFilters(): void {
    console.log('Applied filters:', this.filters);
    // TODO: Call service to query events with these filters.
  }
}
