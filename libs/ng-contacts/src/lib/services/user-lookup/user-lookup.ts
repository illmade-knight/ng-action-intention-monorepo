import { inject, Injectable } from '@angular/core';
import { HttpClient, HttpErrorResponse } from '@angular/common/http';
import { firstValueFrom, of } from 'rxjs';
import { catchError } from 'rxjs/operators';
import { NG_CONTACTS_CONFIG } from '../../config';
import type { AddressBookContact } from '../../models/address-book-contact.model';

@Injectable({
  providedIn: 'root',
})
export class UserLookup {
  private http = inject(HttpClient);
  private config = inject(NG_CONTACTS_CONFIG);
  private identityServiceUrl = this.config.identityServiceUrl;

  /**
   * Finds a user by their email address via the identity service.
   * @param email The email to look up.
   * @returns A promise that resolves to the user's public profile or null if not found or on error.
   */
  async findByEmail(email: string): Promise<AddressBookContact | null> {
    try {
      return await firstValueFrom(
        this.http.get<AddressBookContact>(`${this.identityServiceUrl}/api/users/by-email/${email}`).pipe(
          // Handle HTTP errors gracefully
          catchError((error: HttpErrorResponse) => {
            console.error(`Error looking up user by email ${email}:`, error.message);
            // Return null to indicate the user was not found or an error occurred
            return of(null);
          })
        )
      );
    } catch (error) {
      console.error('An unexpected error occurred in findByEmail:', error);
      return null;
    }
  }
}
