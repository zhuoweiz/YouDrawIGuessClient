import React from 'react';

import { Button, Typography } from '@mui/material';

import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import DrawingBoard from 'react-drawing-board';


// import {
//   useQuery,
//   gql
// } from "@apollo/client";

// import {
//   BrowserRouter as Router,
//   Switch,
//   Route,
//   Link
// } from "react-router-dom";

const Start = () => {

  
  const provider = new GoogleAuthProvider();
  const auth = getAuth();
  const user = auth.currentUser;

  onAuthStateChanged(auth, (user) => {
    if (user) {
      // User is signed in, see docs for a list of available properties
      // https://firebase.google.com/docs/reference/js/firebase.User
      const uid = user.uid;
      console.log("USER IS SIGNED IN: ", uid);
      // ...
    } else {
      // User is signed out
      // ...
      console.log("USER SIGNED OUT");
    }
  });

  const [operations, setOperations] = React.useState();
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState("");

  return (
    <div>
      Game will start soon

      {
        loggedIn ? 
        <>
          <Typography>{username}</Typography> 
          <Button
            onClick={()=>{
              signOut(auth).then(() => {
                // Sign-out successful.
                setLoggedIn(false);
                setUsername("");
              }).catch((error) => {
                // An error happened.
              });
            }}
          >Sign Out</Button>
        </>
        :
        <Button color='primary'
          onClick={() => {
            signInWithPopup(auth, provider)
              .then((result) => {
                // This gives you a Google Access Token. You can use it to access the Google API.
                const credential = GoogleAuthProvider.credentialFromResult(result);
                const token = credential.accessToken;
                // The signed-in user info.
                const user = result.user;
                console.log("user: ", user);

                setLoggedIn(true);
                setUsername(user.email);
                
                // ...
              }).catch((error) => {
                // Handle Errors here.
                const errorCode = error.code;
                const errorMessage = error.message;
                // The email of the user's account used.
                const email = error.email;
                // The AuthCredential type that was used.
                const credential = GoogleAuthProvider.credentialFromError(error);
                // ...
              });
              
          }}
        >
          LogIn
        </Button>
      }

      

      <DrawingBoard
        userId="user1" // identify for different players.
        operations={operations}
        onChange={(newOperation, afterOperation) => {
          console.log(`TODO: send ${newOperation}`);
          setOperations(afterOperation);
        }}
      />
    </div>
  );
}

export default Start;
