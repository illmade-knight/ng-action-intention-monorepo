import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { URN, SecureEnvelope } from '@illmade-knight/action-intention-protos';
import { AngularRoutingClient } from './angular-routing-client';
import { NG_CLIENTS_CONFIG, NgClientsConfig } from './ng-clients.config';

const mockConfig: NgClientsConfig = {
  keyServiceUrl: 'https://keys.example.com',
  routingServiceUrl: 'https://routing.example.com',
};

describe('AngularRoutingClient', () => {
  let service: AngularRoutingClient;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        AngularRoutingClient,
        { provide: NG_CLIENTS_CONFIG, useValue: mockConfig },
      ],
    });
    service = TestBed.inject(AngularRoutingClient);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('send', () => {
    it('should POST a serialized envelope to the routing service', async () => {
      const envelope: SecureEnvelope = {
        senderId: URN.create('user', 'sender'),
        recipientId: URN.create('user', 'recipient'),
        messageId: 'uuid-123',
        encryptedSymmetricKey: new Uint8Array([1, 2, 3]),
        encryptedData: new Uint8Array([4, 5, 6]),
        signature: new Uint8Array(),
      };
      const expectedUrl = `${mockConfig.routingServiceUrl}/send`;

      const sendPromise = service.send(envelope);

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.headers.get('Content-Type')).toBe('application/json');
      req.flush(null, { status: 204, statusText: 'No Content' });

      // 👈 FIX: Change to toBeNull to match HttpClient's return value for 204/201 without body
      await expect(sendPromise).resolves.toBeNull();
    });
  });

  describe('receive', () => {
    it('should GET messages and deserialize them correctly using helpers', async () => {
      const user = URN.create('user', 'test-user');
      const expectedUrl = `${mockConfig.routingServiceUrl}/receive/${user.toString()}`;

      // The raw JSON response from the server will have base64 strings.
      const mockJsonResponse = {
        envelopes: [
          {
            senderId: 'urn:sm:user:sender1',
            recipientId: user.toString(),
            messageId: 'msg1',
            encryptedSymmetricKey: btoa('key1'), // base64 string
            encryptedData: btoa('data1'),       // base64 string
            signature: '',
          },
        ],
      };

      const receivePromise = service.receive(user);
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockJsonResponse);

      const envelopes = await receivePromise;
      expect(envelopes.length).toBe(1);
      expect(envelopes[0].messageId).toBe('msg1');

      // 👈 FIX: Use Array.from() for reliable comparison of Uint8Array content
      expect(Array.from(envelopes[0].encryptedData)).toEqual(
        Array.from(new TextEncoder().encode('data1'))
      );
      expect(Array.from(envelopes[0].encryptedSymmetricKey)).toEqual(
        Array.from(new TextEncoder().encode('key1'))
      );
    });
  });
});
