import { InjectionToken } from '@angular/core';

// Define the shape of the configuration object the library needs.
export interface NgContactsConfig {
  identityServiceUrl: string;
  messagingServiceUrl: string;
}

// Create the token that the application will use to provide the configuration.
export const NG_CONTACTS_CONFIG = new InjectionToken<NgContactsConfig>('ng-contacts.config');
