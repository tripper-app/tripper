// Firebase project config for the Tripper springs admin.
// This is the same public web config used by the mobile backend
// (functions/functions/src/index.ts) — it points at the "tripper-d0e21" project.
// These keys are not secrets; access is controlled by Firebase Auth + security rules.
export const environment = {
  firebase: {
    apiKey: 'AIzaSyAnnNBKwmXrXQ6lmexwt-oQs5aRTxkwV8A',
    authDomain: 'tripper-d0e21.firebaseapp.com',
    databaseURL: 'https://tripper-d0e21.firebaseio.com',
    projectId: 'tripper-d0e21',
    storageBucket: 'tripper-d0e21.appspot.com',
    messagingSenderId: '658415875612',
    appId: '1:658415875612:web:b1535639c70c6fdc2591d9',
    measurementId: 'G-HFCHK193HY',
  },
};
