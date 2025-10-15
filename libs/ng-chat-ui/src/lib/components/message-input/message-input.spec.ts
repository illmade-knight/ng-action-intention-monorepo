import { ComponentFixture, TestBed } from '@angular/core/testing';
import { FormsModule } from '@angular/forms';
import { MessageInput } from './message-input';
import { describe, it, expect, beforeEach, vi } from 'vitest';
import { provideAnimationsAsync } from '@angular/platform-browser/animations/async';

describe('MessageInput', () => {
  let fixture: ComponentFixture<MessageInput>;
  let component: MessageInput;

  beforeEach(async () => {
    await TestBed.configureTestingModule({
      imports: [MessageInput, FormsModule],
      providers: [
        provideAnimationsAsync('noop'),
      ],
    }).compileComponents();

    fixture = TestBed.createComponent(MessageInput);
    component = fixture.componentInstance;
    fixture.detectChanges();
  });

  it('should emit messageSent event when send button is clicked', () => {
    const spy = vi.spyOn(component.messageSent, 'emit');
    component.currentMessage = 'Hello World';
    fixture.detectChanges();

    const sendButton = fixture.nativeElement.querySelector('button');
    sendButton.click();
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('Hello World');
    expect(component.currentMessage).toBe('');
  });

  it('should emit messageSent event when Enter is pressed', () => {
    const spy = vi.spyOn(component.messageSent, 'emit');
    component.currentMessage = 'Hello Again';
    fixture.detectChanges();

    const textarea = fixture.nativeElement.querySelector('textarea');
    textarea.dispatchEvent(new KeyboardEvent('keydown', { key: 'Enter' }));
    fixture.detectChanges();

    expect(spy).toHaveBeenCalledWith('Hello Again');
  });

  it('should disable the send button when the input is empty or just whitespace', () => {
    component.currentMessage = '';
    fixture.detectChanges();
    let sendButton = fixture.nativeElement.querySelector('button');
    expect(sendButton.disabled).toBe(true);

    component.currentMessage = '   '; // Just whitespace
    fixture.detectChanges();
    sendButton = fixture.nativeElement.querySelector('button');
    expect(sendButton.disabled).toBe(true);
  });

  it('should not emit an event if the message is empty', () => {
    const spy = vi.spyOn(component.messageSent, 'emit');
    component.currentMessage = '   ';
    fixture.detectChanges();

    const sendButton = fixture.nativeElement.querySelector('button');
    sendButton.click();

    expect(spy).not.toHaveBeenCalled();
  });
});
