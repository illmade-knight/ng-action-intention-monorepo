import { ChangeDetectionStrategy, Component, inject, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { toSignal } from '@angular/core/rxjs-interop';
import { Contacts } from '../../services/contacts/contacts';
import { ContactListItem } from '../contact-list-item/contact-list-item';
import { AddressBookContact } from '../../models/address-book-contact.model';

@Component({
  selector: 'ngc-contact-list',
  standalone: true,
  imports: [CommonModule, ContactListItem],
  templateUrl: './contact-list.html',
  styleUrls: ['./contact-list.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactList {
  private readonly contactsService = inject(Contacts);
  public readonly contacts = toSignal(this.contactsService.getAddressBook(), {
    initialValue: [] as AddressBookContact[],
  });

  @Output() contactSelected = new EventEmitter<AddressBookContact>();

  selectContact(contact: AddressBookContact): void {
    this.contactSelected.emit(contact);
  }

  /**
   * Public method to be called from the template or parent component
   * to add a new contact by their email address.
   * @param email The email of the user to add.
   */
  public async addContact(email: string): Promise<void> {
    try {
      await this.contactsService.addContactByEmail(email);
      // Here you might want to refresh the contact list
      // For now, we'll just log success.
      console.log(`Successfully added contact: ${email}`);
    } catch (error) {
      console.error(`Failed to add contact: ${email}`, error);
      // Handle the error in the UI, e.g., show a toast message
    }
  }
}
