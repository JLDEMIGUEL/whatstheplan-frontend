import {Injectable} from '@angular/core';
import {ActivatedRouteSnapshot, CanActivate, Router, RouterStateSnapshot, UrlTree} from '@angular/router';
import {Observable, of} from 'rxjs';
import {catchError, map} from 'rxjs/operators';
import {UserService} from '../services/users.service';
import {HttpErrorResponse} from '@angular/common/http';
import {UserProfile} from '../shared/model/users-profile.model';

@Injectable({
  providedIn: 'root'
})
export class CompleteProfileGuard implements CanActivate {
  constructor(private router: Router, private usersService: UserService) {
  }

  canActivate(
    route: ActivatedRouteSnapshot,
    state: RouterStateSnapshot
  ): Observable<boolean | UrlTree> {
    return this.usersService.getUser().pipe(
      map((response: UserProfile) => {
        return this.router.createUrlTree(['/']);
      }),
      catchError((error: HttpErrorResponse) => {
        if (error.status === 400) {
          return of(true);
        } else {
          return of(this.router.createUrlTree(['/']));
        }
      })
    );
  }
}
