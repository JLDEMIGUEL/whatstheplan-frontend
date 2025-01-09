import { Routes } from '@angular/router';
import { RegisterComponent } from './modules/auth/register/register.component';
import {LoginComponent} from './modules/auth/login/login.component';
import {RecommendationsComponent} from './modules/recommendation/recommendations/recommendations.component';

export const AppRoutes: Routes = [
  { path: 'register', component: RegisterComponent },
  { path: 'login', component: LoginComponent },
  { path: 'recommendations', component: RecommendationsComponent },
  { path: '', redirectTo: '/recommendations', pathMatch: 'full' },
  { path: '**', redirectTo: '/recommendations' }
];
