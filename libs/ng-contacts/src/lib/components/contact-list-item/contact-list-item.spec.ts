import { ComponentFixture, TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach } from 'vitest';
import { ContactListItem } from './contact-list-item';
import { AddressBookContact } from '../../models/address-book-contact.model';

describe('ContactListItem', () => {
  let component: ContactListItem;
  let fixture: ComponentFixture<ContactListItem>;

  const mockContact: AddressBookContact = {
    id: 'contact-1',
    alias: 'John Doe',
    email: 'john.doe@email.com',
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactListItem],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactListItem);
    component = fixture.componentInstance;
    component.contact = mockContact;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  it('should display the contact alias and email', () => {
    const compiled = fixture.nativeElement as HTMLElement;
    const aliasElement = compiled.querySelector('.contact-alias');
    const emailElement = compiled.querySelector('.contact-email');

    expect(aliasElement?.textContent).toContain('John Doe');
    expect(emailElement?.textContent).toContain('john.doe@email.com');
  });
});
