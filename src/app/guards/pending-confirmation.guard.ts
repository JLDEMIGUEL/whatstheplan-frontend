import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PendingConfirmationGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(): boolean {
    const pendingUserId = localStorage.getItem('pendingUserId');
    if (!pendingUserId) {
      this.router.navigate(['/register']);
      return false;
    }
    return true;
  }
}
