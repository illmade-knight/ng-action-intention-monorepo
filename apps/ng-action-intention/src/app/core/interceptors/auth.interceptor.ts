import { HttpInterceptorFn, HttpRequest, HttpHandlerFn } from '@angular/common/http';
import { inject } from '@angular/core';
import { Auth } from '@ng-action-intention/source/core/services/auth/auth';
import { environment } from '@ng-action-intention/source/config/environment';

export const authInterceptor: HttpInterceptorFn = (req, next) => {
  const authService = inject(Auth);
  let authReq = req;

  if (req.url.startsWith(environment.identityServiceUrl)) {
    authReq = req.clone({
      withCredentials: true,
    });
  } else {
    const token = authService.getToken();
    if (token) {
      authReq = req.clone({
        setHeaders: {
          Authorization: `Bearer ${token}`,
        },
      });
    }
  }
  return next(authReq);
};
