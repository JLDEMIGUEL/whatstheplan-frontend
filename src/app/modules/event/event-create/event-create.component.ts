import {Component} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EventsService} from '../../../services/events.service';
import {NgForOf, NgIf} from '@angular/common';

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

  constructor(private fb: FormBuilder, private eventsService: EventsService) {
    this.eventForm = this.fb.group({
      title: ['', [Validators.required]],
      description: ['', [Validators.required, Validators.minLength(10)]],
      dateTime: ['', [Validators.required]],
      duration: [1, [Validators.required, Validators.min(1)]],
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
    if (control?.hasError('required')) return `${controlName} is required.`;
    if (control?.hasError('minlength')) return `${controlName} must be at least 10 characters.`;
    if (control?.hasError('min')) return `${controlName} must be greater than 0.`;
    return '';
  }

  onSubmit(): void {
    if (this.eventForm.valid) {
      const eventData = this.eventForm.value;
      console.log('Event Data:', eventData);

      this.eventsService.createEvent(eventData).subscribe({
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
}
