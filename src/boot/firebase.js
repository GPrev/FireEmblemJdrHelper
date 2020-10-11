// Firebase App (the core Firebase SDK) is always required and
// must be listed before other Firebase SDKs
var firebase = require("firebase/app");

// Add the Firebase products that you want to use
require("firebase/auth");
require("firebase/database");

// Your web app's Firebase configuration
var firebaseConfig = {
  apiKey: "AIzaSyBhHq-hd22N65LM62LneevFFX1pJLSs5PM",
  authDomain: "fire-emblem-jdr-helper.firebaseapp.com",
  databaseURL: "https://fire-emblem-jdr-helper.firebaseio.com",
  projectId: "fire-emblem-jdr-helper",
  storageBucket: "fire-emblem-jdr-helper.appspot.com",
  messagingSenderId: "786654997829",
  appId: "1:786654997829:web:104757ca3cabdee157a22c"
};
// Initialize Firebase
let firebaseApp = firebase.initializeApp(firebaseConfig);
let firebaseAuth = firebaseApp.auth()
let firebaseDB = firebaseApp.database()

export { firebaseAuth, firebaseDB }