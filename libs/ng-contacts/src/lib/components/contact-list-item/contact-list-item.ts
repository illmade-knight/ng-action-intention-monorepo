import { ChangeDetectionStrategy, Component, Input, Output, EventEmitter } from '@angular/core';
import { CommonModule } from '@angular/common';
import { AddressBookContact } from '../../models/address-book-contact.model';

@Component({
  selector: 'lib-contact-list-item',
  standalone: true,
  imports: [CommonModule],
  templateUrl: './contact-list-item.html',
  styleUrls: ['./contact-list-item.scss'],
  changeDetection: ChangeDetectionStrategy.OnPush,
})
export class ContactListItem {
  @Input({ required: true }) contact!: AddressBookContact;
  // This component now emits an event when it is selected
  @Output() itemSelected = new EventEmitter<void>();

  onSelect(): void {
    this.itemSelected.emit();
  }
}
