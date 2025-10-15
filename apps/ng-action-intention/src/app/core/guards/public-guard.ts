import { inject } from '@angular/core';
import { CanActivateFn, Router } from '@angular/router';
import { Auth } from '@ng-action-intention/source/core/services/auth/auth';

/**
 * A guard for public-facing pages like the login screen.
 * If the user is already authenticated, it redirects them to the main
 * application page.
 */
export const publicGuard: CanActivateFn = (route, state) => {
  const authService = inject(Auth);
  const router = inject(Router);
  if (authService.isAuthenticated()) {
    return router.createUrlTree(['/messaging']);
  }
  return true;
};
