import {Injectable} from '@angular/core';
import {HttpClient, HttpHeaders} from '@angular/common/http';
import {fetchAuthSession} from 'aws-amplify/auth';
import {Observable} from 'rxjs';
import {switchMap} from 'rxjs/operators';
import {environment} from '../../environments/environment';


@Injectable({
  providedIn: 'root'
})
export class UserService {
  private baseUrl = environment.api;

  constructor(private http: HttpClient) {
  }

  getUser(): Observable<any> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) => this.http.get(`${this.baseUrl}/users`,
        {headers, observe: 'response', withCredentials: true}))
    );
  }

  createUser(userData: any): Observable<any> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) => this.http.post(`${this.baseUrl}/users`, userData,
        {headers, observe: 'response', withCredentials: true})
      )
    );
  }

  updateUser(userData: any): Observable<any> {
    return this.addAuthHeaders().pipe(
      switchMap((headers) =>
        this.http.put(`${this.baseUrl}/users`, userData,
          {headers, observe: 'response', withCredentials: true})
      )
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
