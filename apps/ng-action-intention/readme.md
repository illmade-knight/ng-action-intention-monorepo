# **Angular Application: ng-action-intention**

This is the primary Angular single-page application (SPA) for the Action Intention platform. It serves as the main user-facing product and acts as the central integration point for all feature libraries.

Architecturally, this application is designed as a **thin app shell**. Its primary responsibilities are to provide the main layout, configure the root dependency injection container, manage top-level routing, and orchestrate the flow of data between the core services and the feature libraries.

---

## **Core Architecture**

The application is built on a modern, robust, and scalable foundation.

* **Monorepo Integration**: Seamlessly integrates with the sdk, ng-contacts, and ng-chat-ui libraries.
* **Modern Angular**: Built entirely with standalone components, functional guards, and interceptors.
* **Signal-Based State Management**: Core services (Auth, Conversation) use Angular Signals for highly efficient and reactive state management.
* **Lazy Loading**: Feature libraries are lazy-loaded to ensure optimal initial load times.
* **Mocking Environment**: Includes a built-in mock environment for rapid UI development and testing, toggleable via a simple configuration change.

---

## **Key Services**

* **Auth**: Manages user authentication state, session persistence, and token handling.
* **Conversation**: A local state store for the currently active chat conversation.
* **Client**: Orchestrates all cryptographic operations and communication with low-level network clients.
* **MessageTransport**: The high-level service that components use to send and receive messages.
* **IndexedDb**: A StorageProvider implementation for securely storing cryptographic keys in the browser.

---

## **Development & Testing**

This project uses Nx to manage all development tasks.

### **Serving the Application**

* **To serve with a live backend**:  
  Bash  
  nx serve ng-action-intention

* **To serve in standalone mock mode** (recommended for UI development):  
  Bash  
  nx serve ng-action-intention \--configuration=mock

### **Running Tests**

* **To run tests for the application**:  
  Bash  
  nx test ng-action-intention

---

Now, let's remove the final placeholders from the ChatPage component in the ng-chat-ui library and connect it to our real services.
