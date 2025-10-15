import { TestBed } from '@angular/core/testing';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { MessageTransport } from './message-transport';
import { Auth } from '../auth/auth';
import { Client } from '../client/client';
import { UserProfile } from '../../models/user';

// Mock user for authentication
const mockUser: UserProfile = { id: 'user-sender-id', email: 'sender@test.com', alias: 'A Sender' };

// Mock implementation for Auth
const mockAuth = {
  currentUser: vi.fn(),
};

// Mock implementation for Client
const mockClient = {
  sendMessage: vi.fn(),
  getMessages: vi.fn(),
  getOrCreateKeys: vi.fn(),
  decryptMessage: vi.fn(),
};

describe('MessageTransport', () => {
  let service: MessageTransport;
  let client: Client;
  let auth: Auth;

  beforeEach(() => {
    vi.resetAllMocks();
    TestBed.configureTestingModule({
      providers: [
        MessageTransport,
        { provide: Auth, useValue: mockAuth },
        { provide: Client, useValue: mockClient },
      ],
    });
    service = TestBed.inject(MessageTransport);
    client = TestBed.inject(Client);
    auth = TestBed.inject(Auth);
  });

  it('should be created', () => {
    expect(service).toBeTruthy();
  });

  describe('sendMessage', () => {
    it('should throw an error if no user is authenticated', async () => {
      mockAuth.currentUser.mockReturnValue(null);
      await expect(service.sendMessage('recipient-id', 'hello')).rejects.toThrow('Cannot send message: no authenticated user.');
    });

    it('should call the client service with the correct parameters', async () => {
      mockAuth.currentUser.mockReturnValue(mockUser);
      mockClient.sendMessage.mockResolvedValue(undefined);

      await service.sendMessage('recipient-id', 'hello');

      expect(client.sendMessage).toHaveBeenCalledWith(mockUser.id, 'recipient-id', 'hello');
      expect(client.sendMessage).toHaveBeenCalledTimes(1);
    });
  });
});
