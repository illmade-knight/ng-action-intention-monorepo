import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Client } from './client';
import { IndexedDb } from '../indexed-db/indexed-db';
import { AngularKeyClient } from './angular-key-client';
import { AngularRoutingClient } from './angular-routing-client';
import { URN } from '@illmade-knight/action-intention-protos';
import { Crypto } from '@ng-action-intention/sdk';

// Mocks for all dependencies
const mockDbProvider = {
  loadKeyPair: vi.fn(),
  saveKeyPair: vi.fn(),
  deleteKeyPair: vi.fn(),
};
const mockKeyClient = {
  getKey: vi.fn(),
  storeKey: vi.fn(),
};
const mockRoutingClient = {
  send: vi.fn(),
  receive: vi.fn(),
};

describe('Client', () => {
  let client: Client;

  beforeEach(() => {
    vi.resetAllMocks();
    TestBed.configureTestingModule({
      providers: [
        Client,
        { provide: IndexedDb, useValue: mockDbProvider },
        { provide: AngularKeyClient, useValue: mockKeyClient },
        { provide: AngularRoutingClient, useValue: mockRoutingClient },
      ],
    });
    client = TestBed.inject(Client);
  });

  it('should be created', () => {
    expect(client).toBeTruthy();
  });

  describe('getOrCreateKeys', () => {
    it('should return existing keys if found in storage', async () => {
      const fakeKeys = { publicKey: 'pub', privateKey: 'priv' } as unknown as CryptoKeyPair;
      mockDbProvider.loadKeyPair.mockResolvedValue(fakeKeys);

      const result = await client.getOrCreateKeys('test-user');

      expect(result).toEqual(fakeKeys);
      expect(mockDbProvider.saveKeyPair).not.toHaveBeenCalled();
    });

    it('should generate, save, and store new keys if not found', async () => {
      mockDbProvider.loadKeyPair.mockResolvedValue(null);

      // We don't need real crypto in this test, just a valid object
      const fakeNewKeys = { publicKey: {}, privateKey: {} } as CryptoKeyPair;
      vi.spyOn(Crypto.prototype, 'generateEncryptionKeys').mockResolvedValue(fakeNewKeys);
      // Mock the exportKey function which is part of the Web Crypto API
      vi.spyOn(crypto.subtle, 'exportKey').mockResolvedValue(new ArrayBuffer(8));


      await client.getOrCreateKeys('test-user');

      expect(mockDbProvider.saveKeyPair).toHaveBeenCalledWith('test-user', fakeNewKeys);
      expect(mockKeyClient.storeKey).toHaveBeenCalled();
    });
  });

  describe('sendMessage', () => {
    it('should get public key, encrypt, and send the envelope', async () => {
      const fakePublicKeyBytes = new Uint8Array([1, 2, 3]);
      const fakePublicKey = {} as CryptoKey;
      mockKeyClient.getKey.mockResolvedValue(fakePublicKeyBytes);

      // Mock the native importKey function
      vi.spyOn(crypto.subtle, 'importKey').mockResolvedValue(fakePublicKey);
      // Mock the crypto encrypt method
      const fakePayload = { encryptedSymmetricKey: new Uint8Array(), encryptedData: new Uint8Array() };
      vi.spyOn(Crypto.prototype, 'encrypt').mockResolvedValue(fakePayload);

      await client.sendMessage('sender-id', 'recipient-id', 'hello');

      expect(mockKeyClient.getKey).toHaveBeenCalledWith(URN.create('user', 'recipient-id'));
      expect(mockRoutingClient.send).toHaveBeenCalled();
    });
  });

  describe('deleteLocalKeys', () => {
    it('should call the storage provider to delete the key pair', async () => {
      const userId = 'user-to-delete';
      await client.deleteLocalKeys(userId);
      expect(mockDbProvider.deleteKeyPair).toHaveBeenCalledWith(userId);
      expect(mockDbProvider.deleteKeyPair).toHaveBeenCalledTimes(1);
    });
  });
});
