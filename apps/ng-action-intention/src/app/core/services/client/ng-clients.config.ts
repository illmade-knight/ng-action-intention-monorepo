import { InjectionToken } from '@angular/core';

export interface NgClientsConfig {
  keyServiceUrl: string;
  routingServiceUrl: string;
}

export const NG_CLIENTS_CONFIG = new InjectionToken<NgClientsConfig>('ng-clients.config');
