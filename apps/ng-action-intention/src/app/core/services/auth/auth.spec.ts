import { TestBed } from '@angular/core/testing';
import { HttpTestingController, provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Router } from '@angular/router';
import { describe, it, expect, beforeEach, afterEach, vi } from 'vitest';
import { Auth } from './auth';
import { environment } from '../../../config/environment';
import { firstValueFrom } from 'rxjs';
import { UserProfile } from '../../models/user';

const mockUser: UserProfile = { id: 'user-123', email: 'test@example.com', alias: 'Test User' };

// A complete mock of the browser's Storage API
const createStorageMock = () => {
  let store: Record<string, string> = {};
  return {
    getItem: (key: string) => store[key] || null,
    setItem: (key: string, value: string) => { store[key] = value.toString(); },
    removeItem: (key: string) => { delete store[key]; },
    clear: () => { store = {}; },
    get length() { return Object.keys(store).length; },
    key: (index: number) => Object.keys(store)[index] || null,
  };
};

describe('Auth', () => {
  let service: Auth;
  let httpMock: HttpTestingController;
  let router: Router;
  let localStorageMock: ReturnType<typeof createStorageMock>;

  beforeEach(() => {
    const mockRouter = { navigate: vi.fn() };
    localStorageMock = createStorageMock();

    // FIX: Spy on the methods of the mock object itself
    vi.spyOn(localStorageMock, 'setItem');
    vi.spyOn(localStorageMock, 'removeItem');

    vi.spyOn(window, 'localStorage', 'get').mockReturnValue(localStorageMock as any);

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Auth,
        { provide: Router, useValue: mockRouter },
      ],
    });

    service = TestBed.inject(Auth);
    httpMock = TestBed.inject(HttpTestingController);
    router = TestBed.inject(Router);
  });

  afterEach(() => {
    httpMock.verify();
    vi.restoreAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('checkAuthStatus', () => {
    const authStatusUrl = `${environment.identityServiceUrl}/api/auth/status`;

    it('should authenticate user and store token on successful response', async () => {
      const mockResponse = { authenticated: true, user: { ...mockUser, token: 'new-jwt-token' } };
      const statusPromise = service.checkAuthStatus();
      httpMock.expectOne(authStatusUrl).flush(mockResponse);
      await statusPromise;
      expect(localStorageMock.setItem).toHaveBeenCalledWith('app_jwt', 'new-jwt-token');
    });

    it('should clear authentication on an unauthenticated response', async () => {
      const mockResponse = { authenticated: false, user: null };
      const statusPromise = service.checkAuthStatus();
      httpMock.expectOne(authStatusUrl).flush(mockResponse);
      await statusPromise;
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('app_jwt');
    });
  });

  describe('logout', () => {
    const logoutUrl = `${environment.identityServiceUrl}/api/auth/logout`;

    it('should clear authentication and navigate to login', async () => {
      const logoutPromise = firstValueFrom(service.logout());
      // FIX: Added the required statusText property
      httpMock.expectOne(logoutUrl).flush(null, { status: 204, statusText: 'No Content' });
      await logoutPromise;
      expect(localStorageMock.removeItem).toHaveBeenCalledWith('app_jwt');
      expect(router.navigate).toHaveBeenCalledWith(['/login']);
    });
  });
});
