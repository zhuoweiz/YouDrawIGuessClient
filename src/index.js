import React from 'react';
import ReactDOM from 'react-dom';
import './index.css';
import App from './App';
import reportWebVitals from './reportWebVitals';

import {
  ApolloClient,
  InMemoryCache,
  ApolloProvider,
} from "@apollo/client";

// Import the functions you need from the SDKs you need
import { initializeApp } from "firebase/app";
import { getAnalytics } from "firebase/analytics";
// TODO: Add SDKs for Firebase products that you want to use
// https://firebase.google.com/docs/web/setup#available-libraries

// Your web app's Firebase configuration
// For Firebase JS SDK v7.20.0 and later, measurementId is optional
const firebaseConfig = {
  apiKey: "AIzaSyBd4NZg0PJhy5A0qt6Ynjg6rPPcQGrfGas",
  authDomain: "hackrice11-326402.firebaseapp.com",
  projectId: "hackrice11-326402",
  storageBucket: "hackrice11-326402.appspot.com",
  messagingSenderId: "590587697803",
  appId: "1:590587697803:web:7beaa4b1ee94f83131d28e",
  measurementId: "G-GEESH3RH3Q"
};

// Initialize Firebase
const app = initializeApp(firebaseConfig);
const analytics = getAnalytics(app);

const client = new ApolloClient({
  uri: 
  
  // 'https://hackrice11-326402.ue.r.appspot.com/graphql',

  'http://localhost:4000/graphql',
  cache: new InMemoryCache()
});

ReactDOM.render(
  <ApolloProvider client={client}>
    {/* <React.StrictMode> */}
      <App />
    {/* </React.StrictMode> */}
  </ApolloProvider>
  ,
  document.getElementById('root')
);

// If you want to start measuring performance in your app, pass a function
// to log results (for example: reportWebVitals(console.log))
// or send to an analytics endpoint. Learn more: https://bit.ly/CRA-vitals
reportWebVitals();
