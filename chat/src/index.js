import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import registerServiceWorker from './registerServiceWorker';

import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// Initialize Firebase
var config = {
    apiKey: "AIzaSyCxCPv0SaV9KrL0rlkgeMRY09aKJREhLtg",
    authDomain: "chat-app-ed855.firebaseapp.com",
    databaseURL: "https://chat-app-ed855.firebaseio.com",
    projectId: "chat-app-ed855",
    storageBucket: "",
    messagingSenderId: "567791393896"
};
firebase.initializeApp(config);


ReactDOM.render(<App />, document.getElementById('root'));
registerServiceWorker();
