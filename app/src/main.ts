// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { AbortController, AbortSignal } from '@nativescript/core/abortcontroller';
import { platformNativeScriptDynamic } from '@nativescript/angular';

import { AppModule } from './app/app.module';

// Angular 21 (router / HttpClient) references the global AbortController, which the
// NativeScript V8 runtime does not provide. Register the @nativescript/core polyfill
// globally before bootstrapping.
const g: any = global as any;
if (!g.AbortController) {
  g.AbortController = AbortController;
}
if (!g.AbortSignal) {
  g.AbortSignal = AbortSignal;
}

// platformNativeScriptDynamic().bootstrapModule() internally attaches the root
// view and calls Application.run for NgModule apps. It logs a deprecation warning,
// but it's the ONLY working bootstrap on this version -- both alternatives fail:
//   - runNativeScriptAngularApp + platformNativeScript()  -> black screen (no root view)
//   - runNativeScriptAngularApp + platformNativeScriptDynamic() -> "Application is
//     already started" (bootstrapModule calls Application.run, and so does
//     runNativeScriptAngularApp -> double start).
// So do NOT wrap this in runNativeScriptAngularApp. The deprecation warning is expected.
platformNativeScriptDynamic().bootstrapModule(AppModule);
