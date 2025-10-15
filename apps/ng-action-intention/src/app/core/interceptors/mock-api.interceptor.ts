import { HttpInterceptorFn, HttpResponse } from '@angular/common/http';
import { of } from 'rxjs';
import { delay } from 'rxjs/operators';

// --- In-memory state for our mock backend --- [cite: 44]
let MOCK_DB = {
  isLoggedIn: true,
  user: { id: 'mock-user-123', email: 'dev@example.com', name: 'DevUser' },
  contacts: [{ id: 'contact-abc', email: 'friend@example.com', alias: 'Friend' }],
  keys: new Map<string, Uint8Array>(),
  messages: [] as any[],
};
// ---------------------------------------------

export const mockApiInterceptor: HttpInterceptorFn = (req, next) => {
  const { url, method, body } = req;

  // Function to handle routing and return a response [cite: 46]
  const handleRoute = () => {
    // --- Identity Service Mocks ---
    if (url.endsWith('/api/auth/status') && method === 'GET') {
      if (MOCK_DB.isLoggedIn) {
        return new HttpResponse({ status: 200, body: { authenticated: true, user: { ...MOCK_DB.user, token: 'mock.jwt.string' } } }); // [cite: 46, 47]
      }
      return new HttpResponse({ status: 200, body: { authenticated: false, user: null } }); //[cite: 47]
    }
    if (url.endsWith('/api/auth/logout') && method === 'POST') {
      MOCK_DB.isLoggedIn = false; //[cite: 48]
      return new HttpResponse({ status: 204 }); // [cite: 49]
    }

    // --- ng-contacts Library Mocks ---
    if (url.endsWith('/api/address-book') && method === 'GET') {
      return new HttpResponse({ status: 200, body: MOCK_DB.contacts }); //[cite: 50]
    }

    // --- Key Service Mocks ---
    if (url.includes('/keys/') && method === 'POST') {
      const urn = url.split('/keys/')[1]; // [cite: 53]
      MOCK_DB.keys.set(urn, new Uint8Array(body as ArrayBuffer)); //[cite: 54]
      return new HttpResponse({ status: 201 }); //[cite: 55]
    }
    if (url.includes('/keys/') && method === 'GET') {
      const urn = url.split('/keys/')[1]; //[cite: 56]
      const key = MOCK_DB.keys.get(urn);
      return new HttpResponse({ status: 200, body: key?.buffer }); // [cite: 57]
    }

    // --- Routing Service Mocks ---
    if (url.endsWith('/send') && method === 'POST') {
      MOCK_DB.messages.push(body); // [cite: 58]
      return new HttpResponse({ status: 202 }); // [cite: 59]
    }
    if (url.includes('/receive/')) {
      const messages = [...MOCK_DB.messages];
      MOCK_DB.messages = []; // Clear queue after retrieval [cite: 61]
      return new HttpResponse({ status: 200, body: { envelopes: messages } }); // [cite: 61]
    }

    // If no route matches, return null to pass the request through [cite: 62]
    return null;
  };

  const mockResponse = handleRoute();

  if (mockResponse) {
    // Return the mock response with a realistic network delay [cite: 63]
    return of(mockResponse).pipe(delay(300));
  }

  // If the URL is not a mock route, let it pass through [cite: 64]
  return next(req);
};
