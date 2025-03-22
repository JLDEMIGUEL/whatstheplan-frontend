import {Component, OnInit} from '@angular/core';
import {ActivatedRoute, Router} from '@angular/router';
import {WTPEvent} from '../../../shared/model/events.model';
import {EventsService} from '../../../services/events.service';
import {environment} from '../../../../environments/environment';
import {NgIf} from '@angular/common';
import {MatSnackBar} from '@angular/material/snack-bar';


@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  styleUrls: ['./event-details.component.scss'],
  imports: [NgIf],
})
export class EventDetailsComponent implements OnInit {
  event!: WTPEvent;
  errorMessage: string | null = null;
  isFull: boolean = false;
  s3BaseUrl: string = environment.s3BaseUrl;
  showDeletePopup = false;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService,
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
      },
      error: (error) => {
        console.error('Error fetching event details:', error);
        this.errorMessage = 'Failed to load event details. Please try again later.';
      }
    });
  }

  getImageUrl(imageKey: string): string {
    return `${this.s3BaseUrl}${imageKey}`;
  }

  formatDateTime(dateTime: string): string {
    return new Date(dateTime).toLocaleString();
  }

  onRegister(): void {
    if (this.event) {
      alert(`You have registered for "${this.event.title}"!`);
      // Implement actual registration logic here
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
        this.router.navigate(['/my-events']);
      },
      error: (error) => {
        console.error('Error deleting event:', error);
        this.errorMessage = 'Failed to delete event. Please try again later.';
        this.showDeletePopup = false;
      }
    });
  }
}
