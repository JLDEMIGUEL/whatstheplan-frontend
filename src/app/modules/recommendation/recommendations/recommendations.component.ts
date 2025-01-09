import { Component, OnInit } from '@angular/core';
import { ApiService } from '../../../services/api.service';
import {NgForOf, NgIf} from '@angular/common';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  imports: [
    NgIf,
    NgForOf
  ]
})
export class RecommendationsComponent implements OnInit {
  recommendations: any[] = [];
  errorMessage!: string;

  constructor(private apiService: ApiService) {}

  async ngOnInit() {
    try {
      this.recommendations = [{
        name: "EVENT",
        description: "DESCRIPTION"
      }];
    } catch (error) {
      if (error instanceof Error) {
        this.errorMessage = error.message;
      } else {
        this.errorMessage = 'An unexpected error occurred.';
      }
      console.log(this.errorMessage)
    }
  }
}
