import {
  ChangeDetectionStrategy,
  Component,
  Input,
  Output,
  EventEmitter,
  ViewChild,
} from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../models/chat-message.model';
import { MessageList } from '../components/message-list/message-list';
import { MessageInput } from '../components/message-input/message-input';

@Component({
  selector: 'ncu-chat-window',
  standalone: true,
  imports: [CommonModule, MessageList, MessageInput],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './chat-window.html',
  styleUrls: ['./chat-window.scss'],
})
export class ChatWindow {
  @Input({ required: true }) messages: ChatMessage[] = [];
  @Input() recipientAlias = 'Select a contact';

  // The new @Output property that emits the message text
  @Output() messageSent = new EventEmitter<string>();

  // ViewChild references to interact with child components
  @ViewChild(MessageList) messageListComponent!: MessageList;
  @ViewChild(MessageInput) messageInputComponent!: MessageInput;

  /**
   * This method is called when the child MessageInput component emits an event.
   * It now simply forwards the event up to its parent component.
   */
  handleMessageSent(messageText: string): void {
    this.messageSent.emit(messageText);
  }
}
