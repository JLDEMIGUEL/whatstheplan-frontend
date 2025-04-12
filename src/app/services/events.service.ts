import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpParams, HttpResponse} from '@angular/common/http';
import {fetchAuthSession} from 'aws-amplify/auth';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {WTPEvent, WTPEventDetailed} from '../shared/model/events.model';
import {Duration} from 'luxon';


@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = environment.api;

  private defaultTotalPages: number = 10;
  private defaultEvents: WTPEventDetailed[] = [
    {
      id: '7384abd1-8284-4ef2-8a09-b162b6ee8e4f',
      title: 'Sunset Yoga Retreat',
      description: 'Relax and recharge with our outdoor yoga session in Valencia. Perfect for all levels, join us for stretching, breathing, and sunset views.',
      activityTypes: ["Yoga", "Outdoors"],
      imageKey: '7384abd1-8284-4ef2-8a09-b162b6ee8e4f_events-1.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT1H',
      location: 'Valencia',
      capacity: 186,
      organizerId: '79cf715a-854b-4bab-b2b2-def27fb7bbaf',
      organizerUsername: 'admin_user',
      createdDate: '2025-04-11T17:49:18.583773',
      lastModifiedDate: '2025-04-11T17:49:18.583801',
      registrations: 71,
      isOwnedByUser: false,
      isRegistered: true
    },
    {
      id: '70f82bbc-98ae-4113-8c30-2a460c4fb2f5',
      title: 'Barcelona Coding Bootcamp',
      description: 'Level up your programming skills with a weekend bootcamp. Collaborate, build, and learn from tech mentors in the heart of Barcelona.',
      activityTypes: ["Technology", "Education"],
      imageKey: '70f82bbc-98ae-4113-8c30-2a460c4fb2f5_events-2.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT4H',
      location: 'Barcelona',
      capacity: 197,
      organizerId: '2d38b376-96f6-41e4-b8bf-2225e9ae01d7',
      organizerUsername: 'organizer2',
      createdDate: '2025-04-11T17:49:18.583930',
      lastModifiedDate: '2025-04-11T17:49:18.583934',
      registrations: 92,
      isOwnedByUser: true,
      isRegistered: false
    },
    {
      id: '78bef142-486e-473d-92b9-e723256a34ee',
      title: 'Madrid Salsa Social',
      description: 'Dance the night away with salsa enthusiasts in Madrid. No partner needed. Just good vibes and great music!',
      activityTypes: ["Dancing", "Social Events"],
      imageKey: '78bef142-486e-473d-92b9-e723256a34ee_events-3.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT4H',
      location: 'Madrid',
      capacity: 165,
      organizerId: 'd9e059a7-05cb-412d-a770-61bc30958e23',
      organizerUsername: 'organizer2',
      createdDate: '2025-04-11T17:49:18.584040',
      lastModifiedDate: '2025-04-11T17:49:18.584051',
      registrations: 91,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: 'e3d3c3be-e132-425e-83fc-99cbfe09dcdd',
      title: 'Berlin Photography Walk',
      description: 'Explore Berlin through the lens! This guided walk focuses on urban photography techniques and storytelling.',
      activityTypes: ["Photography", "Outdoors"],
      imageKey: 'e3d3c3be-e132-425e-83fc-99cbfe09dcdd_events-4.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT3H',
      location: 'Berlin',
      capacity: 110,
      organizerId: '8141f02d-72b7-47fd-8a74-481bd7d72426',
      organizerUsername: 'organizer2',
      createdDate: '2025-04-11T17:49:18.584158',
      lastModifiedDate: '2025-04-11T17:49:18.584162',
      registrations: 86,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: '00b5557e-dd7a-4073-bfc7-ce987a0d681f',
      title: 'Cooking & Networking in Paris',
      description: 'Mix culinary fun with professional networking in Paris. Cook a delicious dish while connecting with fellow creatives.',
      activityTypes: ["Cooking", "Networking"],
      imageKey: '00b5557e-dd7a-4073-bfc7-ce987a0d681f_events-5.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT2H',
      location: 'Paris',
      capacity: 125,
      organizerId: '03362757-541c-4bb8-8a53-e4ce6f6780f4',
      organizerUsername: 'local_organizer',
      createdDate: '2025-04-11T17:49:18.584388',
      lastModifiedDate: '2025-04-11T17:49:18.584391',
      registrations: 29,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: '96a13a9f-a6e4-4919-978a-7e3567218f2f',
      title: 'Climb & Chill in Bilbao',
      description: 'Join us for an indoor climbing session followed by a casual hangout in Bilbao. Gear provided for beginners!',
      activityTypes: ["Climbing", "Social Events"],
      imageKey: '96a13a9f-a6e4-4919-978a-7e3567218f2f_events-6.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT3H',
      location: 'Bilbao',
      capacity: 178,
      organizerId: 'fbba3375-ae62-4bac-88b9-74c96e5dce1e',
      organizerUsername: 'local_organizer',
      createdDate: '2025-04-11T17:49:18.584441',
      lastModifiedDate: '2025-04-11T17:49:18.584444',
      registrations: 85,
      isOwnedByUser: false,
      isRegistered: true
    },
    {
      id: 'aaf8a758-3b35-4d3e-abbd-b97a536f2165',
      title: 'Sevilla Street Art Tour',
      description: 'Discover the underground art scene of Sevilla with a guided street art tour and live mural painting.',
      activityTypes: ["Arts", "Outdoors"],
      imageKey: 'aaf8a758-3b35-4d3e-abbd-b97a536f2165_events-7.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT2H',
      location: 'Sevilla',
      capacity: 180,
      organizerId: '817e9c31-d0bf-4dde-8c1c-ae07ff52617d',
      organizerUsername: 'local_organizer',
      createdDate: '2025-04-11T17:49:18.584471',
      lastModifiedDate: '2025-04-11T17:49:18.584473',
      registrations: 80,
      isOwnedByUser: true,
      isRegistered: false
    },
    {
      id: '92fe66c9-8eb8-4d6b-9256-54c4dc215e91',
      title: 'London Meditation Morning',
      description: 'Start your day with guided mindfulness and breathing exercises in a quiet London park.',
      activityTypes: ["Meditation & Mindfulness", "Wellness & Fitness"],
      imageKey: '92fe66c9-8eb8-4d6b-9256-54c4dc215e91_events-8.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT3H',
      location: 'London',
      capacity: 144,
      organizerId: '5840ef59-672a-483a-b288-bedb78d488f8',
      organizerUsername: 'event_host',
      createdDate: '2025-04-11T17:49:18.584528',
      lastModifiedDate: '2025-04-11T17:49:18.584530',
      registrations: 117,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: 'd454b66d-bba7-44ed-bfa4-103b0cbcc515',
      title: 'Valencia Beach Volleyball Bash',
      description: 'Bump, set, spike! Join our friendly beach volleyball tournament on Valencia’s sunny coast.',
      activityTypes: ["Social Events", "Outdoors"],
      imageKey: 'd454b66d-bba7-44ed-bfa4-103b0cbcc515_events-9.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT2H',
      location: 'Valencia',
      capacity: 175,
      organizerId: 'bc66042e-71e1-4b4f-ab17-2456a6624a31',
      organizerUsername: 'admin_user',
      createdDate: '2025-04-11T17:49:18.584561',
      lastModifiedDate: '2025-04-11T17:49:18.584564',
      registrations: 116,
      isOwnedByUser: true,
      isRegistered: false
    },
    {
      id: '385fcae5-e9dc-4472-85e6-e105a35a48a5',
      title: 'Fashion & Style Talk in Paris',
      description: 'A casual meetup for fashion lovers in Paris. Share looks, trends, and swap ideas with stylists.',
      activityTypes: ["Fashion & Style", "Networking"],
      imageKey: '385fcae5-e9dc-4472-85e6-e105a35a48a5_events-10.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT1H',
      location: 'Paris',
      capacity: 148,
      organizerId: '3e52efec-a9d5-4e40-9737-246a15faace3',
      organizerUsername: 'organizer3',
      createdDate: '2025-04-11T17:49:18.584628',
      lastModifiedDate: '2025-04-11T17:49:18.584631',
      registrations: 108,
      isOwnedByUser: false,
      isRegistered: true
    },
    {
      id: 'c6100492-adf1-4b05-9bc7-858b0c32d3d9',
      title: 'Gaming Night in Berlin',
      description: 'Bring your best game face for a night of board games and video game fun at a Berlin gaming café.',
      activityTypes: ["Gaming", "Board Games"],
      imageKey: 'c6100492-adf1-4b05-9bc7-858b0c32d3d9_events-11.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT2H',
      location: 'Berlin',
      capacity: 174,
      organizerId: 'b12d55ce-bc31-4a66-ac60-b8e05230deac',
      organizerUsername: 'local_organizer',
      createdDate: '2025-04-11T17:49:18.584670',
      lastModifiedDate: '2025-04-11T17:49:18.584672',
      registrations: 123,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: '9810754d-d223-411c-b065-a52678c4a5e0',
      title: 'Bilbao Hiking Escape',
      description: 'Hit the trails with us around Bilbao’s scenic landscapes. All fitness levels welcome.',
      activityTypes: ["Hiking", "Outdoors"],
      imageKey: '9810754d-d223-411c-b065-a52678c4a5e0_events-12.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT1H',
      location: 'Bilbao',
      capacity: 94,
      organizerId: '3ce7c4d4-407e-4752-8f2b-5064cd922a58',
      organizerUsername: 'organizer2',
      createdDate: '2025-04-11T17:49:18.584810',
      lastModifiedDate: '2025-04-11T17:49:18.584819',
      registrations: 78,
      isOwnedByUser: false,
      isRegistered: true
    },
    {
      id: '5f4babdc-9fd6-4c3a-88f7-704c1a37b204',
      title: 'Tennis Mixer in Madrid',
      description: 'Casual doubles matches and new tennis buddies await you at this social tennis event in Madrid.',
      activityTypes: ["Tennis", "Social Events"],
      imageKey: '5f4babdc-9fd6-4c3a-88f7-704c1a37b204_events-13.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT1H',
      location: 'Madrid',
      capacity: 194,
      organizerId: '1a77f513-fe32-4396-a375-7e125ad668b0',
      organizerUsername: 'local_organizer',
      createdDate: '2025-04-11T17:49:18.584985',
      lastModifiedDate: '2025-04-11T17:49:18.584992',
      registrations: 129,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: '40f0a928-a1f8-48c5-8169-987983de9427',
      title: 'Cycling & Coffee in Sevilla',
      description: 'Ride through Sevilla’s scenic routes then grab a coffee with fellow cycling enthusiasts.',
      activityTypes: ["Cycling", "Social Events"],
      imageKey: '40f0a928-a1f8-48c5-8169-987983de9427_events-14.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT4H',
      location: 'Sevilla',
      capacity: 89,
      organizerId: '8890de36-76ff-452c-806e-cb7bdd84678c',
      organizerUsername: 'local_organizer',
      createdDate: '2025-04-11T17:49:18.585070',
      lastModifiedDate: '2025-04-11T17:49:18.585075',
      registrations: 28,
      isOwnedByUser: false,
      isRegistered: true
    },
    {
      id: '70a141df-64fe-4d07-b530-43a05e67794f',
      title: 'Snowboarding Weekend in Paris',
      description: 'Join our snowboarding crew for a weekend getaway to the slopes near Paris. Rentals and rides available!',
      activityTypes: ["Snowboarding", "Travel"],
      imageKey: '70a141df-64fe-4d07-b530-43a05e67794f_events-15.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT2H',
      location: 'Paris',
      capacity: 132,
      organizerId: '82a4e6ea-a6aa-4d95-a4c2-d0845fe10f26',
      organizerUsername: 'organizer1',
      createdDate: '2025-04-11T17:49:18.585286',
      lastModifiedDate: '2025-04-11T17:49:18.585293',
      registrations: 115,
      isOwnedByUser: true,
      isRegistered: false
    },
    {
      id: '74128379-193f-473f-8544-1f1f34ccf15b',
      title: 'Writing Circle in London',
      description: 'Share your stories and get feedback in a supportive group of writers in central London.',
      activityTypes: ["Writing", "Reading"],
      imageKey: '74128379-193f-473f-8544-1f1f34ccf15b_events-16.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT2H',
      location: 'London',
      capacity: 136,
      organizerId: 'f169258c-fd0d-441f-bbfe-67ed695453f8',
      organizerUsername: 'organizer3',
      createdDate: '2025-04-11T17:49:18.585360',
      lastModifiedDate: '2025-04-11T17:49:18.585363',
      registrations: 97,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: 'dec37f0c-487e-4603-b966-e7680311dd7b',
      title: 'Valencia Language Exchange Picnic',
      description: 'Practice languages in a fun, relaxed picnic setting in Valencia’s beautiful parks.',
      activityTypes: ["Language Learning", "Social Events"],
      imageKey: 'dec37f0c-487e-4603-b966-e7680311dd7b_events-17.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT4H',
      location: 'Valencia',
      capacity: 85,
      organizerId: '3ae9d584-f507-49dc-8215-fe911743f773',
      organizerUsername: 'admin_user',
      createdDate: '2025-04-11T17:49:18.585411',
      lastModifiedDate: '2025-04-11T17:49:18.585414',
      registrations: 50,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: '4cc0dfd3-1146-4d11-acf0-2bc9e896c50a',
      title: 'Fishing & Chill in Barcelona',
      description: 'Unwind by the water with this easygoing fishing event. Beginners welcome!',
      activityTypes: ["Fishing", "Outdoors"],
      imageKey: '4cc0dfd3-1146-4d11-acf0-2bc9e896c50a_events-18.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT1H',
      location: 'Barcelona',
      capacity: 89,
      organizerId: '5115e714-1b35-43a2-a451-1d6d4db435bb',
      organizerUsername: 'organizer1',
      createdDate: '2025-04-11T17:49:18.585458',
      lastModifiedDate: '2025-04-11T17:49:18.585461',
      registrations: 24,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: '3d133d00-6d9b-4f22-9218-34fedb9824ff',
      title: 'Basketball Jam in Berlin',
      description: 'Pick-up basketball games and drills for all levels. Come hoop and hang in Berlin!',
      activityTypes: ["Basketball", "Fitness & Bodybuilding"],
      imageKey: '3d133d00-6d9b-4f22-9218-34fedb9824ff_events-19.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT1H',
      location: 'Berlin',
      capacity: 147,
      organizerId: '3de9887a-d482-4b9b-8601-5c68afc9aa61',
      organizerUsername: 'organizer2',
      createdDate: '2025-04-11T17:49:18.585507',
      lastModifiedDate: '2025-04-11T17:49:18.585510',
      registrations: 80,
      isOwnedByUser: false,
      isRegistered: false
    },
    {
      id: '4c071398-429d-4a4e-810f-4f80fb725f9f',
      title: 'Baking & Bonding in Madrid',
      description: 'Learn to bake sweet treats and connect with others over flour and frosting.',
      activityTypes: ["Baking", "Cooking"],
      imageKey: '4c071398-429d-4a4e-810f-4f80fb725f9f_events-20.webp',
      dateTime: new Date().toISOString(),
      duration: 'PT3H',
      location: 'Madrid',
      capacity: 51,
      organizerId: '366036f4-2481-430e-862c-6ae004d6168a',
      organizerUsername: 'local_organizer',
      createdDate: '2025-04-11T17:49:18.585669',
      lastModifiedDate: '2025-04-11T17:49:18.585676',
      registrations: 21,
      isOwnedByUser: false,
      isRegistered: false
    }
  ];

  constructor(private http: HttpClient) {
  }

  getEvents(
    filters: {
      durationFrom?: string,
      durationTo?: string,
      dateTimeFrom?: string,
      dateTimeTo?: string,
      activityTypes?: string[]
    } = {},
    page: number = 0
  ): Observable<{ content: WTPEvent[]; totalPages: number; number: number }> {
    let params = new HttpParams()
      .set('page', page.toString())
      .set('size', '10');

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
        this.http.get<any>(`${this.baseUrl}/search`, {
          headers,
          params,
          withCredentials: true
        })
      ),
      map((response) => ({
        content: response.content,
        totalPages: response.totalPages,
        number: response.number
      })),
      catchError((error) => {
        console.error('Error fetching events:', error);
        return of({
          content: [...Array(10)].map((_, i) => this.defaultEvents[((page * 10) + i) % this.defaultEvents.length]),
          totalPages: this.defaultTotalPages,
          number: page
        });
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
        return of(this.defaultEvents.filter((event) => event.isOwnedByUser));
      })
    );
  }

  getMyRegistrations(): Observable<WTPEvent[]> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<WTPEvent[]>(`${this.baseUrl}/registration`, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<WTPEvent[]>) => response.body as WTPEvent[]),
      catchError((error) => {
        console.error('Error fetching event details:', error);
        // TODO REPLACE BY        return throwError(error);
        return of(this.defaultEvents.filter((event) => event.isRegistered));
      })
    );
  }

  registerToEvent(eventId: string): Observable<void> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<void>(`${this.baseUrl}/registration/${eventId}`, null, {
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
        this.http.get<WTPEventDetailed>(`${this.baseUrl}/${eventId}`, {
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
        this.http.delete<void>(`${this.baseUrl}/${eventId}`, {
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
        return this.http.put<WTPEvent>(`${this.baseUrl}/${eventId}`, formData, {
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
