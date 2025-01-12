import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {from, Observable} from 'rxjs';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {fetchAuthSession} from 'aws-amplify/auth';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private router: Router
  ) {
  }

  canActivate(): Observable<boolean | UrlTree> {
    if (localStorage.getItem('pendingUsername')) {
      this.router.parseUrl('/confirmation-code');
    }

    return this.authService.isLoggedIn$.pipe(
      take(1),
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          return [this.router.parseUrl('/welcome')];
        }
        return from(fetchAuthSession({forceRefresh: true})).pipe(
          map(session => {
            const username_set = session.tokens?.idToken?.payload?.['custom:username_set'];
            if (username_set !== "true") {
              return this.router.parseUrl('/set-username');
            }

            return true;
          }),
          catchError(() => [this.router.parseUrl('/welcome')])
        );
      })
    );
  }
}
