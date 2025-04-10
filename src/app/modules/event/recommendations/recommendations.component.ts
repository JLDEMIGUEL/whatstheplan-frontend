import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {EventsService} from '../../../services/events.service';
import {WTPEvent} from '../../../shared/model/events.model';
import {environment} from '../../../../environments/environment';
import {ACTIVITY_TYPE, ActivityCategory} from '../../../shared/constants/activities.constants';
import {CITIES_LIST} from '../../../shared/constants/cities.constants';

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
  today = new Date().toISOString().slice(0, 16);
  activityTypes: ActivityCategory[] = ACTIVITY_TYPE;
  availableCities: string[] = CITIES_LIST;
  durationDropdownOpen: boolean = false;
  dateTimeDropdownOpen: boolean = false;
  activityDropdownOpen: boolean = false;
  currentPage: number = 0;
  totalPages: number = 0;

  filters = {
    location: '',
    durationFrom: '',
    durationTo: '',
    dateTimeFrom: '',
    dateTimeTo: '',
    activityTypes: [] as string[]
  };

  constructor(private eventsService: EventsService, private router: Router) {
  }

  ngOnInit(): void {
    this.fetchEvents(false);
  }

  fetchEvents(withFilters: boolean, page: number = 0): void {
    this.isLoading = true;
    this.eventsService.getEvents(withFilters ? this.filters : {}, page).subscribe({
      next: (data) => {
        this.recommendations = data.content;
        this.totalPages = data.totalPages;
        this.currentPage = data.number;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error instanceof HttpErrorResponse) {
          this.errorMessage = error.error.reason || 'Failed to load events.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
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

  toggleDurationDropdown(): void {
    this.dateTimeDropdownOpen = false;
    this.activityDropdownOpen = false;
    this.durationDropdownOpen = !this.durationDropdownOpen;
  }

  closeDurationDropdown(): void {
    this.durationDropdownOpen = false;
  }

  toggleDateTimeDropdown(): void {
    this.durationDropdownOpen = false;
    this.activityDropdownOpen = false;
    this.dateTimeDropdownOpen = !this.dateTimeDropdownOpen;
  }

  closeDateTimeDropdown(): void {
    this.dateTimeDropdownOpen = false;
  }

  toggleActivityDropdown(): void {
    this.durationDropdownOpen = false;
    this.dateTimeDropdownOpen = false;
    this.activityDropdownOpen = !this.activityDropdownOpen;
  }

  closeActivityDropdown(): void {
    this.activityDropdownOpen = false;
  }

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

  getActivityTypesPlaceholder(): string {
    const charsLimit = 15;
    const selected = this.filters.activityTypes.join(', ');
    return selected.length > charsLimit ? selected.substring(0, charsLimit) + ' ...' : selected;
  }

  applyFilters(): void {
    this.durationDropdownOpen = false;
    this.dateTimeDropdownOpen = false;
    this.activityDropdownOpen = false;
    console.log('Applied filters:', this.filters);
    this.fetchEvents(true, 0);
  }

  goToPage(page: number): void {
    if (page >= 0 && page < this.totalPages) {
      this.fetchEvents(true, page);
    }
  }

  getMiddlePages(): number[] {
    const pages: number[] = [];
    const start = Math.max(1, this.currentPage - 1);
    const end = Math.min(this.totalPages - 2, this.currentPage + 1);

    for (let i = start; i <= end; i++) {
      pages.push(i);
    }

    return pages;
  }

}
