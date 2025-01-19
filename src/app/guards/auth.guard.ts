// auth.guard.ts
import {Injectable} from '@angular/core';
import {CanActivate, Router, UrlTree} from '@angular/router';
import {from, Observable, of} from 'rxjs';
import {catchError, map, switchMap, take} from 'rxjs/operators';
import {AuthService} from '../services/auth.service';
import {UserService} from '../services/users.service';
import {fetchAuthSession} from 'aws-amplify/auth';
import {HttpErrorResponse} from '@angular/common/http';

@Injectable({
  providedIn: 'root'
})
export class AuthGuard implements CanActivate {
  constructor(
    private authService: AuthService,
    private userService: UserService,
    private router: Router
  ) {
  }

  canActivate(): Observable<boolean | UrlTree> {
    const pendingUserId = localStorage.getItem('pendingUserId');
    if (pendingUserId) {
      return of(this.router.parseUrl('/confirmation-code'));
    }

    return this.authService.isLoggedIn$.pipe(
      take(1),
      switchMap(isLoggedIn => {
        if (!isLoggedIn) {
          return of(this.router.parseUrl('/welcome'));
        }

        return from(fetchAuthSession({forceRefresh: true})).pipe(
          switchMap(session => {
            return this.userService.getUser().pipe(
              map(userResponse => {
                return true;
              }),
              catchError((error: HttpErrorResponse) => {
                if (error.status === 400) {
                  return of(this.router.parseUrl('/complete-profile'));
                } else {
                  return of(this.router.parseUrl('/welcome'));
                }
              })
            );
          }),
          catchError(() => {
            return of(this.router.parseUrl('/welcome'));
          })
        );
      })
    );
  }
}
