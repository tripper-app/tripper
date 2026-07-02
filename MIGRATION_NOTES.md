# Dependency Modernization — Migration Notes

Date: 2026-06-23. Updated all three parts of the project to current dependency
versions installed on this machine (Node 20, npm 10, NativeScript CLI 9, Angular CLI 17).

---

## 1. Firebase Functions (`functions/functions`) — ✅ fully verified

`npm run lint` and `npm run build` both pass.

- Node engine `16 → 20`
- `firebase-functions 4 → 7.2.5`, `firebase-admin 11 → 13.10`, `firebase 9 → 12.15`,
  `nodemailer 6 → 9`, `jsonwebtoken 8 → 9`, `geofire-common 5 → 6`
- `typescript → 6.0` (now requires explicit `rootDir`, added to `tsconfig.json`)
- **Code change:** `import * as functions from 'firebase-functions'` →
  `'firebase-functions/v1'`. The v1 trigger API (`functions.region().runWith().https.onRequest`,
  `RuntimeOptions`, `logger`) moved under `/v1` in firebase-functions 5+.
- **ESLint migrated to flat config** (`eslint.config.js`, ESLint 9 + unified
  `typescript-eslint` 8). The legacy `.eslintrc.js` was removed. Uses
  `eslint-import-resolver-typescript@3` (v4 isn't compatible with classic
  `eslint-plugin-import`). `import/namespace` is disabled — TypeScript already
  validates namespace member access and it false-positived on `firebase-functions/v1`.

## 2. Root `package.json` — ✅ updated

Vestigial (no source/build), bumped to current: `firebase 12`, `firebase-admin 13`,
`firebase-functions 7`, `firebase-tools 15`, `nodemailer 9`, `@types/node 26`,
`typescript-eslint 8`.

## 3. NativeScript app (`app/`) — ⚠️ migrated, type-checks clean, NOT build-tested

`npx tsc --noEmit` and `npx ngc -p tsconfig.json --noEmit` (Angular AOT + full HTML
template type-check) both report **0 errors**.

### Stack
- NativeScript `6.4 → 9`, `tns-core-modules → @nativescript/core`,
  `nativescript-angular → @nativescript/angular`, Angular `8 → 21`, TypeScript `3.5 → 5.9`
- Build system fully replaced: the ~360-line `nativescript-dev-webpack` `webpack.config.js`
  is now the 5-line `@nativescript/webpack` v5 config. `nsconfig.json` + `tsconfig.tns.json`
  replaced by `nativescript.config.ts`. Added `references.d.ts`, new `main.ts`
  (`runNativeScriptAngularApp`).

### Source migration highlights
- `screen` (platform) → `Screen` (imported aliased `Screen as screen`, usages unchanged)
- `application.*` → `Application.*` / `AndroidApplication.*`
- `openUrl`/connectivity/`Accuracy` → moved to `@nativescript/core/utils`,
  `/connectivity`, `CoreTypes.Accuracy`
- `HttpClient.get/post` given `<any>` generics (Angular now returns `Observable<Object>`)
- **Angular 21: components are standalone by default** → added `standalone: false` to
  every `@Component`/`@Pipe` to keep the NgModule architecture.
- **Template member visibility is enforced** (even with `strictTemplates: false`) →
  injected members used in templates were changed from `private` to `public`.
- `entryComponents` removed (gone since Angular 13).

### ✅ Verified running on Android emulator (2026-06-24)
The app was subsequently **built, installed, and launched on an Android 16 (API 36)
emulator** via Android Studio's SDK. The home/map screen renders (Google Maps tiles,
branding, RTL Hebrew UI), permissions prompt works, and the migrated `AlertService`
dialog works. See "Running on Android" below for the exact procedure and the fixes
that were required.

### Running on Android — required environment + fixes
- **Node 22 required for the build.** The system Node is 20.12, but
  `@angular-devkit/build-angular`'s babel linker `require()`s Angular 21's ESM-only
  `@angular/compiler-cli/linker`, which only works under Node ≥22.12 (`require(ESM)`).
  A portable Node 22 was used just for `ns run` (system Node left untouched). Install
  Node 22 LTS (or 24) and use it for NativeScript builds.
- **Unset `NoDefaultCurrentDirectoryInExePath`** before `ns run`. NS spawns a bare
  `gradlew.bat` relying on cmd.exe searching the current dir; with that env var = 1
  (it was set on this machine) cmd won't, and plugin builds fail with
  "'gradlew.bat' is not recognized". `Remove-Item Env:\NoDefaultCurrentDirectoryInExePath`.
