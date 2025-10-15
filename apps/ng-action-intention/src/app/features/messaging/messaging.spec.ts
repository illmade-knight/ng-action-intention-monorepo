import { ComponentFixture, TestBed, fakeAsync, tick } from '@angular/core/testing';
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import { Component, Input, Output, EventEmitter, signal, WritableSignal } from '@angular/core';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { Messaging } from './messaging';
import { Conversation } from '../../core/services/conversation/conversation';
import { MessageTransport } from '../../core/services/message-transport/message-transport';
import { Auth } from '../../core/services/auth/auth';
import { ChatMessage } from '@ng-action-intention/ng-chat-ui';
import { AddressBookContact, Contacts } from '@ng-action-intention/ng-contacts'; // 👈 Import Contacts

// --- Create Mock Components for the Child Libraries ---
@Component({ selector: 'ngc-contact-list', standalone: true, template: '' })
class MockContactListComponent {
  @Output() contactSelected = new EventEmitter<AddressBookContact>();
}

@Component({ selector: 'ncu-chat-window', standalone: true, template: '' })
class MockChatWindowComponent {
  @Input() messages: ChatMessage[] | null = [];
  @Input() recipientAlias = '';
  @Output() messageSent = new EventEmitter<string>();
}

// --- Mock Data ---
const mockSender = { id: 'urn:sm:user:sender', alias: 'Sender' };
const mockRecipient = { id: 'urn:sm:user:recipient', alias: 'Recipient' };

// --- Mock Services ---
let activeContactSignal: WritableSignal<AddressBookContact | null>;

const mockConversationService = {
  messages: signal<ChatMessage[]>([]),
  activeRecipientAlias: signal(''),
  activeContact: () => activeContactSignal.asReadonly(),
  setActiveConversation: vi.fn(),
  addMessage: vi.fn(), // Track message adding
};

const mockTransportService = {
  sendMessage: vi.fn().mockResolvedValue(undefined),
};

const mockAuthService = {
  currentUser: signal(mockSender),
};

// FIX: Add a minimal mock for Contacts (resolves NG0201 issue in messaging.spec.ts)
const mockContactsService = {};


describe('Messaging', () => {
  let component: Messaging;
  let fixture: ComponentFixture<Messaging>;

  beforeEach(async () => {
    activeContactSignal = signal(mockRecipient as AddressBookContact);

    await TestBed.configureTestingModule({
      imports: [Messaging, MockContactListComponent, MockChatWindowComponent],
      providers: [
        // FIX: Provide both the base client and the testing utilities
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Conversation, useValue: mockConversationService },
        { provide: MessageTransport, useValue: mockTransportService },
        { provide: Auth, useValue: mockAuthService },
        { provide: Contacts, useValue: mockContactsService }, // 👈 Inject Contacts Mock
      ],
    }).compileComponents();

    vi.clearAllMocks();
    mockTransportService.sendMessage.mockResolvedValue(undefined);

    fixture = TestBed.createComponent(Messaging);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  // afterEach(() => { httpTestingController.verify(); }); // Remove if httpMock is not used

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleSend', () => {
    const testMessage = 'Hello world!';

    it('should send the message via transport and add an optimistic message', fakeAsync(() => {
      component.handleSend(testMessage);
      tick(); // Resolve transport.sendMessage promise

      // 1. Verify message was sent via transport
      expect(mockTransportService.sendMessage).toHaveBeenCalledWith(
        mockRecipient.id,
        testMessage
      );

      // 2. Verify an optimistic message was added to conversation
      expect(mockConversationService.addMessage).toHaveBeenCalled();
      const addedMessage = mockConversationService.addMessage.mock.calls[0][0] as ChatMessage;
      expect(addedMessage.text).toBe(testMessage);
      expect(addedMessage.isMe).toBe(true);
      expect(addedMessage.id).toBeDefined();
    }));

    it('should not send message if recipient or sender is missing', fakeAsync(() => {
      // Test 1: Missing Recipient
      activeContactSignal.set(null);
      component.handleSend(testMessage);
      tick();
      expect(mockTransportService.sendMessage).not.toHaveBeenCalled();

      // Test 2: Missing Sender (reset recipient)
      activeContactSignal.set(mockRecipient as AddressBookContact);
      mockAuthService.currentUser.set({id: "1", alias: "one"});
      component.handleSend(testMessage);
      tick();
      expect(mockTransportService.sendMessage).not.toHaveBeenCalled();
    }));
  });
});
