// ============================================================
// NEW HOPE STARS FC — FIREBASE CONFIGURATION
// ============================================================

const firebaseConfig = {
  apiKey:            "AIzaSyDlnDdWAsXA6oLD-y9ePCfp7JOqDj5VvXM",
  authDomain:        "new-hope-stars.firebaseapp.com",
  projectId:         "new-hope-stars",
  storageBucket:     "new-hope-stars.firebasestorage.app",
  messagingSenderId: "1058805910385",
  appId:             "1:1058805910385:web:08e4bc6e5e9430337744d0"
};

// ============================================================
// DO NOT EDIT BELOW THIS LINE
// ============================================================

firebase.initializeApp(firebaseConfig);

const db   = firebase.firestore();
const auth = firebase.auth();

// Storage is disabled until Firebase Storage is activated
// const storage = firebase.storage();

console.log('✅ New Hope Stars FC — Firebase connected.');
