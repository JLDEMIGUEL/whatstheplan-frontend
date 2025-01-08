import { Routes } from '@angular/router';
import { RegisterComponent } from './modules/auth/register/register.component';

export const AppRoutes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: '', redirectTo: '/recommendations', pathMatch: 'full' },
  { path: '**', redirectTo: '/recommendations' }
];
