import { ComponentFixture, TestBed } from '@angular/core/testing';
import { MessageList } from './message-list';
import { ChatMessage } from '../../models/chat-message.model';
import { MessageBubble } from '../message-bubble/message-bubble';

describe('MessageList', () => {
  let fixture: ComponentFixture<MessageList>;
  let component: MessageList;

  const mockMessages: ChatMessage[] = [
    { id: '1', text: 'Msg 1', timestamp: new Date(), author: { id: '1', alias: 'A'}, isMe: false },
    { id: '2', text: 'Msg 2', timestamp: new Date(), author: { id: '2', alias: 'B'}, isMe: true },
  ];

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageList, MessageBubble],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageList);
    component = fixture.componentInstance;
  });

  it('should render a message bubble for each message in the input array', () => {
    component.messages = mockMessages;
    fixture.detectChanges();
    // --- FIX: Use the correct selector ---
    const bubbleElements = fixture.nativeElement.querySelectorAll('lib-message-bubble');
    expect(bubbleElements.length).toBe(2);
  });

  it('should render no message bubbles for an empty input array', () => {
    component.messages = [];
    fixture.detectChanges();
    // --- FIX: Use the correct selector ---
    const bubbleElements = fixture.nativeElement.querySelectorAll('lib-message-bubble');
    expect(bubbleElements.length).toBe(0);
  });
});
