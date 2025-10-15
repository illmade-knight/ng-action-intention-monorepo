import { inject, Injectable } from '@angular/core';
import { HttpClient } from '@angular/common/http';
import { firstValueFrom, Observable } from 'rxjs';
import { NG_CONTACTS_CONFIG } from '../../config';
import { UserLookup } from '../user-lookup/user-lookup';
import type { AddressBookContact } from '../../models/address-book-contact.model';

@Injectable({
  providedIn: 'root',
})
export class Contacts {
  private readonly http = inject(HttpClient);
  private readonly config = inject(NG_CONTACTS_CONFIG);
  private readonly userLookup = inject(UserLookup);
  private readonly messagingServiceUrl = this.config.messagingServiceUrl;

  /**
   * Fetches the logged-in user's address book from the messaging service.
   */
  getAddressBook(): Observable<AddressBookContact[]> {
    return this.http.get<AddressBookContact[]>(`${this.messagingServiceUrl}/api/address-book`);
  }

  /**
   * Adds a new contact to the user's address book after looking them up.
   * @param email The email of the contact to add.
   */
  async addContactByEmail(email: string): Promise<void> {
    const user = await this.userLookup.findByEmail(email);
    if (!user) {
      throw new Error(`User with email ${email} not found.`);
    }
    await firstValueFrom(
      this.http.post<void>(`${this.messagingServiceUrl}/api/address-book/contacts`, { email: user.email })
    );
  }
}
