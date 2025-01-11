import {Injectable} from '@angular/core';
import {CanActivate, Router} from '@angular/router';

@Injectable({
  providedIn: 'root',
})
export class PendingConfirmationGuard implements CanActivate {
  constructor(private router: Router) {
  }

  canActivate(): boolean {
    const pendingUsername = localStorage.getItem('pendingUsername');
    if (!pendingUsername) {
      this.router.navigate(['/register']);
      return false;
    }
    return true;
  }
}
