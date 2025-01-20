export const environment = {
  production: false,
  cognito: {
    userPoolId: 'eu-west-1_ByZRv2t2w',
    userPoolAppClientId: '3ke5cd7ifdi0u8dug9u0kpah7m',
    domain: 'eu-west-1byzrv2t2w.auth.eu-west-1.amazoncognito.com',
    redirectSignIn: 'http://localhost:4200/',
    redirectSignOut: 'http://localhost:4200/'
  },
  api: 'http://localhost:8080',
  s3BaseUrl: 'https://whatstheplan-s3-images.s3.eu-west-1.amazonaws.com/'
};
