// src/config/firebase.js
// Configuração do Firebase para a aplicação DevClub Stars

import { initializeApp } from 'firebase/app';
import { getFirestore } from 'firebase/firestore';
import { getStorage } from 'firebase/storage';

// Sua configuração do Firebase
// Substitua estas configurações pelas suas do console do Firebase
const firebaseConfig = {
  apiKey: "AIzaSyAbHFEa7KC-TIuf3gMdjnPDvPOlNcGxBRE",
  authDomain: "devclub-stars.firebaseapp.com",
  projectId: "devclub-stars",
  storageBucket: "devclub-stars.firebasestorage.app",
  messagingSenderId: "920354121988",
  appId: "1:920354121988:web:93559c7fee7b7fd2db0851"
};

// Inicializa o Firebase
const app = initializeApp(firebaseConfig);

// Inicializa o Firestore
const db = getFirestore(app);

// Inicializa o Storage
const storage = getStorage(app);

export { db, storage };