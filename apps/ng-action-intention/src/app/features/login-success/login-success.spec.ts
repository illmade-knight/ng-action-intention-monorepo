import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginSuccess } from './login-success';
import { Auth } from '../../core/services/auth/auth';
import { describe, it, expect, vi } from 'vitest';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { signal, Signal } from '@angular/core';

// Define a more specific type for the mockRouter to avoid type errors
type MockRouter = { navigate: ReturnType<typeof vi.fn> };
type MockAuth = {
  checkAuthStatus: ReturnType<typeof vi.fn>;
  isAuthenticated: () => Signal<boolean>;
};

describe('LoginSuccess', () => {
  let fixture: ComponentFixture<LoginSuccess>;
  let mockRouter: MockRouter;
  let mockAuth: MockAuth;

  // A setup function to configure the TestBed for each scenario (MUST remain async)
  const setup = async (isAuthenticated: boolean) => {
    const isAuthenticatedSignal = signal(isAuthenticated);
    mockAuth = {
      checkAuthStatus: vi.fn().mockResolvedValue(undefined),
      isAuthenticated: () => isAuthenticatedSignal.asReadonly(),
    };
    mockRouter = { navigate: vi.fn() };

    // This block is what creates the promise that must be resolved with tick()
    await TestBed.configureTestingModule({
      imports: [LoginSuccess],
      providers: [
        { provide: Auth, useValue: mockAuth },
        { provide: Router, useValue: mockRouter },
        provideAnimationsAsync('noop'),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(LoginSuccess);
  };

  // FIX: Remove 'async' from the inner function, call setup directly, and use tick()
  it('should navigate to /messaging on successful authentication', fakeAsync(() => {
    // 1. Call the async setup function to create the setup promise.
    setup(true);

    // 2. Resolve ALL promises/microtasks created by the setup function.
    tick();

    // 3. Run the synchronous test logic
    fixture.detectChanges();

    // 4. Advance time past the 50ms timeout for the redirect
    tick(100);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/messaging']);
  }));

  // FIX: Apply the same structure here.
  it('should navigate to /login on failed authentication', fakeAsync(() => {
    setup(false);
    tick();

    fixture.detectChanges();

    tick(3000);
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], { queryParams: { error: 'auth_sync_failed' } });
  }));
});
