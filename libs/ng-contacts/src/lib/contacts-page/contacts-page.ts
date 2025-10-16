import { Component } from '@angular/core';
import { ContactList } from "../components/contact-list/contact-list";

@Component({
  selector: 'ngc-contacts-page',
  imports: [
    ContactList
  ],
  templateUrl: './contacts-page.html',
  styleUrls: ['./contacts-page.scss'],
})
export class ContactsPage {}
