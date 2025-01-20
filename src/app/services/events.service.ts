import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {fetchAuthSession} from 'aws-amplify/auth';
import {Observable, of} from 'rxjs';
import {catchError, map, switchMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {WTPEvent} from '../shared/model/events.model';

@Injectable({
  providedIn: 'root'
})
export class EventsService {
  private baseUrl = environment.api;

  private defaultEvents: WTPEvent[] = [
    {
      id: '1',
      name: 'Default Event 1',
      description: 'This is a default event description.',
      s3key: 'events-1.png'
    },
    {
      id: '1',
      name: 'Default Event 2',
      description: 'Another default event for fallback.',
      s3key: 'events-1.png'
    },
    {
      id: '3',
      name: 'Default Event 3',
      description: 'This is a default event description.',
      s3key: 'events-1.png'
    }
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
