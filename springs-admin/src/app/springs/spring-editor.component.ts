import { Component, OnInit, signal } from '@angular/core';
import { FormsModule } from '@angular/forms';
import { ActivatedRoute, Router, RouterLink } from '@angular/router';
import { SpringsService } from '../services/springs.service';
import { Spring, LatLng, blankSpring } from '../models/spring';
import { MapPickerComponent } from './map-picker.component';

// A staged image: either an already-saved URL or a newly-picked file
// (uploaded on Save). `preview` is what the <img> shows.
interface StagedImage {
  url: string | null;
  file: File | null;
  preview: string;
}

@Component({
  selector: 'app-spring-editor',
  standalone: true,
  imports: [FormsModule, RouterLink, MapPickerComponent],
  template: `
    <header class="topbar">
      <a class="btn ghost" routerLink="/">← Back</a>
      <h1>{{ isNew ? 'New spring' : 'Edit spring' }}</h1>
      <div class="spacer"></div>
      <button class="btn primary" (click)="save()" [disabled]="saving()">
        {{ saving() ? 'Saving…' : 'Save' }}
      </button>
    </header>

    <div class="container">
      @if (loading()) {
        <p class="muted">Loading…</p>
      } @else if (spring; as s) {
        @if (error()) {
          <p class="error">{{ error() }}</p>
        }

        <!-- Multilingual text fields -->
        <section class="card">
          <h2>Details</h2>

          <div class="field-group">
            <label>Name</label>
            <div class="two-col">
              <div><span class="tag">עברית</span><input dir="rtl" name="name_iw" [(ngModel)]="s.name.iw" /></div>
              <div><span class="tag">English</span><input name="name_en" [(ngModel)]="s.name.en" /></div>
            </div>
          </div>

          <div class="field-group">
            <label>Description</label>
            <div class="two-col">
              <div><span class="tag">עברית</span><textarea dir="rtl" name="desc_iw" [(ngModel)]="s.description.iw"></textarea></div>
              <div><span class="tag">English</span><textarea name="desc_en" [(ngModel)]="s.description.en"></textarea></div>
            </div>
          </div>

          <div class="field-group">
            <label>Info</label>
            <div class="two-col">
              <div><span class="tag">עברית</span><textarea dir="rtl" name="info_iw" [(ngModel)]="s.info.iw"></textarea></div>
              <div><span class="tag">English</span><textarea name="info_en" [(ngModel)]="s.info.en"></textarea></div>
            </div>
          </div>

          <div class="field-group">
            <label>Preferred season</label>
            <div class="two-col">
              <div><span class="tag">עברית</span><input dir="rtl" name="season_iw" [(ngModel)]="s.preferredSeason.iw" /></div>
              <div><span class="tag">English</span><input name="season_en" [(ngModel)]="s.preferredSeason.en" /></div>
            </div>
          </div>

          <div class="field-group">
            <label>Depth</label>
            <div class="two-col">
              <div><span class="tag">עברית</span><input dir="rtl" name="depth_iw" [(ngModel)]="s.depth.iw" /></div>
              <div><span class="tag">English</span><input name="depth_en" [(ngModel)]="s.depth.en" /></div>
            </div>
          </div>

          <div class="field-group">
            <label>Distance from car</label>
            <div class="two-col">
              <div><span class="tag">עברית</span><input dir="rtl" name="dist_iw" [(ngModel)]="s.distanceFromCar.iw" /></div>
              <div><span class="tag">English</span><input name="dist_en" [(ngModel)]="s.distanceFromCar.en" /></div>
            </div>
          </div>
        </section>

        <!-- Location -->
        <section class="card">
          <h2>Location</h2>
          <p class="muted small">
            Click the map or drag the pin to set the location. The geohash used by
            the app's distance filter is recomputed on save.
          </p>
          <app-map-picker
            [latitude]="s.location.latitude"
            [longitude]="s.location.longitude"
            (locationChange)="onLocationChange($event)"
          ></app-map-picker>
          <div class="two-col" style="margin-top: 12px">
            <div>
              <label>Latitude</label>
              <input type="number" step="any" name="lat" [(ngModel)]="s.location.latitude" />
            </div>
            <div>
              <label>Longitude</label>
              <input type="number" step="any" name="lng" [(ngModel)]="s.location.longitude" />
            </div>
          </div>
        </section>

        <!-- Filters -->
        <section class="card">
          <h2>Filters</h2>
          <div class="checks">
            <label class="check"><input type="checkbox" name="fw" [(ngModel)]="s.filterWater" /> Water</label>
            <label class="check"><input type="checkbox" name="fca" [(ngModel)]="s.filterCamping" /> Camping</label>
            <label class="check"><input type="checkbox" name="fch" [(ngModel)]="s.filterChildren" /> Children</label>
            <label class="check"><input type="checkbox" name="fcar" [(ngModel)]="s.filterCar" /> Car access</label>
            <label class="check"><input type="checkbox" name="fd" [(ngModel)]="s.filterDepth" /> Depth</label>
          </div>
        </section>

        <!-- Images -->
        <section class="card">
          <h2>Images</h2>
          <div class="gallery">
            @for (img of images(); track img.preview; let i = $index) {
              <div class="tile">
                <img [src]="img.preview" alt="" />
                @if (!img.url) { <span class="badge">new</span> }
                <button class="tile-remove" (click)="removeImage(i)" title="Remove">×</button>
              </div>
            }
            <label class="tile add">
              <input type="file" accept="image/*" multiple (change)="onPick($event)" hidden />
              <span>+ Add</span>
            </label>
          </div>
        </section>

        <div class="footer-actions">
          <button class="btn primary" (click)="save()" [disabled]="saving()">
            {{ saving() ? 'Saving…' : 'Save' }}
          </button>
          <a class="btn ghost" routerLink="/">Cancel</a>
        </div>
      } @else {
        <p class="error">Spring not found.</p>
      }
    </div>
  `,
})
export class SpringEditorComponent implements OnInit {
  spring: Spring | null = null;
  isNew = false;

