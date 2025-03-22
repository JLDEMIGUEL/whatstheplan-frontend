import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {fetchAuthSession} from 'aws-amplify/auth';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {WTPEvent, WTPEventRequest} from '../shared/model/events.model';
import {v4 as uuidv4} from 'uuid';
import {Duration} from 'luxon';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = environment.api;

  private defaultEvents: WTPEvent[] = [
    {
      id: 'd495f0c8-e246-44ec-84aa-5a9beadd55d9',
      title: 'Default Event 1',
      description: 'This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description.',
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
      activityTypes: ['Soccer', 'Swimming'],
      registrations: 50,
      isOwnedByUser: true,
    },
    {
      id: '679b766f-9aee-4358-b021-4c76500f18d7',
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
      activityTypes: ['Golf', 'Music'],
      registrations: 75,
      isOwnedByUser: false,
    },
    {
      id: '1ea29b55-9838-4ccd-a717-abcbfa388d20',
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
      activityTypes: ['Technology', 'Writing'],
      registrations: 60,
      isOwnedByUser: true,
    },
    {
      id: '0367373d-a982-474d-94f0-3609243b5c28',
      title: 'Default Event 4',
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
      activityTypes: ['Wellness & Fitness', 'Gaming'],
      registrations: 60,
      isOwnedByUser: false,
    },
    {
      id: 'e071d14e-8f03-40eb-8e1a-0d79fb73e789',
      title: 'Default Event 5',
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
      activityTypes: ['Volunteering', 'Cooking'],
      registrations: 60,
      isOwnedByUser: true,
    },
    {
      id: '6baa9a21-f1b9-4960-8e79-69bb6b2632aa',
      title: 'Default Event 6',
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
      activityTypes: ['Baking', 'Martial Arts'],
      registrations: 60,
      isOwnedByUser: false,
    }
  ];

  constructor(private http: HttpClient) {
  }

  getEvents(filters: {
    durationFrom?: string,
    durationTo?: string,
    dateTimeFrom?: string,
    dateTimeTo?: string,
    activityTypes?: string[]
  } = {
    durationFrom: "",
    durationTo: "",
    dateTimeFrom: "",
    dateTimeTo: "",
    activityTypes: []
  }): Observable<WTPEvent[]> {
    let params = new HttpParams();

    if (filters.durationFrom) {
      params = params.set('durationFrom', Duration.fromObject({hours: Number(filters.durationFrom)}).toISO());
    }
    if (filters.durationTo) {
      params = params.set('durationTo', Duration.fromObject({hours: Number(filters.durationTo)}).toISO());
    }
    if (filters.dateTimeFrom) {
      params = params.set('dateTimeFrom', filters.dateTimeFrom);
    }
    if (filters.dateTimeTo) {
      params = params.set('dateTimeTo', filters.dateTimeTo);
    }
    if (filters.activityTypes && filters.activityTypes.length > 0) {
      params = params.set('activityTypes', filters.activityTypes.join(','));
    }

    return this.addAuthHeaders().pipe(
      switchMap(headers =>
        this.http.get<WTPEvent[]>(`${this.baseUrl}/events/search`, {
          headers,
          params,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<WTPEvent[]>) => response.body as WTPEvent[]),
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        return of(this.defaultEvents);
      })
    );
  }


  getMyEvents(): Observable<WTPEvent[]> {
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
        console.error('Error fetching event details:', error);
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
        return of(this.defaultEvents.find(event => event.id === eventId) || this.defaultEvents[0]);
      })
    );
  }

  createEvent(eventData: WTPEventRequest) {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post(`${this.baseUrl}/events`, eventData, {
          headers,
          withCredentials: true
        })
      )
    );
  }

  updateEvent(eventId: string, eventData: WTPEventRequest) {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put(`${this.baseUrl}/events/${eventId}`, eventData, {
          headers,
          withCredentials: true
        })
      )
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
