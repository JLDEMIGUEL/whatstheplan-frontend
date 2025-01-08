import { Component } from '@angular/core';
import {Router} from '@angular/router';

@Component({
  selector: 'app-navbar',
  imports: [],
  templateUrl: './navbar.component.html',
  styleUrl: './navbar.component.scss'
})
export class NavbarComponent {
  constructor(private router: Router) {}

  logout() {
    // Logic for logging out the user (e.g., clearing tokens)
    console.log('User logged out');
    this.router.navigate(['/login']);
  }
}
