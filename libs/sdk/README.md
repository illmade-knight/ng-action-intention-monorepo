# **SDK Library**

This is the foundational, framework-agnostic TypeScript library for the Action Intention platform1. It contains all core business logic, data models, and service interfaces, with zero dependencies on Angular2. Its purpose is to provide a stable, reusable "Software Development Kit" for any application that needs to interact with the platform3.

---

## **Key Features**

* **Comprehensive Cryptography**: A Crypto class that handles hybrid encryption (RSA-OAEP \+ AES-GCM) and digital signatures (RSA-PSS) using the Web Crypto API4.

* **Abstracted Storage**: A StorageProvider interface and a LocalStorage implementation for persisting application state5.

* **Strictly-Typed Models**: A clear separation between internal domain models and data transfer objects (DTOs) for serialization6.

* **Clear Contracts**: Interfaces for authentication (Auth) and backend communication (Clients) that decouple the core logic from the implementation7.

---

## **Core Architectural Principles**

### **Domain Models vs. DTOs**

This library enforces a strict separation between the internal **Domain Models** and the **Data Transfer Objects (DTOs)** used for serialization8.

* **Domain Models**: Used for all internal business logic. All date/time properties are rich Temporal.Instant objects for safe, immutable operations9. (e.g., ApplicationState)

* **DTOs**: Used for storage (JSON) and network transfer. All date/time properties are ISODateTimeString branded strings to ensure data is in a safe, universal format10. (e.g., RawApplicationState)

This boundary is enforced at the storage and network layers to ensure type safety and prevent bugs11.

---

## **Basic Usage**

The library's modules can be imported using the @ng-action-intention/sdk path alias, which is configured in the root tsconfig.base.json.

TypeScript

import { Crypto, LocalStorage, StorageProvider } from '@ng-action-intention/sdk';

// Initialize the crypto module  
const crypto \= new Crypto();

// Use the storage provider  
const storage: StorageProvider \= new LocalStorage();

async function setupKeys() {  
const encryptionKeys \= await crypto.generateEncryptionKeys();  
console.log('Generated Public Key:', encryptionKeys.publicKey);

await storage.saveKeyPair('user-123', encryptionKeys);  
}

---

## **API Reference**

The library exports the following key modules from its main barrel file:

* **Crypto**: The class for all cryptographic operations12.

* **StorageProvider & LocalStorage**: The interface and default implementation for key-value storage13.

* **Auth**: The interface defining the contract for an authentication provider14.

* **Clients**: The interface defining contracts for backend microservice clients.
* **Models & Types**: All Raw DTOs, rich Domain Models, and the ISODateTimeString branded type15.

---

## **Running Unit Tests**

To run the comprehensive suite of unit tests for this library, use the following command16:

Bash

nx test sdk

---

Now that the sdk is documented, I'm ready to look at the top-level configuration for the **ng-contacts** library whenever you are.
