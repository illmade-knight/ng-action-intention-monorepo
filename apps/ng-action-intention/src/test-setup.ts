// src/test-setup.ts

import '@angular/compiler';
import '@analogjs/vitest-angular/setup-zone';
import { getTestBed } from '@angular/core/testing';
// Note: BrowserTestingModule and platformBrowserTesting may not be necessary if using Analog,
// but we re-add them as a fallback for the old initTestEnvironment signature.
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';


// --- Web Crypto API Mock (for JSDOM/Client.spec.ts) ---
// This should still be included to fix the crypto errors.
if (typeof global.crypto === 'undefined' || typeof global.crypto.subtle === 'undefined') {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => 'mock-uuid-12345',
      subtle: {
        // Must be a function that returns a Promise resolving to an ArrayBuffer
        // Dexie/Web Crypto API needs this for hashing operations.
        digest: async () => new ArrayBuffer(0),
        // Keep other necessary methods if you had to add them:
        exportKey: async () => new ArrayBuffer(0), // Returns an ArrayBuffer
        importKey: async () => ({}),
      },
    },
    writable: true,
    configurable: true,
  });
}

// --- FIX: Explicitly initialize Angular Test Environment ---
// Analog's setup is intended to handle this, but when mixing with older Angular
// concepts (or complex setups), explicit initialization is required.
try {
  getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting()
  );
} catch (e) {
  // Environment already initialized, ignore.
}
