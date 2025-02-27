import {Component} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EventsService} from '../../../services/events.service';
import {NgForOf, NgIf} from '@angular/common';
import {CITIES_LIST} from '../../../shared/constants/cities.constants';
import {Duration} from "luxon";


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
  activityOptions: string[] = ['Sports', 'Music', 'Art', 'Technology', 'Food', 'Networking'];
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

  toggleActivityType(activity: string): void {
    const currentActivities = this.eventForm.get('activityTypes')?.value || [];
    if (currentActivities.includes(activity)) {
      this.eventForm.get('activityTypes')?.setValue(currentActivities.filter((a: string) => a !== activity));
    } else {
      this.eventForm.get('activityTypes')?.setValue([...currentActivities, activity]);
    }
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
}
