// Firebase Configuration
// Replace these values with your Firebase project credentials

const firebaseConfig = {
    apiKey: "AIzaSyAwP95hF4wD4DIM7QBPEClzOlJHa2Im2nE",
    authDomain: "mynotes-8e05e.firebaseapp.com",
    projectId: "mynotes-8e05e",
    storageBucket: "mynotes-8e05e.firebasestorage.app",
    messagingSenderId: "836423999806",
    appId: "1:836423999806:web:bc5145f42cb6f741400c6f",
    measurementId: "G-FHM78K5D5B"
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

// Firebase services
const auth = firebase.auth();
const db = firebase.firestore();
const storage = firebase.storage();

// Google Auth Provider
const googleProvider = new firebase.auth.GoogleAuthProvider();
