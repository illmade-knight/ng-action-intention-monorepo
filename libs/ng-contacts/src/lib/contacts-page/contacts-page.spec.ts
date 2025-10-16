import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsPage } from './contacts-page';
import { ContactList } from '../components/contact-list/contact-list';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';
// --- 1. Import the injection token ---
import { NG_CONTACTS_CONFIG } from '../config';


describe('ContactsPage', () => {
  let component: ContactsPage;
  let fixture: ComponentFixture<ContactsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [ContactsPage, ContactList],
      providers: [
        provideHttpClient(),
        provideHttpClientTesting(),
        // --- 2. Add the provider with a mock value ---
        {
          provide: NG_CONTACTS_CONFIG,
          useValue: {
            identityServiceUrl: 'mock-identity-url',
            messagingServiceUrl: 'mock-messaging-url',
          },
        },
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
