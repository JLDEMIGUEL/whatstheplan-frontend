import {environment} from './environments/environment';

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.userPoolAppClientId,
      loginWith: {
        oauth: {
          domain: environment.cognito.domain,
          scopes: ['email', 'openid', 'profile'],
          redirectSignIn: [environment.cognito.redirectSignIn],
          redirectSignOut: [environment.cognito.redirectSignOut],
          responseType: 'code'
        }
      }
    }
  }
};

export default awsConfig;
