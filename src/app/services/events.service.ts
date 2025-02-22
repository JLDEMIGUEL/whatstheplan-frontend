import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {fetchAuthSession} from 'aws-amplify/auth';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {WTPEvent} from '../shared/model/events.model';
import {v4 as uuidv4} from 'uuid';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = environment.api;

  private defaultEvents: WTPEvent[] = [
    {
      id: uuidv4(),
      title: 'Default Event 1',
      description: 'This is a default event description.',
      imageKey: 'events-1.png',
      dateTime: new Date().toISOString(),
      duration: 'PT2H',
      location: 'Madrid, Spain',
      capacity: 100,
      organizerId: uuidv4(),
      organizerUsername: 'organizer1',
      organizerEmail: 'organizer1@example.com',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      activityTypes: ['Workshop', 'Networking'],
      registrations: 50,
    },
    {
      id: uuidv4(),
      title: 'Default Event 2',
      description: 'Another default event for fallback.',
      imageKey: 'events-1.png',
      dateTime: new Date().toISOString(),
      duration: 'PT3H',
      location: 'Barcelona, Spain',
      capacity: 150,
      organizerId: uuidv4(),
      organizerUsername: 'organizer2',
      organizerEmail: 'organizer2@example.com',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      activityTypes: ['Seminar', 'Exhibition'],
      registrations: 75,
    },
    {
      id: uuidv4(),
      title: 'Default Event 3',
      description: 'This is a default event description.',
      imageKey: 'events-1.png',
      dateTime: new Date().toISOString(),
      duration: 'PT1H30M',
      location: 'Valencia, Spain',
      capacity: 80,
      organizerId: uuidv4(),
      organizerUsername: 'organizer3',
      organizerEmail: 'organizer3@example.com',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      activityTypes: ['Conference', 'Meetup'],
      registrations: 60,
    },
  ];

  constructor(private http: HttpClient) {
  }

  getEvents(): Observable<WTPEvent[]> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<WTPEvent[]>(`${this.baseUrl}/events`, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<WTPEvent[]>) => response.body as WTPEvent[]),
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        // TODO REPLACE BY        return throwError(error);
        return of(this.defaultEvents);
      })
    );
  }

  getEventById(eventId: string): Observable<WTPEvent> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<WTPEvent>(`${this.baseUrl}/events/${eventId}`, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<WTPEvent>) => response.body as WTPEvent),
      catchError((error) => {
        console.error('Error fetching event details:', error);
        // TODO REPLACE BY        return throwError(error);
        return of(this.defaultEvents[0]);
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
