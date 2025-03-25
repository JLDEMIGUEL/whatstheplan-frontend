import {Component, ElementRef, OnInit, ViewChild} from '@angular/core';
import {AbstractControl, FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
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
  imageError: string | null = null;
  selectedFileName: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(private fb: FormBuilder, private eventsService: EventsService, private route: ActivatedRoute,
              private router: Router) {
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
      activityTypes: [[]],
      image: [null]
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

  formatDateForInput(dateTime: string): string {
    const date = new Date(dateTime);
    const pad = (n: number) => n.toString().padStart(2, '0');
    return `${date.getFullYear()}-${pad(date.getMonth() + 1)}-${pad(date.getDate())}T${pad(date.getHours())}:${pad(
      date.getMinutes())}`;
  }

  convertDurationToHoursMinutes(isoDuration: string): { hours: number; minutes: number } {
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
        activityTypes: selectedActivities.filter((p) => p !== activity)
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

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      this.imageError = null;
      this.selectedFileName = null;
      this.imagePreviewUrl = null;
      this.eventForm.patchValue({image: null});
      return;
    }

    // Validate extension
    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['png', 'jpg', 'jpeg'].includes(extension || '')) {
      this.imageError = 'Invalid image format. Allowed: PNG, JPG, JPEG.';
      this.selectedFileName = null;
      this.imagePreviewUrl = null;
      this.eventForm.patchValue({image: null});
      return;
    }

    // Validate size (up to 5MB)
    if (file.size > 5 * 1024 * 1024) {
      this.imageError = 'Image size exceeds 5MB.';
      this.selectedFileName = null;
      this.imagePreviewUrl = null;
      this.eventForm.patchValue({image: null});
      return;
    }

    this.imageError = null;
    this.selectedFileName = file.name;
    this.eventForm.patchValue({image: file});

    // Create a preview using FileReader
    const reader = new FileReader();
    reader.onload = () => {
      this.imagePreviewUrl = reader.result;
    };
    reader.readAsDataURL(file);
  }

  triggerFileInput(): void {
    this.fileInput.nativeElement.click();
  }

  onSubmit(): void {
    if (this.eventForm.invalid || this.imageError) {
      return;
    }

    const formValue = this.eventForm.value;
    const hours = formValue.duration.hours;
    const minutes = formValue.duration.minutes;
    const isoDuration = Duration.fromObject({hours, minutes}).toISO();

    const eventRequest = {
      title: formValue.title,
      description: formValue.description,
      dateTime: formValue.dateTime,
      duration: isoDuration,
      location: formValue.location,
      capacity: formValue.capacity,
      activityTypes: formValue.activityTypes
    };

    const formData = new FormData();
    formData.append(
      'event',
      new Blob([JSON.stringify(eventRequest)], {type: 'application/json'})
    );

    if (formValue.image) {
      formData.append('image', formValue.image);
    }

    // Update event via service
    this.eventsService.updateEvent(this.eventId, formData).subscribe({
      next: () => {
        alert('Event updated successfully!');
        this.router.navigate(['/events', this.eventId]);
      },
      error: (err) => {
        console.error('Failed to update event:', err);
        this.errorMessage = 'Failed to update the event. Please try again later.';
      }
    });
  }
}
