import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { UserLookup } from './user-lookup';
import { NG_CONTACTS_CONFIG } from '../../config';
import { AddressBookContact } from '../../models/address-book-contact.model';

// Mock configuration for the test environment
const mockConfig: { identityServiceUrl: string } = {
  identityServiceUrl: 'https://test-identity-service.com',
};

describe('UserLookup', () => {
  let service: UserLookup;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        UserLookup,
        // Provide the mock config for the InjectionToken
        { provide: NG_CONTACTS_CONFIG, useValue: mockConfig },
      ],
    });
    service = TestBed.inject(UserLookup);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('findByEmail', () => {
    it('should find a user by email using the configured URL', async () => {
      const mockUser: AddressBookContact = { id: 'user-1', email: 'test@example.com', alias: 'Test' };
      const emailToFind = 'test@example.com';
      const expectedUrl = `${mockConfig.identityServiceUrl}/api/users/by-email/${emailToFind}`;

      const userPromise = service.findByEmail(emailToFind);

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockUser);

      await expect(userPromise).resolves.toEqual(mockUser);
    });
  });
});
