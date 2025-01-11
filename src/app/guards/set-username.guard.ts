import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';
import {fetchAuthSession} from 'aws-amplify/auth';
import {from, Observable} from 'rxjs';
import {catchError, map} from 'rxjs/operators';

@Injectable({
  providedIn: 'root'
})
export class SetUsernameGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(): Observable<boolean> {
    return from(fetchAuthSession()).pipe(
      map((session) => {
        const preferred_username = session.tokens?.idToken?.payload?.['preferred_username'] || '';
        const email = session.tokens?.idToken?.payload?.['email'] || '';
        if (!session || preferred_username !== email) {
          this.router.navigate(['/']);
          return false
        }
        return true;
      }),
      catchError(() => {
        this.router.navigate(['/']);
        return [false];
      })
    );
  }
}
