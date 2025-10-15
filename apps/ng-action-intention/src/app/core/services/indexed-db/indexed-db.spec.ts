import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi, afterEach } from 'vitest';
import { IndexedDb } from './indexed-db';
import { RawApplicationState } from '@ng-action-intention/sdk';

// A more realistic mock for a CryptoKeyPair object
const mockPublicKey = { type: 'public' } as CryptoKey;
const mockPrivateKey = { type: 'private' } as CryptoKey;
const mockKeyPair = { publicKey: mockPublicKey, privateKey: mockPrivateKey };

// Mock the entire Web Crypto API
const mockCrypto = {
  subtle: {
    generateKey: vi.fn().mockResolvedValue(mockKeyPair),
    exportKey: vi.fn().mockResolvedValue({}),
    importKey: vi.fn(),
  },
};
vi.stubGlobal('crypto', mockCrypto);

// Mock the methods of a Dexie table
const mockDexieTable = {
  get: vi.fn(),
  put: vi.fn(),
  delete: vi.fn(),
};

describe('IndexedDb', () => {
  let service: IndexedDb;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [IndexedDb],
    });
    service = TestBed.inject(IndexedDb);

    // Intercept the real Dexie tables and replace them with our mocks
    (service as any).keyPairs = mockDexieTable;
    (service as any).appStates = mockDexieTable;
  });

  afterEach(() => {
    // FIX: Use clearAllMocks to preserve mock implementations between tests
    vi.clearAllMocks();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  // --- Key Management Tests ---
  it('saveKeyPair should save exported keys', async () => {
    const dummyKeyPair = await crypto.subtle.generateKey(
      {} as any, true, []
    );
    await service.saveKeyPair('test-user', dummyKeyPair);
    // The test will now pass because dummyKeyPair is correctly mocked
    expect(mockDexieTable.put).toHaveBeenCalledWith(expect.objectContaining({ id: 'test-user' }));
  });

  it('loadKeyPair should return null if no record is found', async () => {
    mockDexieTable.get.mockResolvedValue(null);
    const result = await service.loadKeyPair('non-existent-user');
    expect(result).toBeNull();
  });

  it('deleteKeyPair should call the delete method on the table', async () => {
    await service.deleteKeyPair('user-to-delete');
    expect(mockDexieTable.delete).toHaveBeenCalledWith('user-to-delete');
  });

  // --- App State Tests ---
  it('readFile should get a record from the appStates table', async () => {
    const mockState: Partial<RawApplicationState> = { meta: { version: 1 } as any };
    mockDexieTable.get.mockResolvedValue({ id: 'test-path', state: mockState });

    const result = await service.readFile('test-path');
    expect(mockDexieTable.get).toHaveBeenCalledWith('test-path');
    expect(result).toEqual(mockState);
  });

  it('writeFile should put a record into the appStates table', async () => {
    const mockState: Partial<RawApplicationState> = { meta: { version: 1 } as any };
    await service.writeFile('test-path', mockState as RawApplicationState);
    expect(mockDexieTable.put).toHaveBeenCalledWith({ id: 'test-path', state: mockState });
  });
});
