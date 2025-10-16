import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { URN } from '@illmade-knight/action-intention-protos';
import { AngularKeyClient } from './angular-key-client';
import { NG_CLIENTS_CONFIG, NgClientsConfig } from './ng-clients.config';

// Mock configuration for the test environment
const mockConfig: NgClientsConfig = {
  keyServiceUrl: 'https://keys.example.com',
  routingServiceUrl: 'https://routing.example.com',
};

describe('AngularKeyClient', () => {
  let service: AngularKeyClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AngularKeyClient,
        { provide: NG_CLIENTS_CONFIG, useValue: mockConfig },
      ],
    });
    service = TestBed.inject(AngularKeyClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getKey', () => {
    it('should GET a key and return it as a Uint8Array', async () => {
      const user = URN.create('user', 'test-user');
      const expectedUrl = `${mockConfig.keyServiceUrl}/keys/${user.toString()}`;
      const mockArrayBuffer = new Uint8Array([1, 2, 3, 4]).buffer;

      const getKeyPromise = service.getKey(user);

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      expect(req.request.responseType).toBe('arraybuffer');
      req.flush(mockArrayBuffer);

      const result = await getKeyPromise;
      expect(result).toBeInstanceOf(Uint8Array);
      expect(result).toEqual(new Uint8Array([1, 2, 3, 4]));
    });
  });

  describe('storeKey', () => {
    it('should POST a key to the key service', async () => {
      const user = URN.create('user', 'test-user');
      const key = new Uint8Array([5, 6, 7, 8]);
      const expectedUrl = `${mockConfig.keyServiceUrl}/keys/${user.toString()}`;

      const storeKeyPromise = service.storeKey(user, key);

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      // The HttpClient sends the underlying ArrayBuffer
      expect(req.request.body).toEqual(key.buffer);
      req.flush(null, { status: 201, statusText: 'Created' });

      // 👈 FIX: Change to toBeNull to match HttpClient's return value for 204/201 without body
      await expect(storeKeyPromise).resolves.toBeNull();
    });
  });
});
