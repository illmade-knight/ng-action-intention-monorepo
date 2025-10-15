import { Route } from '@angular/router';
// It imports the component from its own library files
import { ContactsPage } from './contacts-page/contacts-page';

export const contactsRoutes: Route[] = [
  {
    path: '',
    // And uses it as the main component for this route
    component: ContactsPage,
  },
];
