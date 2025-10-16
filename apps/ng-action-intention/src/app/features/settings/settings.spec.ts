import { ComponentFixture, TestBed } from '@angular/core/testing'; // 👈 REMOVED fakeAsync and tick
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Settings } from './settings';
import { Client } from '../../core/services/client/client';
import { Auth } from '../../core/services/auth/auth';
import { signal, WritableSignal } from '@angular/core';
import { UserProfile } from '../../core/models/user';

// --- Mocks ---
const mockUser: UserProfile = {
  id: 'urn:sm:user:test',
  email: 'test@user.com', // 👈 Added email to match other mocks
  alias: 'Test User',
};
const mockClient = {
  checkForLocalKeys: vi.fn().mockImplementation(() => Promise.resolve(true)),
  getOrCreateKeys: vi.fn().mockImplementation(() => Promise.resolve(undefined)),
  deleteLocalKeys: vi.fn().mockImplementation(() => Promise.resolve(undefined)),
};
let currentUserSignal: WritableSignal<UserProfile | null>;
const mockAuth = {
  currentUser: signal(null as UserProfile | null).asReadonly(),
};

describe('Settings', () => {
  let component: Settings;
  let fixture: ComponentFixture<Settings>;

  beforeEach(async () => {
    currentUserSignal = signal(mockUser);
    mockAuth.currentUser = currentUserSignal.asReadonly();

    await TestBed.configureTestingModule({
      imports: [Settings],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Client, useValue: mockClient },
        { provide: Auth, useValue: mockAuth },
      ],
    }).compileComponents();

    vi.clearAllMocks();
    mockClient.checkForLocalKeys.mockImplementation(() => Promise.resolve(true));
    mockClient.getOrCreateKeys.mockImplementation(() => Promise.resolve(undefined));
    mockClient.deleteLocalKeys.mockImplementation(() => Promise.resolve(undefined));

    fixture = TestBed.createComponent(Settings);
    component = fixture.componentInstance;
    // fixture.detectChanges() is removed from here
  });

  // 🔽 ADDED: Clean up TestBed to prevent pollution 🔽
  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create and initialize keyStatus to "checking"', () => {
    expect(component).toBeTruthy();
    expect(component.keyStatus()).toBe('checking');
  });

  describe('Key Status Initialization', () => {
    // 🔽 CHANGED: Removed 'fakeAsync', added 'async' 🔽
    it('should set keyStatus to "found" if keys exist for the current user', async () => {
      mockClient.checkForLocalKeys.mockImplementation(() => Promise.resolve(true));

      fixture.detectChanges(); // Trigger ngOnInit
      await Promise.resolve(); // 👈 CHANGED: Replaced tick()

      expect(mockClient.checkForLocalKeys).toHaveBeenCalledWith(mockUser.id);
      expect(component.keyStatus()).toBe('found');
    });

    // 🔽 CHANGED: Removed 'fakeAsync', added 'async' 🔽
    it('should set keyStatus to "missing" if keys do not exist', async () => {
      mockClient.checkForLocalKeys.mockImplementation(() => Promise.resolve(false));

      fixture.detectChanges(); // Trigger ngOnInit
      await Promise.resolve(); // 👈 CHANGED: Replaced tick()

      expect(mockClient.checkForLocalKeys).toHaveBeenCalledWith(mockUser.id);
      expect(component.keyStatus()).toBe('missing');
    });

    // 🔽 CHANGED: Removed 'fakeAsync', added 'async' 🔽
    it('should set keyStatus to "missing" if no user is logged in', async () => {
      currentUserSignal.set(null);

      fixture.detectChanges(); // Trigger ngOnInit
      await Promise.resolve(); // 👈 CHANGED: Replaced tick()

      expect(mockClient.checkForLocalKeys).not.toHaveBeenCalled();
      expect(component.keyStatus()).toBe('missing');
    });
  });

  describe('Key Management', () => {
    // 🔽 CHANGED: Removed 'fakeAsync', added 'async' 🔽
    beforeEach(async () => {
      mockClient.checkForLocalKeys.mockImplementation(() => Promise.resolve(false));
      fixture.detectChanges(); // Run ngOnInit
      await Promise.resolve(); // 👈 CHANGED: Replaced tick()
      expect(component.keyStatus()).toBe('missing');
    });

    // 🔽 CHANGED: Removed 'fakeAsync', added 'async' 🔽
    it('should call getOrCreateKeys and set status to "found" on success', async () => {
      await component.createAndStoreKeys(); // 👈 Added 'await'
      await Promise.resolve(); // 👈 CHANGED: Replaced tick()

      expect(mockClient.getOrCreateKeys).toHaveBeenCalledWith(mockUser.id);
      expect(component.keyStatus()).toBe('found');
    });

    // 🔽 CHANGED: Removed 'fakeAsync', added 'async' 🔽
    it('should delete keys and set status to "missing" after confirmation', async () => {
      component.keyStatus.set('found');
      vi.spyOn(window, 'confirm').mockReturnValue(true);

      await component.deleteKeys(); // 👈 Added 'await'
      await Promise.resolve(); // 👈 CHANGED: Replaced tick()

      expect(mockClient.deleteLocalKeys).toHaveBeenCalledWith(mockUser.id);
      expect(component.keyStatus()).toBe('missing');
      vi.spyOn(window, 'confirm').mockRestore();
    });

    // 🔽 CHANGED: Removed 'fakeAsync', added 'async' 🔽
    it('should not delete keys if confirmation is denied', async () => {
      component.keyStatus.set('found');
      vi.spyOn(window, 'confirm').mockReturnValue(false);

      await component.deleteKeys(); // 👈 Added 'await'
      await Promise.resolve(); // 👈 CHANGED: Replaced tick()

      expect(mockClient.deleteLocalKeys).not.toHaveBeenCalled();
      expect(component.keyStatus()).toBe('found');
      vi.spyOn(window, 'confirm').mockRestore();
    });
  });
});
