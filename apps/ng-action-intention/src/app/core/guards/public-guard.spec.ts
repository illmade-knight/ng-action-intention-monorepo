import { TestBed } from '@angular/core/testing';
import { Router, UrlTree } from '@angular/router';
import { publicGuard } from './public-guard';
import { Auth } from '@ng-action-intention/source/core/services/auth/auth';
import { describe, it, expect, vi } from 'vitest';

describe('publicGuard', () => {
  const executeGuard = () =>
    TestBed.runInInjectionContext(() => publicGuard({} as any, {} as any));

  it('should allow activation when user is not authenticated', () => {
    TestBed.configureTestingModule({
      providers: [{ provide: Auth, useValue: { isAuthenticated: () => false } }],
    });
    const canActivate = executeGuard();
    expect(canActivate).toBe(true);
  });

  it('should redirect to /messaging when user is already authenticated', () => {
    const mockRouter = { createUrlTree: vi.fn(() => new UrlTree()) };
    TestBed.configureTestingModule({
      providers: [
        { provide: Auth, useValue: { isAuthenticated: () => true } },
        { provide: Router, useValue: mockRouter },
      ],
    });

    const result = executeGuard();
    expect(mockRouter.createUrlTree).toHaveBeenCalledWith(['/messaging']);
    expect(result).toBeInstanceOf(UrlTree);
  });
});
