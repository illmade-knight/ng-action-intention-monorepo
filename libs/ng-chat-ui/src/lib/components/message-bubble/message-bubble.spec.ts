import { ComponentFixture, TestBed } from '@angular/core/testing';
import { Component, Input } from '@angular/core';
import { MessageBubble } from './message-bubble';
import { ChatMessage } from '../../models/chat-message.model';
import { describe, it, expect, beforeEach } from 'vitest';

// 1. Create a simple parent component for the test
@Component({
  standalone: true,
  imports: [MessageBubble],
  template: `<lib-message-bubble [message]="message"></lib-message-bubble>`,
})
class TestHost {
  @Input() message!: ChatMessage;
}

describe('MessageBubble', () => {
  let fixture: ComponentFixture<TestHost>;
  let testHost: TestHost;

  const mockMessage: ChatMessage = {
    id: '1',
    text: 'Test message',
    timestamp: new Date(),
    author: { id: '2', alias: 'Jane Doe' },
    isMe: false,
  };

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [TestHost, MessageBubble], // Import both the host and the component
    }).compileComponents();

    fixture = TestBed.createComponent(TestHost);
    testHost = fixture.componentInstance;
  });

  it('should display the message author, text, and timestamp', () => {
    testHost.message = mockMessage;
    fixture.detectChanges();

    const authorEl = fixture.nativeElement.querySelector('.author-alias');
    const textEl = fixture.nativeElement.querySelector('.message-text');
    const timeEl = fixture.nativeElement.querySelector('.message-timestamp');

    expect(authorEl.textContent).toContain('Jane Doe');
    expect(textEl.textContent).toContain('Test message');
    expect(timeEl.textContent).toBeTruthy();
  });

  it('should not have the "is-me" class for received messages', () => {
    testHost.message = { ...mockMessage, isMe: false };
    fixture.detectChanges();

    const bubbleEl = fixture.nativeElement.querySelector('.message-bubble');
    expect(bubbleEl.classList.contains('is-me')).toBe(false);
  });

  it('should have the "is-me" class for sent messages', () => {
    testHost.message = { ...mockMessage, isMe: true };
    fixture.detectChanges();

    const bubbleEl = fixture.nativeElement.querySelector('.message-bubble');
    expect(bubbleEl.classList.contains('is-me')).toBe(true);
  });
});
