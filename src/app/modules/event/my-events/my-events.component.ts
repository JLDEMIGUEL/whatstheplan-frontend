import {Component, OnInit} from '@angular/core';
import {CommonModule} from '@angular/common';
import {FormsModule, ReactiveFormsModule} from '@angular/forms';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {EventsService} from '../../../services/events.service';
import {WTPEvent} from '../../../shared/model/events.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-my-events',
  standalone: true,
  imports: [CommonModule, FormsModule, ReactiveFormsModule],
  templateUrl: './my-events.component.html',
  styleUrls: ['./my-events.component.scss']
})
export class MyEventsComponent implements OnInit {
  s3BaseUrl: string = environment.s3BaseUrl;
  myEvents: WTPEvent[] = [];
  errorMessage!: string;
  isLoading: boolean = true;

  constructor(private eventsService: EventsService, private router: Router) {
  }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventsService.getMyEvents().subscribe({
      next: (events: WTPEvent[]) => {
        this.myEvents = events;
        this.isLoading = false;
      },
      error: (error: any) => {
        this.isLoading = false;
        if (error instanceof HttpErrorResponse) {
          this.errorMessage = error.error.reason || 'Failed to load events.';
        } else {
          this.errorMessage = 'An unexpected error occurred.';
        }
        console.error(this.errorMessage);
      }
    });
  }

  getImageUrl(s3key: string): string {
    return `${this.s3BaseUrl}${s3key}`;
  }

  async viewEventDetails(event: WTPEvent): Promise<void> {
    await this.router.navigate([`/events/${event.id}`]);
  }
}
