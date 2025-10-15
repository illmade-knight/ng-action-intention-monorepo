import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { authGuard } from './auth-guard';
import { Auth } from '@ng-action-intention/source/core/services/auth/auth';
import { describe, it, expect, vi } from 'vitest';

describe('authGuard', () => {
  const executeGuard = () =>
    TestBed.runInInjectionContext(() => authGuard({} as any, {} as any));

  it('should allow activation when user is authenticated', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: Auth, useValue: { isAuthenticated: () => true } }],
    });
    const canActivate = executeGuard();
    expect(canActivate).toBe(true);
  });

  it('should redirect to /login when user is not authenticated', () => {
    const mockRouter = { createUrlTree: vi.fn(() => new UrlTree()) };
    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: { isAuthenticated: () => false } },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const result = executeGuard();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/login']);
    expect(result).toBeInstanceOf(UrlTree);
  });
});
