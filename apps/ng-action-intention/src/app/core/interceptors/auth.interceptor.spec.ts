import { TestBed } from '@angular/core/testing';
import { provideHttpClient, HttpRequest, withInterceptors, HttpClient } from '@angular/common/http';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { authInterceptor } from './auth.interceptor';
import { Auth } from '@ng-action-intention/source/core/services/auth/auth';
import { environment } from '@ng-action-intention/source/config/environment';
import { describe, it, expect, vi, beforeEach, afterEach } from 'vitest';

describe('authInterceptor', () => {
  let httpMock: HttpTestingController;
  let httpClient: HttpClient;
  let authServiceMock: Partial<Auth>;

  const setup = (mock: Partial<Auth>) => {
    authServiceMock = mock;
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(withInterceptors([authInterceptor])),
        provideHttpClientTesting(),
        { provide: Auth, useValue: authServiceMock },
      ],
    });
    httpMock = TestBed.inject(HttpTestingController);
    httpClient = TestBed.inject(HttpClient);
  };

  afterEach(() => {
    httpMock.verify();
  });

  it('should add an Authorization header for non-identity service requests', () => {
    setup({ getToken: () => 'test-jwt-token' });
    httpClient.get('/api/data').subscribe();
    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(true);
    expect(req.request.headers.get('Authorization')).toBe('Bearer test-jwt-token');
    req.flush({});
  });

  it('should set withCredentials for identity service requests', () => {
    setup({ getToken: () => null }); // Token doesn't matter for this case
    httpClient.get(environment.identityServiceUrl + '/me').subscribe();
    const req = httpMock.expectOne(environment.identityServiceUrl + '/me');
    expect(req.request.withCredentials).toBe(true);
    req.flush({});
  });

  it('should not add an Authorization header if token does not exist', () => {
    setup({ getToken: () => null });
    httpClient.get('/api/data').subscribe();
    const req = httpMock.expectOne('/api/data');
    expect(req.request.headers.has('Authorization')).toBe(false);
    req.flush({});
  });

  // --- NEW TEST CASE ---
  it('should NOT add Authorization header for identity service requests even if a token exists', () => {
    setup({ getToken: () => 'test-jwt-token' });
    httpClient.get(environment.identityServiceUrl + '/me').subscribe();
    const req = httpMock.expectOne(environment.identityServiceUrl + '/me');
    expect(req.request.headers.has('Authorization')).toBe(false);
    expect(req.request.withCredentials).toBe(true); // Still should have credentials
    req.flush({});
  });
});
