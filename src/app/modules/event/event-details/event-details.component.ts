import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WTPEventDetailed} from '../../../shared/model/events.model';
import {WTPReview} from '../../../shared/model/reviews.model';
import {EventsService} from '../../../services/events.service';
import {ReviewsService} from '../../../services/reviews.service';
import {environment} from '../../../../environments/environment';
import {NgForOf, NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  imports: [NgIf, NgForOf],
})
export class EventDetailsComponent implements OnInit {
  event!: WTPEventDetailed;
  reviews: WTPReview[] = [];
  errorMessage: string | null = null;
  isFull: boolean = false;
  s3BaseUrl: string = environment.s3BaseUrl;
  showDeletePopup = false;
  showReviewDeletePopup = false;
  reviewToDelete: string | null = null;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
    private reviewsService: ReviewsService,
    private router: Router,
    private snackBar: MatSnackBar
  ) {
  }

  ngOnInit(): void {
    const eventId = this.route.snapshot.paramMap.get('id');
    if (eventId) {
      this.fetchEventDetails(eventId);
    } else {
      this.errorMessage = 'Event ID not provided.';
    }
  }

  fetchEventDetails(eventId: string): void {
    this.eventsService.getEventById(eventId).subscribe({
      next: (event) => {
        this.event = event;
        this.isFull = event.registrations >= event.capacity;
        this.fetchEventReviews(event.organizerId);
      },
      error: (error) => {
        console.error('Error fetching event details:', error);
        this.errorMessage = 'Failed to load event details. Please try again later.';
      }
    });
  }

  fetchEventReviews(eventId: string): void {
    this.reviewsService.getReviewsByUserId(eventId).subscribe({
      next: (reviews) => {
        this.reviews = reviews;
      },
      error: (error) => {
        console.error('Error fetching reviews:', error);
        this.errorMessage = 'Failed to load reviews. Please try again later.';
      }
    });
  }

  getStarArray(rating: number): number[] {
    return Array(5).fill(0).map((_, index) => index + 1);
  }


  getImageUrl(imageKey: string): string {
    return `${this.s3BaseUrl}${imageKey}`;
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString('en-US', {
      year: 'numeric',
      month: 'long',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
      hour12: false
    });
  }

  onRegister(): void {
    if (this.event) {
      this.eventsService.registerToEvent(this.event.id).subscribe({
        next: () => {
          this.snackBar.open('Successfully registered to event.', 'OK', {
            duration: 3000,
            horizontalPosition: 'right',
            verticalPosition: 'top'
          });
          this.fetchEventDetails(this.event.id);
          this.event.isRegistered = true;//TODO REMOVE JUST FOR TESTS
        },
        error: (error) => {
          console.error('Error registering to event:', error);
          this.errorMessage = 'Failed to register to event. Please try again later.';
        }
      });
    }
  }

  onUpdate(): void {
    if (this.event) {
      this.router.navigate([`/events-update/${this.event.id}`]);
    }
  }

  openDelete(): void {
    this.showDeletePopup = true;
  }

  cancelDelete(): void {
    this.showDeletePopup = false;
  }

  confirmDelete(): void {
    if (!this.event) return;

    this.eventsService.deleteEventById(this.event.id).subscribe({
      next: () => {
        this.snackBar.open('Event successfully deleted.', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.showDeletePopup = false;
        this.router.navigate(['/']);
      },
      error: (error) => {
        console.error('Error deleting event:', error);
        this.errorMessage = 'Failed to delete event. Please try again later.';
        this.showDeletePopup = false;
      }
    });
  }

  onDeleteReview(reviewId: string): void {
    this.reviewToDelete = reviewId;
    this.showReviewDeletePopup = true;
  }

  cancelReviewDelete(): void {
    this.showReviewDeletePopup = false;
    this.reviewToDelete = null;
  }

  confirmReviewDelete(): void {
    if (!this.reviewToDelete) return;

    this.reviewsService.deleteReview(this.reviewToDelete).subscribe({
      next: () => {
        this.snackBar.open('Review deleted successfully.', 'OK', {
          duration: 3000,
          horizontalPosition: 'right',
          verticalPosition: 'top'
        });
        this.reviewToDelete = null;
        this.showReviewDeletePopup = false;
        this.fetchEventReviews(this.event.id);
      },
      error: (error) => {
        console.error('Error deleting review:', error);
        this.errorMessage = 'Failed to delete review. Please try again later.';
        this.reviewToDelete = null;
        this.showReviewDeletePopup = false;
      }
    });
  }
}
