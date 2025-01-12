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
    return from(fetchAuthSession({forceRefresh: true})).pipe(
      map((session) => {
        const username_set = session.tokens?.idToken?.payload?.['custom:username_set'];
        if (!session.tokens?.accessToken || username_set === "false") {
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
