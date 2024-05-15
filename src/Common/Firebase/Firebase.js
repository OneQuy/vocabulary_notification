// https://firebase.google.com/docs/
// install: npm install firebase

import { initializeApp } from 'firebase/app';
import { FirebaseConfig } from '../../../Keys';

// Get these info when creating WEB app on firebase console:
// - Go to Console
// - Go to Project Settings
// - Add app > Web
const firebaseConfig = FirebaseConfig

var FirebaseApp = null;

export function GetFirebaseApp()
{ 
    FirebaseInit();
    return FirebaseApp;
}

export function FirebaseInit()
{ 
    if (FirebaseApp)
        return;
          
    FirebaseApp = initializeApp(firebaseConfig);
}