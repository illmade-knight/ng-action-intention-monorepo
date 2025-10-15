import { inject, Injectable } from '@angular/core';
import {
  Crypto,
  EncryptedPayload,
  StorageProvider,
} from '@ng-action-intention/sdk';
import { URN, SecureEnvelope  } from '@illmade-knight/action-intention-protos';
import { AngularKeyClient } from '../client/angular-key-client';
import { AngularRoutingClient } from '../client/angular-routing-client';
import { IndexedDb } from '../indexed-db/indexed-db';

@Injectable({ providedIn: 'root' })
export class Client {
  private storage: StorageProvider = inject(IndexedDb);
  private keyClient = inject(AngularKeyClient);
  private routingClient = inject(AngularRoutingClient);
  private crypto = new Crypto();

  /**
   * Checks if cryptographic keys for a given user are stored locally.
   */
  async checkForLocalKeys(userId: string): Promise<boolean> {
    const keys = await this.storage.loadKeyPair(userId);
    return !!keys;
  }

  /**
   * Retrieves keys from storage or generates new ENCRYPTION keys.
   */
  async getOrCreateKeys(userId: string): Promise<CryptoKeyPair> {
    const existingKeys = await this.storage.loadKeyPair(userId);
    if (existingKeys) {
      return existingKeys;
    }
    // Correctly call generateEncryptionKeys() as defined in the sdk/crypto.ts
    const newKeys = await this.crypto.generateEncryptionKeys();
    await this.storage.saveKeyPair(userId, newKeys);

    // Export and store the public key on the remote server
    const publicKeyBytes = await crypto.subtle.exportKey('spki', newKeys.publicKey);
    await this.keyClient.storeKey(URN.create('user', userId), new Uint8Array(publicKeyBytes));
    return newKeys;
  }

  /**
   * Fetches and imports a user's public key from the remote key service.
   */
  private async getAndImportPublicKey(userId: string): Promise<CryptoKey> {
    const userUrn = URN.create('user', userId);
    const publicKeyBytes = await this.keyClient.getKey(userUrn);
    // Use the browser's native crypto API to import the key for use.
    return crypto.subtle.importKey('spki', new Uint8Array(publicKeyBytes), { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']);
  }

  /**
   * Encrypts a plaintext message and sends it via the routing service.
   */
  async sendMessage(senderId: string, recipientId: string, plaintext: string): Promise<void> {
    // Correctly fetch and import the recipient's public key.
    const publicKey = await this.getAndImportPublicKey(recipientId);
    const encodedText = new TextEncoder().encode(plaintext);

    // Correctly use the encrypt method which returns an EncryptedPayload object.
    const payload: EncryptedPayload = await this.crypto.encrypt(publicKey, encodedText);

    const envelope: SecureEnvelope = {
      senderId: URN.create('user', senderId),
      recipientId: URN.create('user', recipientId),
      messageId: crypto.randomUUID(),
      encryptedSymmetricKey: payload.encryptedSymmetricKey,
      encryptedData: payload.encryptedData,
      signature: new Uint8Array(), // Signature implementation is a separate concern
    };

    await this.routingClient.send(envelope);
  }

  /**
   * Fetches any pending encrypted messages for the user.
   */
  async getMessages(userId: string): Promise<SecureEnvelope[]> {
    const userUrn = URN.create('user', userId);
    return this.routingClient.receive(userUrn);
  }

  /**
   * Decrypts a received secure envelope.
   */
  async decryptMessage(privateKey: CryptoKey, envelope: SecureEnvelope): Promise<string> {
    // Correctly call the decrypt method with its three distinct arguments.
    const decryptedBytes = await this.crypto.decrypt(
      privateKey,
      envelope.encryptedSymmetricKey,
      envelope.encryptedData
    );
    return new TextDecoder().decode(decryptedBytes);
  }

  /**
   * Deletes the cryptographic keys for a given user from local storage.
   */
  async deleteLocalKeys(userId: string): Promise<void> {
    await this.storage.deleteKeyPair(userId);
  }
}
