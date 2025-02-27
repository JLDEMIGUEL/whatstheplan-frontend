import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EventsService} from '../../../services/events.service';
import {NgForOf, NgIf} from '@angular/common';
import {CITIES_LIST} from '../../../shared/constants/cities.constants';
import {Duration} from "luxon";
import {ACTIVITY_TYPE, ActivityCategory} from '../../../shared/constants/activities.constants';


@Component({
  selector: 'app-events-create',
  templateUrl: './event-create.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./event-create.component.scss']
})
export class EventCreateComponent {
  eventForm: FormGroup;
  activityOptions: ActivityCategory[] = ACTIVITY_TYPE;
  errorMessage: string | null = null;
  locations: string[] = CITIES_LIST;

  constructor(private fb: FormBuilder, private eventsService: EventsService) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateTime: ['', [Validators.required]],
      duration: this.fb.group({
        hours: ['', [Validators.required, Validators.min(0)]],
        minutes: ['', [Validators.required, Validators.min(0), Validators.max(59)]]
      }),
      location: ['', [Validators.required]],
      capacity: [1, [Validators.required, Validators.min(1)]],
      activityTypes: [[]]
    });
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
      }
      console.log('Event Request:', eventRequest);


      this.eventsService.createEvent(eventRequest).subscribe({
        next: () => {
          alert('Event created successfully!');
          this.eventForm.reset();
        },
        error: (err) => {
          console.error('Failed to create event:', err);
          this.errorMessage = 'Failed to create the event. Please try again later.';
        }
      });
    }
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
}
