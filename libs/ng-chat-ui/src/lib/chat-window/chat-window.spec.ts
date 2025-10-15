import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input, ViewChild } from '@angular/core';
import { ChatWindow } from './chat-window';
import { ChatMessage } from '../models/chat-message.model';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

// --- Test Host Component ---
// This simple component acts as the parent for ChatWindow during testing.
@Component({
  standalone: true,
  imports: [ChatWindow],
  template: `
    <ncu-chat-window
      [messages]="messages"
      [recipientAlias]="recipientAlias"
      (messageSent)="onMessageSent($event)"
    />
  `,
})
class TestHostComponent {
  // We can control the inputs to ChatWindow from our test cases
  @Input() messages: ChatMessage[] = [];
  @Input() recipientAlias = 'Default Alias';

  // Allows us to get a reference to the ChatWindow instance
  @ViewChild(ChatWindow) chatWindow!: ChatWindow;

  // Spy on the output event
  onMessageSent = vi.fn();
}

// --- Refactored Tests ---
describe('ChatWindow', () => {
  let fixture: ComponentFixture<TestHostComponent>;
  let testHost: TestHostComponent;

  const mockMessages: ChatMessage[] = [
    { id: '1', text: 'Msg 1', timestamp: new Date(), author: { id: '1', alias: 'A' }, isMe: false },
    { id: '2', text: 'Msg 2', timestamp: new Date(), author: { id: '2', alias: 'B' }, isMe: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHostComponent], // We now import the TestHost
      providers: [provideAnimationsAsync('noop')],
    }).compileComponents();

    fixture = TestBed.createComponent(TestHostComponent);
    testHost = fixture.componentInstance;
  });

  it('should render the correct recipient alias in the header', () => {
    const alias = 'Test Recipient';
    testHost.recipientAlias = alias;
    fixture.detectChanges();

    const headerElement = fixture.nativeElement.querySelector('.chat-header h3');
    expect(headerElement.textContent).toContain(alias);
  });

  it('should pass the messages array to the message-list component', () => {
    testHost.messages = mockMessages;
    fixture.detectChanges();

    // Check that the child MessageList component receives the messages
    expect(testHost.chatWindow.messageListComponent.messages).toEqual(mockMessages);
  });

  it('should emit a messageSent event when handleMessageSent is called', () => {
    fixture.detectChanges(); // Initial detection
    const testMessage = 'Hello from the test';

    // Call the method on the ChatWindow component instance
    testHost.chatWindow.handleMessageSent(testMessage);
    fixture.detectChanges();

    // Check if the host's event handler was called with the correct message
    expect(testHost.onMessageSent).toHaveBeenCalledWith(testMessage);
  });
});
