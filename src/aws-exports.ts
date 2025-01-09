import {environment} from './environments/environment';

const awsConfig = {
  Auth: {
    Cognito: {
      userPoolId: environment.cognito.userPoolId,
      userPoolClientId: environment.cognito.userPoolAppClientId
    }
  }
};

export default awsConfig;
