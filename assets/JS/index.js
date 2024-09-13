import { auth, db } from "./firebase.js";
import {
  createUserWithEmailAndPassword,
  signInWithEmailAndPassword,
  signOut,
  onAuthStateChanged,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js";
import {
  collection,
  addDoc,
  onSnapshot,
  doc,
  updateDoc,
  deleteDoc,
} from "https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js";

if (document.getElementById("loginPage")) {
  const loginForm = document.querySelector(".loginForm");
  loginForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const email = formData.get("email");
    const password = formData.get("password");
    signInWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      window.location.href = "/index.html";

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  });
}
else if (document.getElementById("signupPage")) {
  const signupForm = document.querySelector(".signupForm");
  signupForm.addEventListener("submit", (e) => {
    e.preventDefault();
    const formData = new FormData(e.target);
    const username = formData.get("username");
    const email = formData.get("email");
    const password = formData.get("password");
    createUserWithEmailAndPassword(auth, email, password)
      .then((userCredential) => {
        const user = userCredential.user;
        console.log(user);
      window.location.href = "/index.html";

      })
      .catch((error) => {
        const errorCode = error.code;
        const errorMessage = error.message;
        console.log(errorMessage);
      });
  });
}
else if (document.getElementById("indexPage")) {
  onAuthStateChanged(auth, (user) => {
    if (user) {
      console.log("User is logged in:", user.email);
    }
    else {
      console.log("User is not logged in, redirecting to login page...");
      window.location.href = "/login.html";
    }   
  });
}
else {
  document.write("No Routes Match");
}

// function toggleTheme() {
//     const currentTheme = document.documentElement.getAttribute('data-theme');
//     const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
//     document.documentElement.setAttribute('data-theme', newTheme);
//   }

//   // Example of adding an event listener to a button
//   document.getElementById('theme-toggle-button').addEventListener('click', toggleTheme);
