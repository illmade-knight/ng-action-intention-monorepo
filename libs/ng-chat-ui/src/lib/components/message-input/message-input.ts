import { ChangeDetectionStrategy, Component, EventEmitter, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';
import { MatFormFieldModule } from '@angular/material/form-field';
import { MatInputModule } from '@angular/material/input';
import { MatButtonModule } from '@angular/material/button';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'lib-message-input',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule,
    MatFormFieldModule,
    MatInputModule,
    MatButtonModule,
    MatIconModule,
  ],
  changeDetection: ChangeDetectionStrategy.OnPush,
  templateUrl: './message-input.html',
  styleUrls: ['./message-input.scss'],
})
export class MessageInput {
  @Output() messageSent = new EventEmitter<string>();

  currentMessage = '';

  sendMessage(): void {
    const trimmedMessage = this.currentMessage.trim();
    if (trimmedMessage) {
      this.messageSent.emit(trimmedMessage);
      this.currentMessage = '';
    }
  }
}