  readonly images = signal<StagedImage[]>([]);
  readonly loading = signal(true);
  readonly saving = signal(false);
  readonly error = signal('');

  private removedUrls: string[] = [];

  constructor(
    private route: ActivatedRoute,
    private router: Router,
    private springs: SpringsService,
  ) {}

  async ngOnInit() {
    const id = this.route.snapshot.paramMap.get('id')!;
    this.isNew = this.route.snapshot.queryParamMap.get('new') === '1';

    try {
      if (this.isNew) {
        this.spring = blankSpring(id);
      } else {
        this.spring = await this.springs.get(id);
        if (this.spring) {
          this.images.set(
            (this.spring.images ?? []).map((url) => ({ url, file: null, preview: url })),
          );
        }
      }
    } catch (err: unknown) {
      this.error.set(this.readableError(err));
    } finally {
      this.loading.set(false);
    }
  }

  onPick(event: Event) {
    const input = event.target as HTMLInputElement;
    const files = Array.from(input.files ?? []);
    const staged: StagedImage[] = files.map((file) => ({
      url: null,
      file,
      preview: URL.createObjectURL(file),
    }));
    this.images.set([...this.images(), ...staged]);
    input.value = ''; // allow re-picking the same file
  }

  onLocationChange(loc: LatLng) {
    if (this.spring) this.spring.location = loc;
  }

  removeImage(i: number) {
    const list = [...this.images()];
    const [removed] = list.splice(i, 1);
    if (removed?.url) this.removedUrls.push(removed.url);
    this.images.set(list);
  }

  async save() {
    const s = this.spring;
    if (!s || this.saving()) return;
    this.saving.set(true);
    this.error.set('');
    try {
      // Upload any newly-picked files, keep existing URLs in order.
      const finalUrls: string[] = [];
      for (const img of this.images()) {
        if (img.url) finalUrls.push(img.url);
        else if (img.file) finalUrls.push(await this.springs.uploadImage(s.id, img.file));
      }
      s.images = finalUrls;

      await this.springs.save(s);

      // Clean up images the user removed (best-effort).
      for (const url of this.removedUrls) await this.springs.deleteImageByUrl(url);

      this.router.navigate(['/']);
    } catch (err: unknown) {
      this.error.set(this.readableError(err));
    } finally {
      this.saving.set(false);
    }
  }

  private readableError(err: unknown): string {
    const code = (err as { code?: string })?.code ?? '';
    if (code === 'permission-denied') {
      return 'Permission denied. Check the Firestore/Storage security rules for this admin user.';
    }
    return 'Something went wrong. ' + (code || '');
  }
}
