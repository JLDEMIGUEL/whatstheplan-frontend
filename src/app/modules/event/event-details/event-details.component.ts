import {Component, OnInit} from '@angular/core';
import {ActivatedRoute} from '@angular/router';
import {WTPEvent} from '../../../shared/model/events.model';
import {EventsService} from '../../../services/events.service';
import {environment} from '../../../../environments/environment';
import {NgIf} from '@angular/common';

@Component({
  selector: 'app-event-details',
  templateUrl: './event-details.component.html',
  imports: [
    NgIf
  ],
  styleUrls: ['./event-details.component.scss']
})
export class EventDetailsComponent implements OnInit {
  event!: WTPEvent;
  errorMessage: string | null = null;
  isFull: boolean = false;

  s3BaseUrl: string = environment.s3BaseUrl;

  constructor(
    private route: ActivatedRoute,
    private eventsService: EventsService
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
      // Here you can implement actual registration logic
    }
  }
}
