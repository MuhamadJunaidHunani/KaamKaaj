import { auth, db } from './firebase.js';
import { createUserWithEmailAndPassword, signInWithEmailAndPassword, signOut } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-auth.js';
import { collection, addDoc, onSnapshot, doc, updateDoc, deleteDoc } from 'https://www.gstatic.com/firebasejs/10.13.1/firebase-firestore.js';



// function toggleTheme() {
//     const currentTheme = document.documentElement.getAttribute('data-theme');
//     const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
//     document.documentElement.setAttribute('data-theme', newTheme);
//   }
  
//   // Example of adding an event listener to a button
//   document.getElementById('theme-toggle-button').addEventListener('click', toggleTheme);