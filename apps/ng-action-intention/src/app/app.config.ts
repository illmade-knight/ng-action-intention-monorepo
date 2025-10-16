import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { environment } from './config/environment';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { mockApiInterceptor } from "@ng-action-intention/source/core/interceptors/mock-api.interceptor";
import { NG_CLIENTS_CONFIG } from './core/services/client/ng-clients.config';
// --- 1. Import the new token ---
import { NG_CONTACTS_CONFIG } from '@ng-action-intention/ng-contacts';

const interceptors = [authInterceptor];

if ((environment as any).mockApi) {
  interceptors.push(mockApiInterceptor);
}

export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    provideHttpClient(withInterceptors(interceptors)),
    provideAnimationsAsync(),
    {
      provide: NG_CLIENTS_CONFIG,
      useValue: (environment as any).mockApi
        ? {
          keyServiceUrl: 'http://mock.api/key-service',
          routingServiceUrl: 'http://mock.api/routing-service',
        }
        : {
          keyServiceUrl: environment.keyServiceUrl,
          routingServiceUrl: environment.routingServiceUrl,
        },
    },

    // --- 2. Add the conditional provider for the contacts config ---
    {
      provide: NG_CONTACTS_CONFIG,
      useValue: (environment as any).mockApi
        ? { // For the 'mock' configuration
          identityServiceUrl: 'http://mock.api/identity-service',
          messagingServiceUrl: 'http://mock.api/messaging-service',
        }
        : { // For 'development' and 'production'
          identityServiceUrl: environment.identityServiceUrl,
          messagingServiceUrl: environment.messagingServiceUrl,
        },
    },
  ],
};
