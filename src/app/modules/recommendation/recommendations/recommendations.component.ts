import {Component, OnDestroy, OnInit} from '@angular/core';
import {ApiService} from '../../../services/api.service';
import {NgForOf, NgIf} from '@angular/common';
import {AuthService} from '../../../services/auth.service';
import {Router} from '@angular/router';
import {map, take} from 'rxjs/operators';
import {Subscription} from 'rxjs';

@Component({
  selector: 'app-recommendations',
  templateUrl: './recommendations.component.html',
  imports: [
    NgIf,
    NgForOf
  ],
  standalone: true
})
export class RecommendationsComponent implements OnInit, OnDestroy {
  recommendations: any[] = [];
  errorMessage!: string;
  private subscription!: Subscription;

  constructor(private apiService: ApiService, private authService: AuthService, private router: Router) {
  }

  async ngOnInit() {
    await this.handleAuthCallback();

    this.subscription = this.authService.isLoggedIn$.pipe(
      take(1),
      map(isLoggedIn => {
        if (isLoggedIn) {
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
            console.error(this.errorMessage);
          }
          return;
        } else {
          return this.router.parseUrl('/welcome');
        }
      })
    ).subscribe();
  }

  ngOnDestroy() {
    if (this.subscription) {
      this.subscription.unsubscribe();
    }
  }

  private async handleAuthCallback(): Promise<void> {
    try {
      await this.authService.checkCurrentUser();

      this.router.navigate([], {
        queryParams: {},
        replaceUrl: true
      });
    } catch (error) {
      console.error('Authentication error:', error);
      this.router.navigate(['/login'], {queryParams: {error: 'Authentication failed'}});
    }
  }
}