- Build/run from **PowerShell or cmd**, not Git Bash, and set `ANDROID_HOME`,
  `ANDROID_SDK_ROOT`, `JAVA_HOME` (Android Studio's `jbr`). Command used:
  `ns run android --device <emulatorId> --no-hmr` (with `CI=1` to skip prompts).
- SDK pieces installed for the build: `platforms;android-35`, `build-tools;35.0.0`
  (NS didn't recognize the `android-36.1` platform Android Studio had), plus the
  `system-images;android-36;google_apis;x86_64` emulator image.

### node_modules patches (✅ now handled by patch-package — survive reinstalls)
These `node_modules` edits used to be reverted by every `npm install`. They are now
committed as patch files under `app/patches/` and re-applied automatically via the
`postinstall": "patch-package"` script (deps: `patch-package`, `postinstall-postinstall`).
Do NOT hand-edit `node_modules` for these; edit the plugin file then run
`npx patch-package <plugin-name>` to refresh the patch.
- `patches/nativescript-google-maps-sdk+3.0.2.patch`:
  `platforms/android/include.gradle` `compile` → `implementation`
- `patches/nativescript-carousel+7.0.1.patch`:
  `platforms/android/include.gradle` `compile` → `implementation`, and the dep
  `com.romandanylyk:pageindicatorview:1.0.3` (dead JCenter artifact) →
  `com.github.romandanylyk:PageIndicatorView:1.0.1` (jitpack). The
  `maven { url 'https://jitpack.io' }` repository for it is in `App_Resources/Android/app.gradle`.

### App_Resources / source fixes made to build & run on AGP 8 + Angular 21
- `App_Resources/Android/before-plugins.gradle`: removed the invalid `android { }`
  wrapper (root project has no `android` extension in NS 8/9).
- `App_Resources/Android/app.gradle`: `minSdkVersion 19→21`, `targetSdkVersion 30→34`,
  added jitpack repository.
- `App_Resources/Android/src/main/AndroidManifest.xml`: removed `package=` attribute
  (AGP 8 sets namespace from gradle; app id `com.bartovCoder.tripper` is now in
  `nativescript.config.ts`), and added `android:exported="true"` to the launcher activity.
- `src/main.ts`: bootstrap via **standalone** `platformNativeScriptDynamic().bootstrapModule(AppModule)`
  (it logs a deprecation warning — accept it; it's the only form that works on this version).
  ⚠️ Both "modern" alternatives are broken here:
    - `runNativeScriptAngularApp({ appModuleBootstrap: () => platformNativeScript()... })` →
      Angular boots but NativeScript's root view is never attached → **black screen** (0 views,
      "Angular is running in development mode" logged, no errors).
    - `runNativeScriptAngularApp({ appModuleBootstrap: () => platformNativeScriptDynamic()... })` →
      **"Application is already started"** — `bootstrapModule` calls `Application.run` internally and
      so does `runNativeScriptAngularApp` → double start.
  So `bootstrapModule` must NOT be wrapped in `runNativeScriptAngularApp`. Also added a
  global `AbortController`/`AbortSignal` polyfill from `@nativescript/core/abortcontroller`
  (Angular 21 router/HttpClient need it; NS V8 doesn't provide it).
- `alert-service.ts`: replaced abandoned `nativescript-sweet-alert` (imports removed
  `tns-core-modules/*`) with `@nativescript/core` `alert()`.

### Still to verify on device / known runtime caveats
- The home screen showed the app's own "server error" dialog — the app reached the
  Firebase Functions backend and got an error. Confirm the (updated) functions are
  deployed and the mobile app's endpoints/keys are correct.
- Google Maps tiles rendered, but `nativescript_google_maps_api_key` is effectively a
  placeholder — set a real key for production.
- Plugin behaviors still to exercise on device:

| Plugin | Status | Action needed |
|--------|--------|---------------|
| `nativescript-range-seek-bar` | **Removed** from `app.module.ts` — its Angular module isn't a valid Ivy NgModule on Angular 21 | `<RangeSeekBar>` in spring-filters / hotels-filters won't render. Replace with a maintained slider (e.g. core `Slider` or `@nativescript-community/ui-*`) |
| `@teammaestro/nativescript-svg` → `@nativescript-community/ui-svg` | `SVGView` registered as the `SVGImage` element | Different implementation — verify the `<SVGImage>` icons still render |
| `@nativescript/imagepicker` v5 | Rewrote `profile.component` to load via `ImageSource.fromFileSync(selection.path)` | Android-specific bitmap/base64 path — test on device |
| `nativescript-sweet-alert`, `nativescript-soft-keyboard`, `nativescript-google-login` | Installed at last-published (NS6-era) versions | Likely won't build/run on NS9 — verify or replace |
| `nativescript-google-maps-sdk`, `nativescript-oauth2`, `nativescript-carousel`, `nativescript-phone` | Updated to latest | Runtime-test maps, OAuth, carousel, dialer |

### Other notes
- Installs used `--legacy-peer-deps` (community plugins haven't all caught up to
  Angular 21 peers). Re-run `ns doctor` / `ns build` on a tooled machine.
- A stray `C:\Users\OdedBartov\node_modules` (home dir, an ancestor of the project)
  contains a second `rxjs`/`@angular`. `tsconfig.json` pins `rxjs` to the app's local
  copy for the type-checker; if the webpack build shows duplicate-module issues,
  remove that stray home `node_modules`.
- 5 unused plugins were dropped: `facebook-sdk`, `nativescript-facebook`,
  `nativescript-fancyalert`, `nativescript-gif`, `nativescript-plugin-universal-links`.
