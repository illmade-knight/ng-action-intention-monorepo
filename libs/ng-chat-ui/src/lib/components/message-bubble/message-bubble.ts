import { ChangeDetectionStrategy, Component, Input } from '@angular/core';
import { CommonModule } from '@angular/common';
import { ChatMessage } from '../../models/chat-message.model';

@Component({
  selector: 'lib-message-bubble',
  standalone: true,
  imports: [CommonModule],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './message-bubble.html',
  styleUrls: ['./message-bubble.scss'],
})
export class MessageBubble {
  @Input({ required: true }) message!: ChatMessage;
}
