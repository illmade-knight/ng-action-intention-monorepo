import { Component, OnInit, inject, signal } from '@angular/core';
import { CommonModule } from '@angular/common';
import { MatButtonModule } from '@angular/material/button';
import { MatDividerModule } from '@angular/material/divider';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';
import { Client } from '../../core/services/client/client';
import { Auth } from '../../core/services/auth/auth';

@Component({
  selector: 'app-settings',
  standalone: true,
  imports: [
    CommonModule,
    MatButtonModule,
    MatDividerModule,
    MatProgressSpinnerModule,
  ],
  templateUrl: './settings.html',
})
export class Settings implements OnInit {
  private client = inject(Client);
  private auth = inject(Auth);

  keyStatus = signal<'checking' | 'found' | 'missing'>('checking');
  currentUser = this.auth.currentUser;
  keyCheckResult = signal<boolean | null>(null); // Re-added for the debug panel

  ngOnInit(): void {
    this.checkKeyStatus();
  }

  async checkKeyStatus(): Promise<void> {
    this.keyStatus.set('checking');
    const user = this.currentUser();
    if (!user) {
      this.keyStatus.set('missing');
      return;
    }
    const keysExist = await this.client.checkForLocalKeys(user.id);
    this.keyStatus.set(keysExist ? 'found' : 'missing');
  }

  async createAndStoreKeys(): Promise<void> {
    const user = this.currentUser();
    if (!user) return;

    this.keyStatus.set('checking');
    try {
      await this.client.getOrCreateKeys(user.id);
      this.keyStatus.set('found');
    } catch (error) {
      console.error("Key generation failed:", error);
      alert('There was an error generating your keys. Please try again.');
      this.keyStatus.set('missing');
    }
  }

  async deleteKeys(): Promise<void> {
    const user = this.currentUser();
    if (!user || !confirm('Are you sure? This will delete your local keys and you will lose access to all encrypted messages.')) {
      return;
    }
    await this.client.deleteLocalKeys(user.id);
    this.keyStatus.set('missing');
  }
}
