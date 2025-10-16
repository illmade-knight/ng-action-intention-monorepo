/**
 * This is the master setup file for the Vitest test environment.
 * Imports are listed in a strict, sequential order to ensure
 * zone.js patching and Angular's setup run correctly.
 */

// STEP 1: PATCH THE ASYNC ENVIRONMENT
// These must be the very first imports to run.
import '@analogjs/vitest-angular/setup-zone';
import 'zone.js/testing'; // <-- THIS IS THE CRITICAL FIX. Provides fakeAsync().

// STEP 2: LOAD ANGULAR'S COMPILER
import '@angular/compiler'; // Must come after zone patches

// STEP 3: LOAD ANGULAR'S TESTBED
import { getTestBed } from '@angular/core/testing';
import {
  BrowserTestingModule,
  platformBrowserTesting,
} from '@angular/platform-browser/testing';

// STEP 4: APPLY POLYFILLS
// This polyfill prevents crashes in the JSDOM environment where the
// Web Crypto API is not available.
if (typeof global.crypto === 'undefined' || typeof global.crypto.subtle === 'undefined') {
  Object.defineProperty(global, 'crypto', {
    value: {
      randomUUID: () => 'mock-uuid-12345',
      subtle: {
        digest: async () => new ArrayBuffer(0),
        exportKey: async () => new ArrayBuffer(0),
        importKey: async () => ({}),
      },
    },
    writable: true,
    configurable: true,
  });
}

// STEP 5: INITIALIZE THE ANGULAR TESTBED
// Now that all patches are applied, we can safely initialize.
try {
  getTestBed().initTestEnvironment(
    BrowserTestingModule,
    platformBrowserTesting()
  );
} catch (e) {
  // Environment already initialized, ignore.
}
