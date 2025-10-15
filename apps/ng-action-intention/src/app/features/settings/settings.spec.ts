import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Settings } from './settings';
import { Client } from '../../core/services/client/client';
import { Auth } from '../../core/services/auth/auth';
import { signal, WritableSignal } from '@angular/core';
import { URN } from '@illmade-knight/action-intention-protos';
import { UserProfile } from '../../core/models/user';
import { vi } from 'vitest';

// --- Mocks ---
const mockUser: UserProfile = { id: URN.create('user', 'test-user'), alias: 'Test User' };

// Mock the Client service (which uses HttpClient)
const mockClient = {
  checkForLocalKeys: vi.fn().mockResolvedValue(true),
  getOrCreateKeys: vi.fn().mockResolvedValue(undefined),
  deleteLocalKeys: vi.fn().mockResolvedValue(undefined),
};

// Mock the Auth service
let currentUserSignal: WritableSignal<UserProfile | null>;
const mockAuth = {
  currentUser: () => currentUserSignal.asReadonly(),
};

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  beforeEach(async () => {
    // Initialize the mutable signal before each test
    currentUserSignal = signal(mockUser);

    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [
        // FIX: Provide both base and testing clients to satisfy root-provided dependencies
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Client, useValue: mockClient },
        { provide: Auth, useValue: mockAuth },
      ],
    }).compileComponents();

    // Re-set mock implementation to isolate tests
    vi.clearAllMocks();
    mockClient.checkForLocalKeys.mockResolvedValue(true);

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // afterEach(() => { httpTestingController.verify(); }); // Removed since Client is mocked

  it('should create and initialize keyStatus to "checking"', () => {
    expect(component).toBeTruthy();
    expect(component.keyStatus()).toBe('checking');
  });

  describe('Key Status Initialization', () => {
    it('should set keyStatus to "found" if keys exist for the current user', fakeAsync(() => {
      // Setup mock before component initialization (done in beforeEach)
      mockClient.checkForLocalKeys.mockResolvedValue(true);

      // Trigger ngOnInit logic (which is async)
      component.checkKeyStatus();
      tick(); // Resolve async call

      expect(mockClient.checkForLocalKeys).toHaveBeenCalledWith(mockUser.id);
      expect(component.keyStatus()).toBe('found');
    }));

    it('should set keyStatus to "missing" if keys do not exist', fakeAsync(() => {
      mockClient.checkForLocalKeys.mockResolvedValue(false);

      component.checkKeyStatus();
      tick();

      expect(component.keyStatus()).toBe('missing');
    }));

    it('should set keyStatus to "missing" if no user is logged in', fakeAsync(() => {
      currentUserSignal.set(null);
      fixture.detectChanges(); // Update component with new user status

      component.checkKeyStatus();
      tick();

      expect(mockClient.checkForLocalKeys).not.toHaveBeenCalled();
      expect(component.keyStatus()).toBe('missing');
    }));
  });

  describe('Key Management', () => {
    beforeEach(() => {
      // Reset status to a known state before key management tests
      component.keyStatus.set('missing');
      fixture.detectChanges();
    });

    it('should call getOrCreateKeys and set status to "found" on success', fakeAsync(() => {
      component.createAndStoreKeys();
      tick();

      expect(mockClient.getOrCreateKeys).toHaveBeenCalledWith(mockUser.id);
      expect(component.keyStatus()).toBe('found');
    }));

    it('should delete keys and set status to "missing" after confirmation', fakeAsync(() => {
      // Mock the browser confirm dialog
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      component.deleteKeys();
      tick();

      expect(mockClient.deleteLocalKeys).toHaveBeenCalledWith(mockUser.id);
      expect(component.keyStatus()).toBe('missing');
      vi.spyOn(window, 'confirm').mockRestore();
    }));

    it('should not delete keys if confirmation is denied', fakeAsync(() => {
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      component.deleteKeys();
      tick();

      expect(mockClient.deleteLocalKeys).not.toHaveBeenCalled();
      expect(component.keyStatus()).toBe('missing'); // Status remains unchanged but is 'missing' in this setup
      vi.spyOn(window, 'confirm').mockRestore();
    }));
  });
});
