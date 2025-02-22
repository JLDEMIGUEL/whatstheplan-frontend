import {Component, OnInit} from '@angular/core';
import {NgForOf, NgIf} from '@angular/common';
import {Router} from '@angular/router';
import {HttpErrorResponse} from '@angular/common/http';
import {EventsService} from '../../../services/events.service';
import {WTPEvent} from '../../../shared/model/events.model';
import {environment} from '../../../../environments/environment';

@Component({
  selector: 'app-recommendations',
  standalone: true,
  imports: [
    NgIf,
    NgForOf
  ],
  templateUrl: './recommendations.component.html',
  styleUrls: ['./recommendations.component.scss']
})
export class RecommendationsComponent implements OnInit {
  s3BaseUrl: string = environment.s3BaseUrl;
  recommendations: WTPEvent[] = [];
  errorMessage!: string;
  isLoading: boolean = true;

  constructor(private eventsService: EventsService, private router: Router) {
  }

  ngOnInit(): void {
    this.fetchEvents();
  }

  fetchEvents(): void {
    this.eventsService.getEvents().subscribe({
      next: (events: WTPEvent[]) => {
        this.recommendations = events;
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

  viewEventDetails(event: WTPEvent): void {
  }
}
