import {Component, OnInit} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators,} from '@angular/forms';
import {ActivatedRoute, Router} from '@angular/router';
import {EventsService} from '../../../services/events.service';
import {NgForOf, NgIf} from '@angular/common';
import {CITIES_LIST} from '../../../shared/constants/cities.constants';
import {Duration} from 'luxon';
import {ACTIVITY_TYPE, ActivityCategory} from '../../../shared/constants/activities.constants';

@Component({
  selector: 'app-event-update',
  templateUrl: './event-update.component.html',
  styleUrls: ['./event-update.component.scss'],
  imports: [ReactiveFormsModule, NgIf, NgForOf],
  standalone: true // remove if using Angular modules
})
export class EventUpdateComponent implements OnInit {
  eventForm: FormGroup;
  activityOptions: ActivityCategory[] = ACTIVITY_TYPE;
  errorMessage: string | null = null;
  locations: string[] = CITIES_LIST;
  eventId!: string;

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private route: ActivatedRoute,
    private router: Router
  ) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateTime: ['', [Validators.required]],
      duration: this.fb.group({
        hours: ['', [Validators.required, Validators.min(0)]],
        minutes: ['', [Validators.required, Validators.min(0), Validators.max(59)]],
      }),
      location: ['', [Validators.required]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      activityTypes: [[]]
    });
  }

  ngOnInit(): void {
    // Get event ID from route params
    this.eventId = this.route.snapshot.paramMap.get('id')!;
    if (this.eventId) {
      this.fetchEventDetails(this.eventId);
    } else {
      this.errorMessage = 'Event ID not provided.';
    }
  }

  fetchEventDetails(eventId: string): void {
    this.eventsService.getEventById(eventId).subscribe({
      next: (event) => {
        // Patch form with event details
        this.eventForm.patchValue({
          title: event.title,
          description: event.description,
          dateTime: this.formatDateForInput(event.dateTime),
          duration: this.convertDurationToHoursMinutes(event.duration),
          location: event.location,
          capacity: event.capacity,
          activityTypes: event.activityTypes
        });
      },
      error: (error) => {
        console.error('Error fetching event details:', error);
        this.errorMessage = 'Failed to load event details. Please try again later.';
      }
    });
  }

  // Helper to format ISO datetime to value accepted by datetime-local input
  formatDateForInput(dateTime: string): string {
    const date = new Date(dateTime);
    // Format: YYYY-MM-DDTHH:mm (local)
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(date.getMinutes())}`;
  }

  // Convert ISO duration to an object with hours and minutes (assuming duration is in ISO format)
  convertDurationToHoursMinutes(isoDuration: string): { hours: number; minutes: number } {
    // Here you may want to use a library or custom logic.
    // For simplicity, we assume the duration is in the format "PT#H#M" (e.g., PT2H30M).
    const regex = /PT(?:(\d+)H)?(?:(\d+)M)?/;
    const match = regex.exec(isoDuration);
    const hours = match && match[1] ? parseInt(match[1], 10) : 0;
    const minutes = match && match[2] ? parseInt(match[2], 10) : 0;
    return {hours, minutes};
  }

  getErrorMessage(controlName: string): string {
    const control = this.eventForm.get(controlName);
    if (!control) return '';
    if (control.hasError('required')) return `${controlName} is required.`;
    if (control.hasError('minlength')) return `${controlName} must be at least 10 characters.`;
    if (control.hasError('min')) return `${controlName} must be greater than or equal to 0.`;
    if (control.hasError('max')) return `${controlName} must be less than 60.`;
    return '';
  }

  isFieldInvalid(field: string): boolean {
    const control: AbstractControl | null = this.eventForm.get(field);
    return !!(control && control.invalid && (control.dirty || control.touched));
  }

  togglePreference(activity: string): void {
    const selectedActivities = this.eventForm.get('activityTypes')?.value as string[];
    if (selectedActivities.includes(activity)) {
      this.eventForm.patchValue({
        activityTypes: selectedActivities.filter(p => p !== activity)
      });
    } else {
      this.eventForm.patchValue({
        activityTypes: [...selectedActivities, activity]
      });
    }
  }

  isPreferenceSelected(pref: string): boolean {
    return this.eventForm.get('activityTypes')?.value.includes(pref);
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const eventData = this.eventForm.value;
      const hours = eventData.duration.hours;
      const minutes = eventData.duration.minutes;
      const eventRequest = {
        title: eventData.title,
        description: eventData.description,
        dateTime: eventData.dateTime,
        duration: Duration.fromObject({hours, minutes}).toISO(),
        location: eventData.location,
        capacity: eventData.capacity,
        activityTypes: eventData.activityTypes,
      };

      console.log('Update Event Request:', eventRequest);

      this.eventsService.updateEvent(this.eventId, eventRequest).subscribe({
        next: () => {
          alert('Event updated successfully!');
          // Optionally navigate away or refresh the data
          this.router.navigate(['/events', this.eventId]);
        },
        error: (err) => {
          console.error('Failed to update event:', err);
          this.errorMessage = 'Failed to update the event. Please try again later.';
        }
      });
    }
  }
}
