import { Component, OnInit, inject, signal } from '@angular/core';
import { Router } from '@angular/router';
import { Auth } from '@ng-action-intention/source/core/services/auth/auth';
import { CommonModule } from '@angular/common';
import { MatProgressSpinnerModule } from '@angular/material/progress-spinner';

@Component({
  standalone: true,
  selector: 'app-login-success',
  imports: [CommonModule, MatProgressSpinnerModule],
  templateUrl: './login-success.html',
})
export class LoginSuccess implements OnInit {
  private authService = inject(Auth);
  private router = inject(Router);
  statusMessage = signal('Finalizing login...');

  ngOnInit(): void {
    if (this.authService.isAuthenticated()) {
      this.statusMessage.set('Success! Redirecting to messenger...');
      setTimeout(() => this.router.navigate(['/messaging']), 50);
    } else {
      this.statusMessage.set('Authentication failed. Redirecting to login...');
      setTimeout(() => {
        this.router.navigate(['/login'], { queryParams: { error: 'auth_sync_failed' } });
      }, 2500);
    }
  }
}
