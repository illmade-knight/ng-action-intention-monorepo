import { Injectable, signal, WritableSignal, computed, effect } from '@angular/core';
import { AddressBookContact } from '@ng-action-intention/ng-contacts';
import { ChatMessage } from '@ng-action-intention/ng-chat-ui';

@Injectable({
  providedIn: 'root',
})
export class Conversation {
  // --- State Signals ---
  public activeContact: WritableSignal<AddressBookContact | null> = signal(null);
  public messages: WritableSignal<ChatMessage[]> = signal([]);

  // --- Derived Signals (Computed) ---
  public activeRecipientAlias = computed(() => this.activeContact()?.alias ?? 'Select a conversation');
  public hasActiveConversation = computed(() => !!this.activeContact());

  constructor() {
    // Log changes to the active conversation for debugging
    effect(() => {
      console.log(`Conversation changed to: ${this.activeContact()?.alias ?? 'none'}`);
    });
  }

  // --- Public API Methods ---
  public setActiveConversation(contact: AddressBookContact): void {
    this.activeContact.set(contact);
    // When a new conversation is started, clear previous messages
    // and load the real ones from a service (to be implemented).
    this.messages.set([]);
    this.loadMessagesFor(contact.id);
  }

  public addMessage(message: ChatMessage): void {
    this.messages.update(currentMessages => [...currentMessages, message]);
  }

  private loadMessagesFor(contactId: string): void {
    // This is where you would call a service to get the message
    // history for the given contactId. For now, we can add a placeholder.
    console.log(`TODO: Load message history for contact ${contactId}`);
    this.addMessage({
      id: 'placeholder-1',
      text: `This is the start of your conversation with ${this.activeContact()?.alias}.`,
      timestamp: new Date(),
      author: { id: 'system', alias: 'System' },
      isMe: false,
    });
  }
}
