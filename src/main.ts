import {bootstrapApplication} from '@angular/platform-browser';
import {appConfig} from './app/app.config';
import {AppComponent} from './app/app.component';
import {Amplify} from 'aws-amplify';
import awsConfig from './aws-exports';
import {environment} from './environments/environment';
import {enableProdMode} from '@angular/core';

// @ts-ignore
Amplify.configure(awsConfig);

if (environment.production) {
  enableProdMode();
}

bootstrapApplication(AppComponent, appConfig)
  .catch((err) => console.error(err));
