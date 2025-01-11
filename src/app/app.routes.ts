import {Routes} from '@angular/router';
import {RegisterComponent} from './modules/auth/register/register.component';
import {LoginComponent} from './modules/auth/login/login.component';
import {RecommendationsComponent} from './modules/recommendation/recommendations/recommendations.component';
import {WelcomeComponent} from './modules/welcome/welcome/welcome.component';
import {NonAuthGuard} from './guards/non-auth.guard';
import {AuthGuard} from './guards/auth.guard';
import {ConfirmationCodeComponent} from './modules/auth/confirmation-code/confirmation-code.component';
import {PendingConfirmationGuard} from './guards/pending-confirmation.guard';

export const AppRoutes: Routes = [
  // Public routes
  {path: 'register', component: RegisterComponent, canActivate: [NonAuthGuard]},
  {path: 'login', component: LoginComponent, canActivate: [NonAuthGuard]},
  {path: 'welcome', component: WelcomeComponent, canActivate: [NonAuthGuard]},

  // Pending confirmation
  {path: 'confirmation-code', component: ConfirmationCodeComponent, canActivate: [PendingConfirmationGuard]},

  // Authenticated users only
  {path: '', component: RecommendationsComponent, canActivate: [AuthGuard]},

  // Redirections
  {path: '**', redirectTo: ''}
];
