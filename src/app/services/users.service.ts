import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {fetchAuthSession} from 'aws-amplify/auth';
import {Observable, of, throwError} from 'rxjs';
import {catchError, map, switchMap, tap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {UserProfile} from '../shared/model/users-profile.model';

export const localStorageKey = 'userProfile';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.api;

  constructor(private http: HttpClient) {
  }

  getUser(): Observable<UserProfile> {
    const cachedProfile = localStorage.getItem(localStorageKey);
    if (cachedProfile) {
      try {
        const parsedProfile: UserProfile = JSON.parse(cachedProfile);
        return of(parsedProfile);
      } catch (error) {
        console.error('Error parsing user profile from localStorage:', error);
      }
    }

    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<UserProfile>(`${this.baseUrl}/users`, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<UserProfile>) => response.body as UserProfile),
      tap((userProfile: UserProfile) => {
        localStorage.setItem(localStorageKey, JSON.stringify(userProfile));
      }),
      catchError((error) => {
        console.error('Error fetching user profile:', error);
        return throwError(error);
      })
    );
  }

  createUser(userData: any): Observable<UserProfile> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.post<UserProfile>(`${this.baseUrl}/users`, userData, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<UserProfile>) => response.body as UserProfile),
      tap((createdUser: UserProfile) => {
        localStorage.setItem(localStorageKey, JSON.stringify(createdUser));
      }),
      catchError((error) => {
        console.error('Error creating user:', error);
        return throwError(error);
      })
    );
  }

  updateUser(userData: any): Observable<UserProfile> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put<UserProfile>(`${this.baseUrl}/users`, userData, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<UserProfile>) => response.body as UserProfile),
      tap((updatedUser: UserProfile) => {
        localStorage.setItem(localStorageKey, JSON.stringify(updatedUser));
      }),
      catchError((error) => {
        console.error('Error updating user:', error);
        return throwError(error);
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
