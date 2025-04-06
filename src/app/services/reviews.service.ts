import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {fetchAuthSession} from 'aws-amplify/auth';
import {Observable, of} from 'rxjs';
import {environment} from '../../environments/environment';
import {WTPReview} from '../shared/model/reviews.model';
import {catchError, map, switchMap} from 'rxjs/operators';


@Injectable({
  providedIn: 'root'
})
export class ReviewsService {
  private baseUrl = environment.api;

  private defaultReviews: WTPReview[] = [
    {
      id: "8e1f1c6c-dc98-4d0b-b7db-61f5f1cf6f1f",
      raterUsername: "melodyMia",
      username: "organizer1",
      rating: 5,
      text: "Alex ran the event flawlessly. Everything was on time and super professional.",
      createdAt: new Date().toISOString(),
      isOwnedByUser: false,
    },
    {
      id: "c3a82cbb-2236-4685-a658-1c9ffcb18aa7",
      raterUsername: "grooveGreg",
      username: "organizer1",
      rating: 4,
      text: "Great communication and support before and during the event. Highly recommend!",
      createdAt: new Date().toISOString(),
      isOwnedByUser: true,
    },
    {
      id: "0d3644b6-97f9-4b8b-93b2-734ee70df42f",
      raterUsername: "rhythmRae",
      username: "organizer1",
      rating: 4,
      text: "Some tech hiccups early on, but Alex handled it like a pro. Respect!",
      createdAt: new Date().toISOString(),
      isOwnedByUser: false,
    },
    {
      id: "6fd7c911-69d3-43cf-8b57-442a4c6237a5",
      raterUsername: "chordCarl",
      username: "organizer1",
      rating: 5,
      text: "Smoothest setup I've ever experienced. Everything was just ready to go.",
      createdAt: new Date().toISOString(),
      isOwnedByUser: false,
    },
    {
      id: "3d8b878a-bce3-4d8e-8b94-18b1aa9fc0c1",
      raterUsername: "bassistBea",
      username: "organizer1",
      rating: 4,
      text: "From check-in to teardown, Alex was on top of everything. Super friendly too.",
      createdAt: new Date().toISOString(),
      isOwnedByUser: false,
    },
    {
      id: "9c5de7f3-b709-4f00-83d3-1deaad77a9f9",
      raterUsername: "lofiLana",
      username: "organizer1",
      rating: 4,
      text: "The venue was dope but the schedule was a bit tight. Still a great experience!",
      createdAt: new Date().toISOString(),
      isOwnedByUser: true,
    },
    {
      id: "f21cbf4c-f7f4-46f6-9f76-65a6a1fc309b",
      raterUsername: "synthSam",
      username: "organizer1",
      rating: 5,
      text: "Impeccable organization. Sam’s setup time was cut in half thanks to Alex.",
      createdAt: new Date().toISOString(),
      isOwnedByUser: false,
    },
    {
      id: "5ef34302-03c9-4c7a-a8eb-9d2677e49f71",
      raterUsername: "drummerDan",
      username: "organizer1",
      rating: 4,
      text: "Really appreciated the clear instructions and quick responses.",
      createdAt: new Date().toISOString(),
      isOwnedByUser: false,
    },
    {
      id: "12c660e4-b4d1-48f5-8b10-d9b209b5a6c0",
      raterUsername: "vocalVic",
      username: "organizer1",
      rating: 5,
      text: "Honestly the best event organizer I’ve worked with. Super smooth from start to finish.",
      createdAt: new Date().toISOString(),
      isOwnedByUser: false,
    },
    {
      id: "a7417c38-0459-4cb9-bca6-289d0b404cf0",
      raterUsername: "ambientAmy",
      username: "organizer1",
      rating: 3,
      text: "A few minor delays but overall the event felt seamless. Great host!",
      createdAt: new Date().toISOString(),
      isOwnedByUser: true,
    },
  ];


  constructor(private http: HttpClient) {
  }


  getReviewById(id: string): Observable<WTPReview> {
    return this.addAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<WTPReview>(`${this.baseUrl}/reviews/${id}`, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<WTPReview>) => response.body as WTPReview),
      catchError((error) => {
        console.error(`Error fetching review with ID ${id}:`, error);
        // TODO REPLACE BY        return throwError(error);
        return of(this.defaultReviews[0]);
      })
    );
  }

  getReviewsByUserId(userId: string): Observable<WTPReview[]> {
    return this.addAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<WTPReview[]>(`${this.baseUrl}/reviews/user/${userId}`, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<WTPReview[]>) => response.body as WTPReview[]),
      catchError((error) => {
        console.error(`Error fetching reviews for user ${userId}:`, error);
        // TODO REPLACE BY        return throwError(error);
        return of(this.defaultReviews);
      })
    );
  }

  createReview(request: any): Observable<WTPReview> {
    return this.addAuthHeaders().pipe(
      switchMap(headers =>
        this.http.post<WTPReview>(`${this.baseUrl}/reviews`, request, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<WTPReview>) => response.body as WTPReview),
      catchError((error) => {
        console.error('Error creating review:', error);
        // TODO REPLACE BY        return throwError(error);
        return of(this.defaultReviews[0]);
      })
    );
  }

  deleteReview(id: string): Observable<void> {
    return this.addAuthHeaders().pipe(
      switchMap(headers =>
        this.http.delete<void>(`${this.baseUrl}/reviews/${id}`, {
          headers,
          withCredentials: true
        })
      ),
      catchError((error) => {
        console.error(`Error deleting review with ID ${id}:`, error);
        // TODO REPLACE BY        return throwError(() => error);
        return of(void 0);
      })
    );
  }


  private addAuthHeaders(): Observable<HttpHeaders> {
    return new Observable((observer) => {
      fetchAuthSession()
        .then((session) => {
          const token = session?.tokens?.accessToken?.toString() || '';
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          });
          observer.next(headers);
          observer.complete();
        })
        .catch((error) => {
          console.error('Error fetching auth session:', error);
          observer.error(error);
        });
    });
  }
}
