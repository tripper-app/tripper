import { Component, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router } from '@angular/router';
import { AuthService } from './auth.service';

@Component({
  selector: 'app-login',
  standalone: true,
  imports: [FormsModule],
  template: `
    <div class="login-wrap">
      <form class="card login-card" (ngSubmit)="submit()">
        <h1>Tripper — Springs Admin</h1>
        <p class="muted">Sign in with your admin account.</p>

        <label>Email</label>
        <input type="email" name="email" [(ngModel)]="email" autocomplete="username" required />

        <label>Password</label>
        <input
          type="password"
          name="password"
          [(ngModel)]="password"
          autocomplete="current-password"
          required
        />

        @if (error()) {
          <p class="error">{{ error() }}</p>
        }

        <button type="submit" class="btn primary" [disabled]="busy()">
          {{ busy() ? 'Signing in…' : 'Sign in' }}
        </button>
      </form>
    </div>
  `,
})
export class LoginComponent {
  email = '';
  password = '';
  readonly busy = signal(false);
  readonly error = signal('');

  constructor(private auth: AuthService, private router: Router) {}

  async submit() {
    if (this.busy()) return;
    this.error.set('');
    this.busy.set(true);
    try {
      await this.auth.login(this.email.trim(), this.password);
      await this.router.navigate(['/']);
    } catch (err: unknown) {
      this.error.set(this.readableError(err));
    } finally {
      this.busy.set(false);
    }
  }

  private readableError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    switch (code) {
      case 'auth/invalid-credential':
      case 'auth/wrong-password':
      case 'auth/user-not-found':
        return 'Wrong email or password.';
      case 'auth/too-many-requests':
        return 'Too many attempts. Try again later.';
      default:
        return 'Sign-in failed. ' + (code || 'Please try again.');
    }
  }
}
