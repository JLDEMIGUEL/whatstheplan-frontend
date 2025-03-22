import {
  ApplicationConfig,
  importProvidersFrom,
  inject,
  provideAppInitializer,
  provideZoneChangeDetection
} from '@angular/core';
import {provideRouter} from '@angular/router';

import {AppRoutes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {AuthService} from './services/auth.service';
import {provideHttpClient, withInterceptorsFromDi} from '@angular/common/http';
import {MatSnackBarModule} from '@angular/material/snack-bar';
import {BrowserAnimationsModule} from '@angular/platform-browser/animations';

const initAuth = (): Promise<void> => {
  const authService = inject(AuthService);
  return authService.checkCurrentUser();
};

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(AppRoutes),
    provideAnimationsAsync(),
    importProvidersFrom(BrowserAnimationsModule, MatSnackBarModule),
    provideAppInitializer(initAuth),
    provideHttpClient(withInterceptorsFromDi()), provideAnimationsAsync()
  ]
};
