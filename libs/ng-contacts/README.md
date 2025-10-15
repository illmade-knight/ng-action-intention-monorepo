# **Contacts Feature Library (ng-contacts)**

This is a self-contained Angular feature library responsible for all contact and address book management within the Action Intention application. It provides all the necessary components, services, and routing to deliver a complete "Contacts" feature.

The library is built using modern Angular practices, including **standalone components**, **OnPush change detection**, and a clear separation of concerns.

---

## **Key Features**

* **Lazy-Loaded Module**: Exports its own routes, designed to be easily lazy-loaded by the main application router.
* **Configurable Services**: Uses an InjectionToken (NG\_CONTACTS\_CONFIG) to receive its configuration, completely decoupling it from the main application.
* **Smart & Dumb Components**: Follows a smart/dumb component architecture for a clean and maintainable UI.
* **Robust Services**: Contains services for looking up users (UserLookup) and managing the address book (Contacts).
* **Modern State Management**: Uses Angular Signals to manage asynchronous data streams in components.

---

## **Core Components**

This library exports the following key components:

* **ContactsPage**: The main "smart" component and the entry point for the feature's route. It orchestrates the other components in the library.
* **ContactList**: A component that displays the list of address book contacts.
* **ContactListItem**: A "dumb" component responsible for rendering a single contact in the list.

---

## **Integration**

To use this library, the main application's router should lazy-load the contacts.routes.ts file.

#### **apps/ng-action-intention/src/app/app.routes.ts**

TypeScript

import { Route } from '@angular/router';

export const appRoutes: Route\[\] \= \[  
// ... other application routes  
{  
path: 'contacts',  
loadChildren: () \=\>  
import('@ng-action-intention/ng-contacts').then((m) \=\> m.contactsRoutes),  
// canActivate: \[authGuard\] // Example of protecting the route  
},  
// ... other application routes  
\];

The application must also provide the required configuration for the library in its root app.config.ts.

#### **apps/ng-action-intention/src/app/app.config.ts**

TypeScript

import { ApplicationConfig } from '@angular/core';  
import { NG\_CONTACTS\_CONFIG } from '@ng-action-intention/ng-contacts';

export const appConfig: ApplicationConfig \= {  
providers: \[  
// ... other providers  
{  
provide: NG\_CONTACTS\_CONFIG,  
useValue: {  
identityServiceUrl: 'https://api.example.com/identity',  
messagingServiceUrl: 'https://api.example.com/messaging',  
},  
},  
\],  
};

---

## **Running Unit Tests**

To run the unit tests specifically for this library, use the following Nx command:

Bash

nx test ng-contacts  
