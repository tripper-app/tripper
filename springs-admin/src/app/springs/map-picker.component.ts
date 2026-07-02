import {
  AfterViewInit,
  Component,
  ElementRef,
  EventEmitter,
  Input,
  OnChanges,
  OnDestroy,
  Output,
  SimpleChanges,
  ViewChild,
} from '@angular/core';
import * as L from 'leaflet';
import { LatLng } from '../models/spring';

// Leaflet map with a draggable marker. Click the map or drag the pin to set the
// location; emits the new coordinates. Uses free OpenStreetMap tiles (no API key).
@Component({
  selector: 'app-map-picker',
  standalone: true,
  template: `<div #map class="map-picker"></div>`,
})
export class MapPickerComponent implements AfterViewInit, OnChanges, OnDestroy {
  @Input() latitude = 31.5;
  @Input() longitude = 34.9;
  @Output() locationChange = new EventEmitter<LatLng>();

  @ViewChild('map', { static: true }) mapEl!: ElementRef<HTMLDivElement>;

  private map?: L.Map;
  private marker?: L.Marker;

  ngAfterViewInit() {
    const start: L.LatLngExpression = [this.latitude, this.longitude];
    this.map = L.map(this.mapEl.nativeElement).setView(start, 13);

    L.tileLayer('https://{s}.tile.openstreetmap.org/{z}/{x}/{y}.png', {
      maxZoom: 19,
      attribution: '&copy; OpenStreetMap contributors',
    }).addTo(this.map);

    // Custom CSS pin so we don't depend on Leaflet's bundled marker images
    // (their paths break under bundlers).
    const icon = L.divIcon({
      className: 'map-pin',
      html: '<span class="map-pin-dot"></span>',
      iconSize: [22, 22],
      iconAnchor: [11, 22],
    });

    this.marker = L.marker(start, { draggable: true, icon }).addTo(this.map);
    this.marker.on('dragend', () => {
      const p = this.marker!.getLatLng();
      this.emit(p.lat, p.lng);
    });
    this.map.on('click', (e: L.LeafletMouseEvent) => {
      this.marker!.setLatLng(e.latlng);
      this.emit(e.latlng.lat, e.latlng.lng);
    });

    // The container is often revealed just before init; nudge Leaflet to
    // recompute its size so tiles fill it.
    setTimeout(() => this.map?.invalidateSize(), 0);
  }

  ngOnChanges(changes: SimpleChanges) {
    if (!this.map || !this.marker) return;
    if (changes['latitude'] || changes['longitude']) {
      const ll: L.LatLngExpression = [this.latitude, this.longitude];
      this.marker.setLatLng(ll);
      this.map.panTo(ll);
    }
  }

  ngOnDestroy() {
    this.map?.remove();
  }

  private emit(lat: number, lng: number) {
    this.latitude = lat;
    this.longitude = lng;
    // Round to a sane precision (~1 cm) to keep the stored value tidy.
    this.locationChange.emit({
      latitude: +lat.toFixed(6),
      longitude: +lng.toFixed(6),
    });
  }
}
