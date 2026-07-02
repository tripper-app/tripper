import { Injectable } from '@angular/core';
import {
  collection,
  deleteDoc,
  doc,
  GeoPoint,
  getDoc,
  getDocs,
  limit,
  orderBy,
  query,
  setDoc,
  where,
} from 'firebase/firestore';
import {
  deleteObject,
  getDownloadURL,
  listAll,
  ref,
  uploadBytes,
} from 'firebase/storage';
import { geohashForLocation } from 'geofire-common';
import { db, storage } from '../firebase/firebase';
import { Spring, SpringSummary, blankSpring } from '../models/spring';

const COLLECTION = 'springs';
const MAX_RESULTS = 50;

@Injectable({ providedIn: 'root' })
export class SpringsService {
  // Reserve a document id up front so images for a brand-new spring can be
  // uploaded to springs/<id>/... before the doc itself is first saved.
  newId(): string {
    return doc(collection(db, COLLECTION)).id;
  }

  // Prefix search on name.<lang> (mirrors the backend's getSpringByName).
  // An empty term lists the first springs ordered by name.
  async search(term: string, lang: 'iw' | 'en'): Promise<SpringSummary[]> {
    const col = collection(db, COLLECTION);
    const field = `name.${lang}`;
    const t = term.trim();
    const q = t
      ? query(col, where(field, '>=', t), where(field, '<=', t + ''), limit(MAX_RESULTS))
      : query(col, orderBy(field), limit(MAX_RESULTS));

    const snap = await getDocs(q);
    return snap.docs.map((d) => ({
      id: d.id,
      name: d.get('name') ?? { iw: '', en: '' },
      images: (d.get('images') as string[]) ?? [],
    }));
  }

  async get(id: string): Promise<Spring | null> {
    const snap = await getDoc(doc(db, COLLECTION, id));
    if (!snap.exists()) return null;
    const data = snap.data();
    const base = blankSpring(id);
    const loc = data['location'];
    return {
      ...base,
      ...data,
      id,
      location: loc
        ? { latitude: loc.latitude, longitude: loc.longitude }
        : base.location,
    } as Spring;
  }

  // Create or update. Writes location as a GeoPoint and (re)computes the geohash
  // used by the app's distance filter. `comments` is preserved via merge.
  async save(spring: Spring): Promise<void> {
    const { latitude, longitude } = spring.location;
    const data = {
      name: spring.name,
      description: spring.description,
      info: spring.info,
      distanceFromCar: spring.distanceFromCar,
      preferredSeason: spring.preferredSeason,
      depth: spring.depth,
      images: spring.images,
      filterCamping: !!spring.filterCamping,
      filterWater: !!spring.filterWater,
      filterCar: !!spring.filterCar,
      filterChildren: !!spring.filterChildren,
      filterDepth: !!spring.filterDepth,
      location: new GeoPoint(latitude, longitude),
      geohash: geohashForLocation([latitude, longitude]),
    };
    await setDoc(doc(db, COLLECTION, spring.id), data, { merge: true });
  }

  async delete(id: string): Promise<void> {
    await deleteDoc(doc(db, COLLECTION, id));
    // Best-effort cleanup of the spring's image folder in Storage.
    try {
      const listed = await listAll(ref(storage, `${COLLECTION}/${id}`));
      await Promise.all(listed.items.map((item) => deleteObject(item)));
    } catch {
      /* no images or already gone */
    }
  }

  async uploadImage(springId: string, file: File): Promise<string> {
    const safeName = file.name.replace(/[^\w.\-]+/g, '_');
    const path = `${COLLECTION}/${springId}/${Date.now()}_${safeName}`;
    const r = ref(storage, path);
    await uploadBytes(r, file, { contentType: file.type || 'image/jpeg' });
    return getDownloadURL(r);
  }

  async deleteImageByUrl(url: string): Promise<void> {
    try {
      await deleteObject(ref(storage, url));
    } catch {
      /* not in our bucket or already deleted */
    }
  }
}
