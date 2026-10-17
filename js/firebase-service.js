import {
  app,
  auth,
  db,
  firebaseConfigured
} from "./firebase-config.js";

import * as firestore from
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import * as authApi from
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";


export function isFirebaseConfigured() {
  return firebaseConfigured;
}


export async function getFirebaseServices() {
  if (!firebaseConfigured) {
    throw new Error(
      "Firebase no está configurado."
    );
  }

  return {
    app,
    auth,
    db,
    firestore,
    authApi
  };
}