import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {FormBuilder, FormGroup, ReactiveFormsModule, Validators} from '@angular/forms';
import {ReviewsService} from '../../../services/reviews.service';
import {MatSnackBar} from '@angular/material/snack-bar';
import {EventsService} from '../../../services/events.service';
import {WTPEventDetailed} from '../../../shared/model/events.model';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-review-event',
  templateUrl: './review-event.component.html',
  imports: [
    ReactiveFormsModule,
    NgIf,
    NgForOf
  ],
  styleUrls: ['./review-event.component.scss']
})
export class ReviewEventComponent implements OnInit {
  event!: WTPEventDetailed;
  reviewForm!: FormGroup;
  errorMessage: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private fb: FormBuilder,
    private reviewsService: ReviewsService,
    private eventsService: EventsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
    this.initializeForm();
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id') || '';
    if (eventId) {
      this.fetchEventDetails(eventId);
    } else {
      this.errorMessage = 'Event ID not provided.';
    }
  }

  initializeForm(): void {
    this.reviewForm = this.fb.group({
      rating: [0, [Validators.required, Validators.min(1), Validators.max(5)]],
      text: ['', [Validators.required, Validators.minLength(10), Validators.maxLength(1000)]]
    });
  }

  fetchEventDetails(eventId: string): void {
    this.eventsService.getEventById(eventId).subscribe({
      next: (event) => {
        this.event = event;
      },
      error: (error) => {
        console.error('Error fetching event details:', error);
        this.errorMessage = 'Failed to load event details. Please try again later.';
      }
    });
  }

  setRating(value: number): void {
    this.reviewForm.get('rating')?.setValue(value);
  }

  submitReview(): void {
    if (this.reviewForm.invalid) {
      this.errorMessage = 'Please complete the form correctly.';
      return;
    }

    const reviewRequest = {
      userId: this.event.organizerId,
      rating: this.reviewForm.value.rating,
      text: this.reviewForm.value.text
    };

    this.reviewsService.createReview(reviewRequest).subscribe({
      next: () => {
        this.snackBar.open('Review submitted successfully!', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.router.navigate([`/event-details/${this.event.id}`]);
      },
      error: (error) => {
        console.error('Error submitting review:', error);
        this.errorMessage = 'Failed to submit review. Please try again later.';
      }
    });
  }
}
