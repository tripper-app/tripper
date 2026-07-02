import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { Router, RouterLink } from '@angular/router';
import { AuthService } from '../auth/auth.service';
import { SpringsService } from '../services/springs.service';
import { SpringSummary } from '../models/spring';

@Component({
  selector: 'app-spring-list',
  standalone: true,
  imports: [FormsModule, RouterLink],
  template: `
    <header class="topbar">
      <h1>Springs</h1>
      <div class="spacer"></div>
      <span class="muted small">{{ auth.user()?.email }}</span>
      <button class="btn ghost" (click)="logout()">Sign out</button>
    </header>

    <div class="container">
      <div class="toolbar">
        <div class="search">
          <input
            type="text"
            [(ngModel)]="term"
            (keyup.enter)="doSearch()"
            [dir]="lang === 'iw' ? 'rtl' : 'ltr'"
            placeholder="Search springs by name…"
          />
          <select [(ngModel)]="lang" (change)="doSearch()">
            <option value="iw">עברית</option>
            <option value="en">English</option>
          </select>
          <button class="btn" (click)="doSearch()">Search</button>
        </div>
        <button class="btn primary" (click)="create()">+ New spring</button>
      </div>

      @if (loading()) {
        <p class="muted">Loading…</p>
      } @else if (error()) {
        <p class="error">{{ error() }}</p>
      } @else if (results().length === 0) {
        <p class="muted">No springs found.</p>
      } @else {
        <ul class="list">
          @for (s of results(); track s.id) {
            <li class="row">
              <img
                class="thumb"
                [src]="s.images[0] || placeholder"
                alt=""
                (error)="onImgError($event)"
              />
              <div class="row-main">
                <div class="row-title" dir="rtl">{{ s.name.iw || '(no Hebrew name)' }}</div>
                <div class="row-sub">{{ s.name.en || '—' }}</div>
              </div>
              <a class="btn small" [routerLink]="['/spring', s.id]">Edit</a>
              <button class="btn small danger" (click)="remove(s)">Delete</button>
            </li>
          }
        </ul>
      }
    </div>
  `,
})
export class SpringListComponent implements OnInit {
  term = '';
  lang: 'iw' | 'en' = 'iw';
  readonly results = signal<SpringSummary[]>([]);
  readonly loading = signal(false);
  readonly error = signal('');
  readonly placeholder =
    'data:image/svg+xml;utf8,<svg xmlns="http://www.w3.org/2000/svg" width="64" height="64"><rect width="64" height="64" fill="%23e5e7eb"/></svg>';

  constructor(
    private springs: SpringsService,
    private router: Router,
    public auth: AuthService,
  ) {}

  ngOnInit() {
    this.doSearch();
  }

  async doSearch() {
    this.loading.set(true);
    this.error.set('');
    try {
      this.results.set(await this.springs.search(this.term, this.lang));
    } catch (err: unknown) {
      this.error.set(this.readableError(err));
    } finally {
      this.loading.set(false);
    }
  }

  create() {
    // Reserve an id so image uploads work before the first save.
    this.router.navigate(['/spring', this.springs.newId()], {
      queryParams: { new: 1 },
    });
  }

  async remove(s: SpringSummary) {
    const label = s.name?.iw || s.name?.en || s.id;
    if (!confirm(`Delete "${label}"?\nThis permanently removes the spring and its images.`)) {
      return;
    }
    try {
      await this.springs.delete(s.id);
      this.results.set(this.results().filter((r) => r.id !== s.id));
    } catch (err: unknown) {
      this.error.set(this.readableError(err));
    }
  }

  async logout() {
    await this.auth.logout();
    this.router.navigate(['/login']);
  }

  onImgError(e: Event) {
    (e.target as HTMLImageElement).src = this.placeholder;
  }

  private readableError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    if (code === 'permission-denied') {
      return 'Permission denied. Check the Firestore security rules for this admin user.';
    }
    return 'Something went wrong. ' + (code || '');
  }
}
