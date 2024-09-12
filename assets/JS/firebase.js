import { initializeApp } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-app.js";
import { getAuth } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import { getFirestore } from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

const firebaseConfig = {
  apiKey: "AIzaSyDHeMkKsIS9vPdfkEL8yiLVCgE9JIf9RWg",
  authDomain: "kamkaaj-123.firebaseapp.com",
  projectId: "kamkaaj-123",
  storageBucket: "kamkaaj-123.appspot.com",
  messagingSenderId: "788881986846",
  appId: "1:788881986846:web:9e41a6b4e931319245650f",
};

const app = initializeApp(firebaseConfig);
const auth = getAuth(app);
const db = getFirestore(app);

export { auth, db };