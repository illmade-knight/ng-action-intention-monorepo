import { TestBed } from '@angular/core/testing';
import {
  HttpTestingController,
  provideHttpClientTesting,
} from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Contacts } from './contacts';
import { UserLookup } from '../user-lookup/user-lookup';
import { NG_CONTACTS_CONFIG, NgContactsConfig } from '../../config';
import { AddressBookContact } from '../../models/address-book-contact.model';

const mockConfig: NgContactsConfig = {
  identityServiceUrl: 'https://test-identity.com',
  messagingServiceUrl: 'https://test-messaging.com',
};

const mockUserLookup = {
  findByEmail: vi.fn(),
};

describe('Contacts', () => {
  let service: Contacts;
  let httpMock: HttpTestingController;

  beforeEach(() => {
    // Reset mocks before each test
    mockUserLookup.findByEmail.mockClear();

    TestBed.configureTestingModule({
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        Contacts,
        { provide: NG_CONTACTS_CONFIG, useValue: mockConfig },
        { provide: UserLookup, useValue: mockUserLookup },
      ],
    });
    service = TestBed.inject(Contacts);
    httpMock = TestBed.inject(HttpTestingController);
  });

  afterEach(() => {
    httpMock.verify();
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('getAddressBook', () => {
    it('should fetch the address book from the messaging service URL', () => {
      const mockContacts: AddressBookContact[] = [{ id: '1', alias: 'Test', email: 'test@test.com' }];
      const expectedUrl = `${mockConfig.messagingServiceUrl}/api/address-book`;

      service.getAddressBook().subscribe(contacts => {
        expect(contacts).toEqual(mockContacts);
      });

      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('GET');
      req.flush(mockContacts);
    });
  });

  describe('addContactByEmail', () => {
    it('should find a user and add them to the address book', async () => {
      const emailToAdd = 'new@contact.com';
      const foundUser: AddressBookContact = { id: 'user-2', email: emailToAdd, alias: 'Newbie' };
      mockUserLookup.findByEmail.mockResolvedValue(foundUser);

      const addContactPromise = service.addContactByEmail(emailToAdd);

      await Promise.resolve(); // Allow promises to resolve

      expect(mockUserLookup.findByEmail).toHaveBeenCalledWith(emailToAdd);

      const expectedUrl = `${mockConfig.messagingServiceUrl}/api/address-book/contacts`;
      const req = httpMock.expectOne(expectedUrl);
      expect(req.request.method).toBe('POST');
      expect(req.request.body).toEqual({ email: foundUser.email });
      req.flush(null, { status: 204, statusText: 'No Content' });

      await expect(addContactPromise).resolves.toBeUndefined();
    });

    it('should throw an error if the user is not found', async () => {
      const emailToAdd = 'notfound@contact.com';
      mockUserLookup.findByEmail.mockResolvedValue(null);

      await expect(service.addContactByEmail(emailToAdd))
        .rejects.toThrow(`User with email ${emailToAdd} not found.`);

      httpMock.expectNone(`${mockConfig.messagingServiceUrl}/api/address-book/contacts`);
    });
  });
});
