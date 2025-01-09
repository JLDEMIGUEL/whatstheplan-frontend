import {ApplicationConfig, inject, provideAppInitializer, provideZoneChangeDetection} from '@angular/core';
import {provideRouter} from '@angular/router';

import {AppRoutes} from './app.routes';
import {provideAnimationsAsync} from '@angular/platform-browser/animations/async';
import {AuthService} from './services/auth.service';

const initAuth = (): Promise<void> => {
  const authService = inject(AuthService);
  return authService.checkCurrentUser();
};

export const appConfig: ApplicationConfig = {
  providers: [provideZoneChangeDetection({eventCoalescing: true}),
    provideRouter(AppRoutes), provideAnimationsAsync(),
    provideAppInitializer(initAuth)]
};
