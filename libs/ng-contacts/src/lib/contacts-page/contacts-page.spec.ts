import { ComponentFixture, TestBed } from '@angular/core/testing';
import { ContactsPage } from './contacts-page';
// --- 1. Import the missing component ---
import { ContactList } from '../components/contact-list/contact-list';
import { provideHttpClient } from '@angular/common/http';
import { provideHttpClientTesting } from '@angular/common/http/testing';

describe('ContactsPage', () => {
  let component: ContactsPage;
  let fixture: ComponentFixture<ContactsPage>;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      // --- 2. Add it to the imports array ---
      imports: [ContactsPage, ContactList],
      providers: [provideHttpClient(), provideHttpClientTesting()],
    }).compileComponents();

    fixture = TestBed.createComponent(ContactsPage);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should create', () => {
    expect(component).toBeTruthy();
  });
});
