import { ComponentFixture, TestBed } from '@angular/core/testing'; // 👈 REMOVED fakeAsync and tick
import { provideHttpClientTesting } from '@angular/common/http/testing';
import { provideHttpClient } from '@angular/common/http';
import {
  Component,
  Input,
  Output,
  EventEmitter,
  signal,
  WritableSignal,
} from '@angular/core';
import { Messaging } from './messaging';
import { Conversation } from '../../core/services/conversation/conversation';
import { MessageTransport } from '../../core/services/message-transport/message-transport';
import { Auth } from '../../core/services/auth/auth';
import { ChatMessage } from '@ng-action-intention/ng-chat-ui';
import { AddressBookContact, Contacts } from '@ng-action-intention/ng-contacts';
import { of } from 'rxjs';
import { UserProfile } from '../../core/models/user';

// --- Mock Components (no change) ---
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

// --- 🔽 Mock Data (Updated as requested) 🔽 ---
const mockSender: UserProfile = {
  id: 'urn:sm:user:sender',
  email: 'sender@user.com',
  alias: 'Sender',
};
const mockRecipient: AddressBookContact = {
  id: 'urn:sm:user:recipient',
  email: 'receiver@user.com',
  alias: 'Recipient',
};

// --- Mock Services ---
let activeContactSignal: WritableSignal<AddressBookContact | null>;
let currentUserSignal: WritableSignal<UserProfile | null>;

const mockConversationService = {
  messages: signal<ChatMessage[]>([]),
  activeRecipientAlias: signal(''),
  // 🔽 THE FIX IS HERE: 'activeContact' is now a PROPERTY, not a method 🔽
  activeContact: signal(null as AddressBookContact | null).asReadonly(),
  setActiveConversation: vi.fn(),
  addMessage: vi.fn(),
};

const mockTransportService = {
  sendMessage: vi.fn().mockResolvedValue(undefined),
};

const mockAuthService = {
  currentUser: signal(null as UserProfile | null).asReadonly(),
};

const mockContactsService = {
  getAddressBook: vi.fn().mockReturnValue(of([])),
};

describe('Messaging', () => {
  let component: Messaging;
  let fixture: ComponentFixture<Messaging>;

  beforeEach(async () => {
    // Initialize the WritableSignals for each test
    activeContactSignal = signal(mockRecipient);
    currentUserSignal = signal(mockSender);

    // 🔽 Connect the mocks to the WritableSignals 🔽
    mockConversationService.activeContact = activeContactSignal.asReadonly();
    mockAuthService.currentUser = currentUserSignal.asReadonly();

    await TestBed.configureTestingModule({
      imports: [Messaging, MockContactListComponent, MockChatWindowComponent],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        { provide: Conversation, useValue: mockConversationService },
        { provide: MessageTransport, useValue: mockTransportService },
        { provide: Auth, useValue: mockAuthService },
        { provide: Contacts, useValue: mockContactsService },
      ],
    }).compileComponents();

    vi.clearAllMocks();
    mockTransportService.sendMessage.mockResolvedValue(undefined);

    fixture = TestBed.createComponent(Messaging);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  afterEach(() => {
    TestBed.resetTestingModule();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });

  describe('handleSend', () => {
    const testMessage = 'Hello world!';

    // 🔽 This test will now pass 🔽
    it('should send the message via transport and add an optimistic message', async () => {
      // 'activeContact' signal has 'mockRecipient'
      // 'currentUser' signal has 'mockSender'
      await component.handleSend(testMessage);
      await Promise.resolve();

      // 1. Verify message was sent (recipient.id is now correct)
      expect(mockTransportService.sendMessage).toHaveBeenCalledWith(
        mockRecipient.id,
        testMessage
      );

      // 2. Verify an optimistic message was added
      expect(mockConversationService.addMessage).toHaveBeenCalled();
      const addedMessage =
        mockConversationService.addMessage.mock.calls[0][0] as ChatMessage;
      expect(addedMessage.text).toBe(testMessage);
    });

    // 🔽 This test will now pass 🔽
    it('should not send message if recipient or sender is missing', async () => {
      // Test 1: Missing Recipient
      activeContactSignal.set(null); // Set recipient to null
      await component.handleSend(testMessage);
      await Promise.resolve();
      // The component's 'if (!recipient)' check will now work
      expect(mockTransportService.sendMessage).not.toHaveBeenCalled();

      // Test 2: Missing Sender (reset recipient)
      activeContactSignal.set(mockRecipient);
      currentUserSignal.set(null); // Set sender to null
      fixture.detectChanges();

      await component.handleSend(testMessage);
      await Promise.resolve();

      // The 'if (!sender)' check will work
      expect(mockTransportService.sendMessage).not.toHaveBeenCalled();

      // Restore for other tests
      currentUserSignal.set(mockSender);
    });
  });
});
