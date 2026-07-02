# Tripper — Springs Admin

A small Angular web app to manage the springs stored in the Tripper Firebase
project (`tripper-d0e21`). It lets you:

- **Search** springs by name (Hebrew or English).
- **Edit** all details — multilingual text fields, an interactive **map** to place
  the location (click / drag the pin), and the filter flags used by the mobile app.
- **Add / remove images** (uploaded to Firebase Storage under `springs/<id>/…`).
- **Create** a new spring or **delete** an existing one.

It talks to Firestore + Storage **directly** (no changes to the mobile backend).
Writes are gated behind a Firebase Authentication sign-in so only an admin can
change data. The mobile app is unaffected — its Cloud Functions use the Admin SDK,
which bypasses client security rules.

---

## One-time setup

You need to do three things in the [Firebase Console](https://console.firebase.google.com/project/tripper-d0e21):

### 1. Create an admin login

**Authentication → Sign-in method →** enable **Email/Password**.
Then **Authentication → Users → Add user** and create your admin email + password.
(You'll sign in with these in the app.)

### 2. Allow that admin to read/write springs (Firestore)

**Firestore Database → Rules.** Merge in the `springs` rule from
[`firestore.rules`](./firestore.rules):

```
match /springs/{springId} {
  allow read, write: if request.auth != null;
}
```

> ⚠️ Merge — don't blindly replace rules the mobile app might rely on. (In this
> project the app reads springs via Cloud Functions, which bypass rules, so a
> restrictive default is fine.)

### 3. Allow image uploads (Storage)

**Storage → Rules.** Merge in the rule from [`storage.rules`](./storage.rules):

```
match /springs/{springId}/{fileName} {
  allow read: if true;
  allow write: if request.auth != null;
}
```

---

## Run it

```bash
cd springs-admin
npm install
npm start
```

Open http://localhost:4200, sign in with the admin account from step 1.

To build for production: `npm run build` (output in `dist/springs-admin/browser`).

## Deploy to Firebase Hosting

Hosting is already configured ([`firebase.json`](./firebase.json) +
[`.firebaserc`](./.firebaserc), targeting project `tripper-d0e21`). It builds the
app and serves it as a single-page app (all routes rewrite to `index.html`).

```bash
npm run deploy
```

This runs `ng build` then `firebase deploy --only hosting` (requires the Firebase
CLI — you already have `firebase-tools` from the functions deploys; otherwise
`npm i -g firebase-tools` and `firebase login`). It deploys **only Hosting**, so
the mobile backend's Cloud Functions are untouched.

After deploy it's live at `https://tripper-d0e21.web.app`. Add that origin under
**Authentication → Settings → Authorized domains** so admin sign-in works there
(`localhost` is authorized by default for local dev).

> Want it on its own URL instead of the project's default site? Run
> `firebase hosting:sites:create tripper-springs-admin`, add a `"site"` key to the
> `hosting` block in `firebase.json`, then `npm run deploy`.

The map uses free OpenStreetMap tiles (no API key required).

---

## How data maps to Firestore

Each spring is a document in the `springs` collection:

| Field | Type | Notes |
|-------|------|-------|
| `name`, `description`, `info`, `preferredSeason`, `depth`, `distanceFromCar` | `{ iw, en }` | Multilingual; the app reads `field[lang]`. |
| `location` | GeoPoint | Edited as latitude / longitude. |
| `geohash` | string | **Auto-computed on save** from `location` (used by the app's distance filter). |
| `filterWater`, `filterCamping`, `filterChildren`, `filterCar`, `filterDepth` | boolean | The app's search filters. |
| `images` | string[] | Public download URLs to files in `springs/<id>/…`. |
| `comments` | array | Left untouched by this admin (preserved on save). |

The Firebase project config lives in
[`src/environments/environment.ts`](./src/environments/environment.ts) — it's the
same public web config the backend uses. It contains no secrets; access is
controlled entirely by Auth + the security rules above.
