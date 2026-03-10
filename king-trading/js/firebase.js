// ============================================================
//  firebase.js — Firebase Configuration
//  King Trading Co. Grocery Store
//
//  ⚠️  Replace the values below with YOUR Firebase project's
//      credentials from the Firebase Console.
//
//  HOW TO GET THESE VALUES:
//  1. Go to https://console.firebase.google.com
//  2. Open your project → ⚙️ Project Settings
//  3. Scroll to "Your apps" → click </> Web icon
//  4. Copy the firebaseConfig object and paste it here
// ============================================================

// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBg0HeoooI58R6ikEfM5oaC5kPmfS9VskM",
  authDomain: "kingtradingco-eac53.firebaseapp.com",
  databaseURL: "https://kingtradingco-eac53-default-rtdb.asia-southeast1.firebasedatabase.app",
  projectId: "kingtradingco-eac53",
  storageBucket: "kingtradingco-eac53.firebasestorage.app",
  messagingSenderId: "705858167354",
  appId: "1:705858167354:web:03bfc2cc0e702b428b0b03",
  measurementId: "G-CTYE1YC20V"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// ── Services used ──
const db   = firebase.firestore();   // Firestore database (stores products + base64 images)
const auth = firebase.auth();        // Authentication (admin login)

// ── Products collection reference ──
const productsCol = db.collection("products");

// ── NOTE: Firebase Storage is NOT used ──
// Images are compressed in the browser and stored as
// base64 data URLs directly inside each Firestore document.
// This means NO paid plan is needed for image storage!
