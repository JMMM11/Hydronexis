// Firebase SDK
import { initializeApp } from
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-app.js";

import { getAuth } from
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-auth.js";

import { getFirestore } from
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-firestore.js";

import { getStorage } from
  "https://www.gstatic.com/firebasejs/12.16.0/firebase-storage.js";


/* =========================
   CONFIGURACIÓN FIREBASE
========================= */

export const firebaseConfig = {
  apiKey: "AIzaSyCcuy8Wtbhn72dU6ayYqfcYN8bbRSeauSw",
  authDomain: "hydronexis-ch.firebaseapp.com",
  projectId: "hydronexis-ch",
  storageBucket: "hydronexis-ch.firebasestorage.app",
  messagingSenderId: "666732053585",
  appId: "1:666732053585:web:d736f714c9bfaaa8a5e470",
  measurementId: "G-QMH74LWN26"
};


/* =========================
   FIREBASE CONFIGURADO
========================= */

export const firebaseConfigured = true;


/* =========================
   INICIALIZAR FIREBASE
========================= */

export const app = initializeApp(firebaseConfig);


/* =========================
   AUTHENTICATION
========================= */

export const auth = getAuth(app);


/* =========================
   FIRESTORE
========================= */

export const db = getFirestore(app);


/* =========================
   FIREBASE STORAGE
========================= */

export const storage = getStorage(app);
