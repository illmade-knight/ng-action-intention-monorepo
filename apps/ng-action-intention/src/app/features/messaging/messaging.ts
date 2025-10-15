import { Component, inject } from '@angular/core';
import { CommonModule } from '@angular/common';
import { Conversation } from '../../core/services/conversation/conversation';
import { ContactList } from '@ng-action-intention/ng-contacts';
import { ChatWindow, ChatMessage } from '@ng-action-intention/ng-chat-ui';
import { MessageTransport } from '../../core/services/message-transport/message-transport';
import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-messaging',
  standalone: true,
  imports: [CommonModule, ContactList, ChatWindow],
  templateUrl: './messaging.html',
  styleUrls: ['./messaging.scss'],
})
export class Messaging {
  public conversation = inject(Conversation);
  private transport = inject(MessageTransport);
  private auth = inject(Auth);

  /**
   * Handles the messageSent event from the ChatWindow UI component.
   * @param messageText The plaintext message to be sent.
   */
  async handleSend(messageText: string): Promise<void> {
    const recipient = this.conversation.activeContact();
    const sender = this.auth.currentUser();

    if (!recipient || !sender) {
      console.error('Cannot send message: no active recipient or sender.');
      return;
    }

    try {
      // 1. Send the message via the transport service (which handles encryption)
      await this.transport.sendMessage(recipient.id, messageText);

      // 2. Add the message to the local state for an immediate UI update
      const optimisticMessage: ChatMessage = {
        id: crypto.randomUUID(),
        text: messageText,
        timestamp: new Date(),
        author: { id: sender.id, alias: 'Me' }, // Use current user's info
        isMe: true,
      };
      this.conversation.addMessage(optimisticMessage);
    } catch (error) {
      console.error('Failed to send message:', error);
      // Here you would show an error to the user in the UI
    }
  }
}
