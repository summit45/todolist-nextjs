import firebase from "firebase/compat/app";
import "firebase/compat/auth";
import "firebase/compat/firestore";
import "firebase/compat/storage";

// Your web app's Firebase configuration
const firebaseConfig = {
    apiKey: "AIzaSyBq_9sjZlJlBESl0c2Q3-Xw9bL6fjKMFpQ", 
    authDomain: "todolist-nextjs.firebaseapp.com",
    projectId: "todolist-nextjs",
    storageBucket: "todolist-nextjs.appspot.com",
    messagingSenderId: "741576495141", 
    appId: "1:741576495141:web:f889baeb0d27b1261cefcc", 
};

// Initialize Firebase
firebase.initializeApp(firebaseConfig);

export const firebaseInstance = firebase;
export const dbService = firebase.firestore();
export const storageService = firebase.storage();
export const authService = firebase.auth();

// .env파일 사용하려고 하면 오류
// const firebaseConfig = {
//     apiKey: process.env.REACT_APP_API_KEY,
//     authDomain: process.env.REACT_APP_AUTH_DOMAIN,
//     projectId: process.env.REACT_APP_PROJECT_ID,
//     storageBucket: process.env.REACT_APP_STORAGE_BUCKET,
//     messagingSenderId: process.env.REACT_APP_MESSAGIN_ID,
//     appId: process.env.REACT_APP_APP_ID
// };
