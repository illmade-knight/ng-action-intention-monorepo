import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, vi, beforeEach } from 'vitest';
import { of } from 'rxjs';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';
import { ContactList } from './contact-list';
import { Contacts } from '../../services/contacts/contacts';
import { AddressBookContact } from '../../models/address-book-contact.model';

// --- Mocks defined once at the top ---
const mockContacts: AddressBookContact[] = [
  { id: '1', alias: 'User One', email: 'one@example.com' },
  { id: '2', alias: 'User Two', email: 'two@example.com' },
];

const mockContactsService = {
  getAddressBook: () => of(mockContacts),
  addContactByEmail: vi.fn().mockResolvedValue(undefined),
};

const mockEmptyContactsService = {
  getAddressBook: () => of([]),
  addContactByEmail: vi.fn(),
};

describe('ContactList', () => {
  let fixture: ComponentFixture<ContactList>;
  let contactsService: Contacts;

  // --- SCENARIO 1: Tests with a standard list of contacts ---
  describe('with a list of contacts', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ContactList],
        providers: [
          provideAnimationsAsync('noop'),
          { provide: Contacts, useValue: mockContactsService },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ContactList);
      contactsService = TestBed.inject(Contacts);
      mockContactsService.addContactByEmail.mockClear();
      fixture.detectChanges();
    });

    it('should create', () => {
      expect(fixture.componentInstance).toBeTruthy();
    });

    it('should fetch and display a list of contacts', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const items = compiled.querySelectorAll('lib-contact-list-item');
      expect(items.length).toBe(2);
    });

    it('should call the add contact service method when addContact is invoked', async () => {
      const emailToAdd = 'new.user@example.com';
      await fixture.componentInstance.addContact(emailToAdd);
      expect(contactsService.addContactByEmail).toHaveBeenCalledWith(emailToAdd);
    });
  });

  // --- SCENARIO 2: Test with an empty list of contacts ---
  describe('with an empty list of contacts', () => {
    beforeEach(async () => {
      await TestBed.configureTestingModule({
        imports: [ContactList],
        providers: [
          provideAnimationsAsync('noop'),
          { provide: Contacts, useValue: mockEmptyContactsService },
        ],
      }).compileComponents();

      fixture = TestBed.createComponent(ContactList);
      fixture.detectChanges();
    });

    it('should display the "No contacts found" message', async () => {
      await fixture.whenStable();
      fixture.detectChanges();
      const compiled = fixture.nativeElement as HTMLElement;
      const emptyMessage = compiled.querySelector('p');
      expect(emptyMessage?.textContent).toContain('No contacts found.');
    });
  });
});
