import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../models/chat-message.model';
import { MessageBubble } from '../message-bubble/message-bubble';

@Component({
  selector: 'lib-message-list',
  standalone: true,
  imports: [CommonModule, MessageBubble],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './message-list.html',
  styleUrls: ['./message-list.scss'],
})
export class MessageList {
  @Input({ required: true }) messages: ChatMessage[] = [];
}
