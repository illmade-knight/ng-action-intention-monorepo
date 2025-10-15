import { Injectable, inject } from '@angular/core';
import { SecureEnvelope } from '@illmade-knight/action-intention-protos';
import { Client } from '../client/client';
import { Auth } from '../auth/auth';

@Injectable({
  providedIn: 'root'
})
export class MessageTransport {
  private auth = inject(Auth);
  private client = inject(Client);

  /**
   * Orchestrates sending a secure message by delegating to the client service.
   */
  async sendMessage(recipientId: string, plaintext: string): Promise<void> {
    const sender = this.auth.currentUser();
    if (!sender) {
      throw new Error('Cannot send message: no authenticated user.');
    }
    // Corrected: The Client service now handles all key lookups internally.
    // We only need to provide the sender, recipient, and plaintext.
    return this.client.sendMessage(sender.id, recipientId, plaintext);
  }

  /**
   * Fetches and decrypts the first available message for the current user.
   */
  async getAndDecryptMessages(): Promise<{ from: string; message: string } | null> {
    const user = this.auth.currentUser();
    if (!user) {
      throw new Error('Cannot get messages: no authenticated user.');
    }
    const messages: SecureEnvelope[] = await this.client.getMessages(user.id);
    if (messages.length === 0) {
      return null;
    }
    const firstMessage = messages[0];
    const userKeys = await this.client.getOrCreateKeys(user.id);
    const decryptedText = await this.client.decryptMessage(userKeys.privateKey, firstMessage);
    return {
      from: firstMessage.senderId.toString(),
      message: decryptedText
    };
  }
}
