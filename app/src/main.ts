// this import should be first in order to load some required settings (like globals and reflect-metadata)
import { AbortController, AbortSignal } from '@nativescript/core/abortcontroller';
import { runNativeScriptAngularApp, platformNativeScript } from '@nativescript/angular';

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

// runNativeScriptAngularApp owns the app lifecycle (Application.run, HMR, launch
// view). We bootstrap the NgModule inside appModuleBootstrap using the plain
// platformNativeScript() PlatformRef -- unlike the deprecated
// platformNativeScriptDynamic(), it does NOT auto-launch the app, so there is no
// double-start ("Application is already started").
runNativeScriptAngularApp({
  appModuleBootstrap: () => platformNativeScript().bootstrapModule(AppModule),
});
