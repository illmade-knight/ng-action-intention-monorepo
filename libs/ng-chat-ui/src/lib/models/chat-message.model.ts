export interface ChatMessage {
  id: string;
  text: string;
  timestamp: Date;
  author: {
    id: string;
    alias: string;
  };
  isMe: boolean;
}
