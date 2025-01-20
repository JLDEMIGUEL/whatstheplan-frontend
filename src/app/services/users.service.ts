import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders, HttpResponse} from '@angular/common/http';
import {fetchAuthSession} from 'aws-amplify/auth';
import {Observable} from 'rxjs';
import {map, switchMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';
import {UserProfile} from '../shared/model/users-profile.model'


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.api;

  constructor(private http: HttpClient) {
  }

  getUser(): Observable<UserProfile> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.get<UserProfile>(`${this.baseUrl}/users`, {
          headers,
          observe: 'response',
          withCredentials: true
        })
      ),
      map((response: HttpResponse<any>) => response.body)
    );
  }

  createUser(userData: any): Observable<UserProfile> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) => this.http.post<UserProfile>(`${this.baseUrl}/users`, userData,
        {headers, observe: 'response', withCredentials: true})
      ),
      map((response: HttpResponse<any>) => response.body)
    );
  }

  updateUser(userData: any): Observable<UserProfile> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put(`${this.baseUrl}/users`, userData,
          {headers, observe: 'response', withCredentials: true})
      ),
      map((response: HttpResponse<any>) => response.body)
    );
  }

  private addAuthHeaders(): Observable<HttpHeaders> {
    return new Observable((observer) => {
      fetchAuthSession()
        .then((session) => {
          const token = session?.tokens?.accessToken?.toString();
          const headers = new HttpHeaders({
            Authorization: `Bearer ${token}`,
            'Content-Type': 'application/json'
          });
          observer.next(headers);
          observer.complete();
        })
        .catch((error) => {
          observer.error(error);
        });
    });
  }
}
