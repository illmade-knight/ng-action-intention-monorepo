// src/app/config/environment.ts
import { Environment } from './environment.model';

export const environment: Environment = {
  production: true,
  // Use placeholder or actual production URLs here
  identityServiceUrl: 'https://api.prod.com/identity',
  messagingServiceUrl: 'https://api.prod.com/messaging',
  keyServiceUrl: 'https://api.prod.com/keys',
  routingServiceUrl: 'https://api.prod.com/routing',
};
