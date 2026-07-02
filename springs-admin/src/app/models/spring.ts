// Multilingual text field. The mobile app reads `field[lang]` for iw / en.
export interface I18nText {
  iw: string;
  en: string;
}

export interface LatLng {
  latitude: number;
  longitude: number;
}

// Full spring document as stored in the Firestore `springs` collection.
// (`location` is a GeoPoint in Firestore; the service converts to/from LatLng.
//  `geohash` is derived from `location` on save — used by the app's distance filter.)
export interface Spring {
  id: string;
  name: I18nText;
  description: I18nText;
  info: I18nText;
  distanceFromCar: I18nText;
  preferredSeason: I18nText;
  depth: I18nText;
  images: string[];
  location: LatLng;
  filterCamping: boolean;
  filterWater: boolean;
  filterCar: boolean;
  filterChildren: boolean;
  filterDepth: boolean;
  // Left untouched by the admin (managed by the app); preserved on save.
  comments?: unknown[];
}

// Lightweight shape for search results / listing.
export interface SpringSummary {
  id: string;
  name: I18nText;
  images: string[];
}

export function emptyI18n(): I18nText {
  return { iw: '', en: '' };
}

export function blankSpring(id: string): Spring {
  return {
    id,
    name: emptyI18n(),
    description: emptyI18n(),
    info: emptyI18n(),
    distanceFromCar: emptyI18n(),
    preferredSeason: emptyI18n(),
    depth: emptyI18n(),
    images: [],
    location: { latitude: 31.5, longitude: 34.9 },
    filterCamping: false,
    filterWater: false,
    filterCar: false,
    filterChildren: false,
    filterDepth: false,
    comments: [],
  };
}
