import { Routes } from '@angular/router';
import { authGuard } from '@ng-action-intention/source/core/guards/auth-guard';
import { publicGuard } from '@ng-action-intention/source/core/guards/public-guard';
import { Login } from '@ng-action-intention/source/features/login/login';
import { LoginSuccess } from '@ng-action-intention/source/features/login-success/login-success';
import { Messaging } from '@ng-action-intention/source/features/messaging/messaging';

export const appRoutes: Routes = [
  // Public routes
  { path: 'login', component: Login, canActivate: [publicGuard] },
  { path: 'login-success', component: LoginSuccess },

  // Main application routes (protected)
  { path: 'messaging', component: Messaging, canActivate: [authGuard] },
  {
    path: 'settings',
    loadChildren: () =>
      import('@ng-action-intention/source/features/settings/settings.routes').then((r) => r.SETTINGS_ROUTES),
    canActivate: [authGuard],
  },

  // --- REMOVED LAZY-LOADED CONTACTS ROUTE ---

  // Default route
  { path: '', redirectTo: 'messaging', pathMatch: 'full' },
];
