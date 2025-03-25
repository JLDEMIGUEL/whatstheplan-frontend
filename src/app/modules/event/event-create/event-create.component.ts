import {Component, ElementRef, ViewChild} from '@angular/core';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {EventsService} from '../../../services/events.service';
import {NgForOf, NgIf} from '@angular/common';
import {CITIES_LIST} from '../../../shared/constants/cities.constants';
import {Duration} from "luxon";
import {ACTIVITY_TYPE, ActivityCategory} from '../../../shared/constants/activities.constants';
import {Router} from '@angular/router';


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
  locations: string[] = CITIES_LIST;
  errorMessage: string | null = null;
  imageError: string | null = null;
  selectedFileName: string | null = null;
  imagePreviewUrl: string | ArrayBuffer | null = null;

  @ViewChild('fileInput') fileInput!: ElementRef<HTMLInputElement>;

  constructor(
    private fb: FormBuilder,
    private eventsService: EventsService,
    private router: Router
  ) {
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
      activityTypes: [[]],
      image: [null, [Validators.required]]
    });
  }

  onFileSelected(event: Event): void {
    const file = (event.target as HTMLInputElement).files?.[0];
    if (!file) {
      return;
    }

    const extension = file.name.split('.').pop()?.toLowerCase();
    if (!['png', 'jpg', 'jpeg'].includes(extension || '')) {
      this.imageError = 'Invalid image format. Allowed: PNG, JPG, JPEG.';
      this.imagePreviewUrl = null;
      this.eventForm.patchValue({image: null});
      return;
    }

    if (file.size > 5 * 1024 * 1024) {
      this.imageError = 'Image size exceeds 5MB.';
      this.imagePreviewUrl = null;
      this.eventForm.patchValue({image: null});
      return;
    }

    this.selectedFileName = file.name;
    this.imageError = null;
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
    const control = this.eventForm.get(field);
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

    this.eventsService.createEvent(formData).subscribe({
      next: (event) => {
        alert('Event created successfully!');
        this.router.navigate(['/events', event.id]);
      },
      error: (err) => {
        console.error('Failed to create event:', err);
        this.errorMessage = 'Failed to create the event. Please try again later.';
      }
    });
  }
}
