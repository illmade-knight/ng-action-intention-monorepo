import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Router } from '@angular/router';
import { LoginSuccess } from './login-success';
import { Auth } from '../../core/services/auth/auth';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { signal, Signal } from '@angular/core';

// Define types at the top
type MockRouter = { navigate: ReturnType<typeof vi.fn> };

type MockAuth = {
  checkAuthStatus: ReturnType<typeof vi.fn>;
  isAuthenticated: Signal<boolean>; // It's a property that is a Signal
};

describe('LoginSuccess', () => {
  let fixture: ComponentFixture<LoginSuccess>;
  let mockRouter: MockRouter;

  beforeEach(async () => {
    // 1. Configure the TestBed ONCE with dummy providers
    mockRouter = { navigate: vi.fn() };

    await TestBed.configureTestingModule({
      imports: [LoginSuccess],
      providers: [
        // Provide a minimal dummy for the 'Auth' service
        { provide: Auth, useValue: { isAuthenticated: signal(false) } },
        { provide: Router, useValue: mockRouter },
        provideAnimationsAsync('noop'),
      ],
    }).compileComponents();

    // 2. Use Vitest fake timers
    vi.useFakeTimers();
  });

  afterEach(() => {
    // 3. Clean up timers and TestBed
    vi.useRealTimers();
    TestBed.resetTestingModule();
  });

  /**
   * Helper function to create a fixture with a specific auth state.
   */
  const setupFixtureWithAuth = (isAuthenticated: boolean) => {
    const mockAuth: MockAuth = {
      // Mock 'isAuthenticated' as a property
      isAuthenticated: signal(isAuthenticated).asReadonly(),
      checkAuthStatus: vi.fn().mockImplementation(() => Promise.resolve(undefined)),
    };

    // Override the provider *before* creating the component
    TestBed.overrideProvider(Auth, { useValue: mockAuth });

    return TestBed.createComponent(LoginSuccess);
  };

  // 🔽 TEST CASE 1 (THE ONE THAT WAS FAILING) 🔽
  it('should navigate to /login on failed authentication', () => {
    // 1. Setup fixture with auth=false
    fixture = setupFixtureWithAuth(false);

    // 2. Run ngOnInit (will now correctly read 'false')
    fixture.detectChanges();

    // 3. Advance timer
    vi.advanceTimersByTime(3000);

    // 4. Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/login'], {
      queryParams: { error: 'auth_sync_failed' },
    });
  });

  // 🔽 TEST CASE 2 (ADDED BACK IN) 🔽
  it('should navigate to /messaging on successful authentication', () => {
    // 1. Setup fixture with auth=true
    fixture = setupFixtureWithAuth(true);

    // 2. Run ngOnInit (will now correctly read 'true')
    fixture.detectChanges();

    // 3. Advance timer
    vi.advanceTimersByTime(100);

    // 4. Assert
    expect(mockRouter.navigate).toHaveBeenCalledWith(['/messaging']);
  });
});
