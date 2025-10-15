import { Environment } from './environment.model';

export const environment: Environment & { mockApi: boolean } = {
  production: false,
  mockApi: true, // The flag that enables mocking
  // URLs can remain the same, as the interceptor will catch them before they are called.
  identityServiceUrl: 'http://localhost:3000',
  messagingServiceUrl: 'http://localhost:3001',
  keyServiceUrl: 'http://localhost:8081',
  routingServiceUrl: 'http://localhost:8082',
};
