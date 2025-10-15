import { ComponentFixture, TestBed } from '@angular/core/testing';
import { signal } from '@angular/core';
import { of } from 'rxjs';
import { Login } from './login';
import { Auth } from '@ng-action-intention/source/core/services/auth/auth';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('Login', () => {
  let fixture: ComponentFixture<Login>;
  const isAuthenticatedSignal = signal(false);
  const currentUserSignal = signal(null);

  const mockAuth = {
    isAuthenticated: isAuthenticatedSignal.asReadonly(),
    currentUser: currentUserSignal.asReadonly(),
    logout: vi.fn(() => of(null)),
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [Login],
      providers: [
        { provide: Auth, useValue: mockAuth },
        provideAnimationsAsync('noop'),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(Login);
    fixture.detectChanges();
  });

  it('should show login button when not authenticated', () => {
    isAuthenticatedSignal.set(false);
    fixture.detectChanges();
    const loginButton = fixture.nativeElement.querySelector('a[href*="auth/google"]');
    expect(loginButton).toBeTruthy();
  });

  it('should show welcome message and logout button when authenticated', () => {
    isAuthenticatedSignal.set(true);
    currentUserSignal.set({ alias: 'Test User' });
    fixture.detectChanges();
    const welcomeMessage = fixture.nativeElement.querySelector('h2');
    const logoutButton = fixture.nativeElement.querySelector('button');
    expect(welcomeMessage.textContent).toContain('Welcome, Test User!');
    expect(logoutButton.textContent).toContain('Logout');
  });

  it('should call auth.logout when logout button is clicked', () => {
    isAuthenticatedSignal.set(true);
    fixture.detectChanges();
    const logoutButton = fixture.nativeElement.querySelector('button');
    logoutButton.click();
    expect(mockAuth.logout).toHaveBeenCalled();
  });
});
