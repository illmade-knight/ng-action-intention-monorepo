# **Chat UI Feature Library (ng-chat-ui)**

This is a dedicated Angular library that provides a complete, reusable, and themeable chat interface. It was developed using a "UI-first" approach, meaning all components were built and tested in isolation with mock data, ensuring they are robust and easy to integrate with any real-time data source.

The library is built on a foundation of modern Angular best practices, including **standalone components**, a clear **smart/dumb component architecture**, and **OnPush change detection** for optimal performance.

---

## **Key Features**

* **Component-Based Architecture**: A modular set of components that can be composed to create a full chat experience.
* **Clean Public API**: The library exposes a single top-level component (ChatPage) and its required data models (ChatMessage), hiding all internal implementation details.
* **Unidirectional Data Flow**: Follows a strict parent-to-child data flow using @Input and child-to-parent event flow with @Output, making the UI predictable and easy to debug.
* **Production Ready**: All components are thoroughly unit-tested and ready for integration.

---

## **Core Components**

The library's public API exposes one primary component:

* **ChatPage**: The main "smart" component and the intended entry point for this feature. It integrates all the internal "dumb" components into a cohesive chat window.

*Internal (private) components include ChatWindow, MessageList, MessageBubble, and MessageInput.*

---

## **Integration**

To use this library, another component (e.g., from the main application) will render the ChatPage component.

#### **Example Usage**

The consuming component will be responsible for providing the list of messages and handling the messageSent event.

TypeScript

// in-messaging-page.component.ts
````typescript
import { Component } from '@angular/core';  
import { ChatPage, ChatMessage } from '@ng-action-intention/ng-chat-ui';  
import { RealTimeChatService } from '../services/real-time-chat.service'; // Example service  
import { Observable } from 'rxjs';

@Component({  
  selector: 'app-messaging-page',  
  standalone: true,  
  imports: [ChatPage],  
  template: `  
    <ncu-chat-page  
    [messages]="messages$ | async"  
    (messageSent)="sendMessage($event)"  
    />`,  
})  
  export class MessagingPageComponent {  
  messages$: Observable<ChatMessage[]>;

  constructor(private chatService: RealTimeChatService) {  
    this.messages$ = this.chatService.getMessagesForConversation('contact-id-123');  
  }

  sendMessage(messageText: string) {  
    this.chatService.sendMessage('contact-id-123', messageText);  
  }  
}
````
---

### **Current State & Next Steps**

This library is currently in a "UI-complete" state. The top-level component (ChatPage) is using **mock data** to facilitate development and testing.

The next phase of development (**Work Package 4**) will involve removing this mock data and connecting the component to a real-time data service provided by the main application, as illustrated in the example above.

---

## **Running Unit Tests**

To run the unit tests specifically for this library, use the following Nx command:

Bash

nx test ng-chat-ui

---

Now that all three of your libraries are documented and fully consistent, we are perfectly positioned to move on to the main application and begin **Work Package 4: Integration & Real-Time Features**. It's time to replace those mocks.
