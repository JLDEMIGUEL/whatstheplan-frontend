import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {fetchAuthSession} from 'aws-amplify/auth';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {WTPEvent, WTPEventDetailed} from '../shared/model/events.model';
import {v4 as uuidv4} from 'uuid';
import {Duration} from 'luxon';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = environment.api;

  private defaultEvents: WTPEventDetailed[] = [
    {
      id: 'd495f0c8-e246-44ec-84aa-5a9beadd55d9',
      title: 'Default Event 1',
      description: 'This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description. This is a default event description.',
      imageKey: 'events-1.png',
      dateTime: new Date().toISOString(),
      duration: 'PT2H',
      location: 'Madrid',
      capacity: 100,
      organizerId: uuidv4(),
      organizerUsername: 'organizer1',
      organizerEmail: 'organizer1@example.com',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      activityTypes: ['Soccer', 'Swimming'],
      registrations: 50,
      isOwnedByUser: true,
      isRegistered: false
    },
    {
      id: '679b766f-9aee-4358-b021-4c76500f18d7',
      title: 'Default Event 2',
      description: 'Another default event for fallback.',
      imageKey: 'events-1.png',
      dateTime: new Date().toISOString(),
      duration: 'PT3H',
      location: 'Barcelona',
      capacity: 150,
      organizerId: uuidv4(),
      organizerUsername: 'organizer2',
      organizerEmail: 'organizer2@example.com',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      activityTypes: ['Golf', 'Music'],
      registrations: 75,
      isOwnedByUser: false,
      isRegistered: true
    },
    {
      id: '1ea29b55-9838-4ccd-a717-abcbfa388d20',
      title: 'Default Event 3',
      description: 'This is a default event description.',
      imageKey: 'events-1.png',
      dateTime: new Date().toISOString(),
      duration: 'PT1H30M',
      location: 'Valencia',
      capacity: 80,
      organizerId: uuidv4(),
      organizerUsername: 'organizer3',
      organizerEmail: 'organizer3@example.com',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      activityTypes: ['Technology', 'Writing'],
      registrations: 60,
      isOwnedByUser: true,
      isRegistered: false
    },
    {
      id: '0367373d-a982-474d-94f0-3609243b5c28',
      title: 'Default Event 4',
      description: 'This is a default event description.',
      imageKey: 'events-1.png',
      dateTime: new Date().toISOString(),
      duration: 'PT1H30M',
      location: 'Valencia',
      capacity: 80,
      organizerId: uuidv4(),
      organizerUsername: 'organizer3',
      organizerEmail: 'organizer3@example.com',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      activityTypes: ['Wellness & Fitness', 'Gaming'],
      registrations: 60,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: 'e071d14e-8f03-40eb-8e1a-0d79fb73e789',
      title: 'Default Event 5',
      description: 'This is a default event description.',
      imageKey: 'events-1.png',
      dateTime: new Date().toISOString(),
      duration: 'PT1H30M',
      location: 'Valencia',
      capacity: 80,
      organizerId: uuidv4(),
      organizerUsername: 'organizer3',
      organizerEmail: 'organizer3@example.com',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      activityTypes: ['Volunteering', 'Cooking'],
      registrations: 60,
      isOwnedByUser: true,
      isRegistered: false
    },
    {
      id: '6baa9a21-f1b9-4960-8e79-69bb6b2632aa',
      title: 'Default Event 6',
      description: 'This is a default event description.',
      imageKey: 'events-1.png',
      dateTime: new Date().toISOString(),
      duration: 'PT1H30M',
      location: 'Valencia',
      capacity: 80,
      organizerId: uuidv4(),
      organizerUsername: 'organizer3',
      organizerEmail: 'organizer3@example.com',
      createdDate: new Date().toISOString(),
      lastModifiedDate: new Date().toISOString(),
      activityTypes: ['Baking', 'Martial Arts'],
      registrations: 80,
      isOwnedByUser: false,
      isRegistered: false
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

  getMyRegistrations(): Observable<WTPEvent[]> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<WTPEvent[]>(`${this.baseUrl}/events/registration`, {
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

  registerToEvent(eventId: string): Observable<void> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<void>(`${this.baseUrl}/events/registration/${eventId}`, null, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<void>) => response.body as void),
      catchError((error) => {
        console.error(`Error registering to event ${eventId}:`, error);
        // TODO REPLACE BY        return throwError(() => error);
        return of(void 0);
      })
    );
  }


  getEventById(eventId: string): Observable<WTPEventDetailed> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<WTPEventDetailed>(`${this.baseUrl}/events/${eventId}`, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<WTPEventDetailed>) => response.body as WTPEventDetailed),
      catchError((error) => {
        console.error('Error fetching event details:', error);
        // TODO REPLACE BY        return throwError(error);
        return of(this.defaultEvents.find(event => event.id === eventId) || this.defaultEvents[0]);
      })
    );
  }

  deleteEventById(eventId: string): Observable<void> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.delete<void>(`${this.baseUrl}/events/${eventId}`, {
          headers,
          withCredentials: true
        })
      ),
      catchError((error) => {
        console.error(`Error deleting event with ID ${eventId}:`, error)
        // TODO REPLACE BY        return throwError(() => error);
        return of(void 0);
      })
    );
  }


  createEvent(formData: FormData): Observable<WTPEvent> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) => {
        const finalHeaders = headers.delete('Content-Type');
        return this.http.post<WTPEvent>(`${this.baseUrl}/events`, formData, {
          headers: finalHeaders,
          observe: 'response',
          withCredentials: true
        });
      }),
      map((response: HttpResponse<WTPEvent>) => response.body as WTPEvent),
      catchError((error) => {
        console.error('Error creating event:', error);
        // TODO REPLACE BY        return throwError(error);
        return of(this.defaultEvents[0]);
      })
    );
  }

  updateEvent(eventId: string, formData: FormData): Observable<WTPEvent> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) => {
        const finalHeaders = headers.delete('Content-Type');
        return this.http.put<WTPEvent>(`${this.baseUrl}/events/${eventId}`, formData, {
          headers: finalHeaders,
          observe: 'response',
          withCredentials: true
        })
      }),
      map((response: HttpResponse<WTPEvent>) => response.body as WTPEvent),
      catchError((error) => {
        console.error('Error updating event:', error);
        // TODO REPLACE BY        return throwError(error);
        return of(this.defaultEvents.find(event => event.id === eventId) || this.defaultEvents[0]);
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
