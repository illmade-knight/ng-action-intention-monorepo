import { ApplicationConfig, provideZoneChangeDetection } from '@angular/core';
import { provideRouter } from '@angular/router';
import { appRoutes } from './app.routes';
import { environment } from './config/environment';
import { provideHttpClient, withInterceptors } from '@angular/common/http';
import { authInterceptor } from './core/interceptors/auth.interceptor';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { mockApiInterceptor } from "@ng-action-intention/source/core/interceptors/mock-api.interceptor";

// Create an array of interceptors that are always active
const interceptors = [authInterceptor];

if ((environment as any).mockApi) {
  interceptors.push(mockApiInterceptor);
}


export const appConfig: ApplicationConfig = {
  providers: [
    provideZoneChangeDetection({ eventCoalescing: true }),
    provideRouter(appRoutes),
    // Provide HttpClient with our auth interceptor
    provideHttpClient(withInterceptors(interceptors)),
    // Provide browser animations for Angular Material components
    provideAnimationsAsync(),
  ],
};
