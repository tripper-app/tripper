import { Injectable, signal } from '@angular/core';
import {
  onAuthStateChanged,
  signInWithEmailAndPassword,
  signOut,
  User,
} from 'firebase/auth';
import { auth } from '../firebase/firebase';

@Injectable({ providedIn: 'root' })
export class AuthService {
  // Current signed-in user (null when signed out). Updated on every auth change.
  readonly user = signal<User | null>(null);

  // Resolves once Firebase has restored the persisted session on first load,
  // so the route guard can wait before deciding to redirect to /login.
  readonly ready: Promise<User | null>;

  constructor() {
    this.ready = new Promise((resolve) => {
      let first = true;
      onAuthStateChanged(auth, (u) => {
        this.user.set(u);
        if (first) {
          first = false;
          resolve(u);
        }
      });
    });
  }

  login(email: string, password: string) {
    return signInWithEmailAndPassword(auth, email, password);
  }

  logout() {
    return signOut(auth);
  }
}
