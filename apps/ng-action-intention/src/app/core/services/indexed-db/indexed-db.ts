import { Injectable } from '@angular/core';
import Dexie, { Table } from 'dexie';
import { StorageProvider, FileManifest, RawApplicationState } from '@ng-action-intention/sdk';
import { Temporal } from '@js-temporal/polyfill';

export interface KeyPairRecord {
  id: string;
  publicKey: JsonWebKey;
  privateKey: JsonWebKey;
}

export interface AppStateRecord {
  id: string;
  state: RawApplicationState;
}

@Injectable({ providedIn: 'root' })
export class IndexedDb extends Dexie implements StorageProvider {
  private keyPairs!: Table<KeyPairRecord, string>;
  private appStates!: Table<AppStateRecord, string>;

  constructor() {
    super('ActionIntentionDB');
    this.version(1).stores({
      keyPairs: 'id',
      appStates: 'id',
    });
  }

  async readFile(path: string): Promise<RawApplicationState> {
    const record = await this.appStates.get(path);
    if (!record) throw new Error(`State not found in IndexedDB at path: ${path}`);
    return record.state;
  }

  async writeFile(path: string, state: RawApplicationState): Promise<FileManifest> {
    await this.appStates.put({ id: path, state });
    return {
      path,
      size: JSON.stringify(state).length,
      lastModified: Temporal.Now.instant(),
    };
  }

  async saveKeyPair(userId: string, keyPair: CryptoKeyPair): Promise<void> {
    const publicKey = await crypto.subtle.exportKey('jwk', keyPair.publicKey);
    const privateKey = await crypto.subtle.exportKey('jwk', keyPair.privateKey);
    await this.keyPairs.put({ id: userId, publicKey, privateKey });
  }

  async loadKeyPair(userId: string): Promise<CryptoKeyPair | null> {
    const record = await this.keyPairs.get(userId);
    if (!record) return null;
    try {
      const publicKey = await crypto.subtle.importKey('jwk', record.publicKey, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['encrypt']);
      const privateKey = await crypto.subtle.importKey('jwk', record.privateKey, { name: 'RSA-OAEP', hash: 'SHA-256' }, true, ['decrypt']);
      return { publicKey, privateKey };
    } catch (error) {
      console.error('Failed to import stored key, deleting corrupted record:', error);
      await this.keyPairs.delete(userId);
      return null;
    }
  }

  async deleteKeyPair(userId: string): Promise<void> {
    await this.keyPairs.delete(userId);
  }
}
