import React from 'react';

import { Button, Typography, Grid, Paper } from '@mui/material';

import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import DrawingBoard from 'react-drawing-board';

import make_prediction from './vision/labelImage';


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

const GameModule = () => {
  const [operations, setOperations] = React.useState();

  return(
    <Grid container justifyContent={'center'} alignItems={'center'}>
      <Grid item style={{
        width: 840,
        backgroundColor: 'black',
        padding:20,
      }}>
        <DrawingBoard
          style={{
            width: 800,
            height: 500,
          }}
          
          userId="user1" // identify for different players.
          operations={operations}
          onChange={(newOperation, afterOperation) => {
            console.log(`TODO: send ${newOperation}`);
            setOperations(afterOperation);
          }}
          onSave={(image) => {
            // console.log("IMAGE DATA: ",  );
            let imageData = image.dataUrl.split(',')[1];

            make_prediction(imageData);
          }}
        />
      </Grid>
    </Grid>
  )

}

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

  
  const [loggedIn, setLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [ready, setReady] = React.useState(false);

  return (
    <div style={{
      paddingTop: 40
    }}>

      {/* <Grid> */}
      <Grid container justifyContent={'center'} alignItems={'center'} >
        <Grid item>
          <Paper variant="outlined" style={{
            width: 300,
            padding: 16,
          }}>
            <Typography>
              Welcome to the game, you will get a hint then draw it on the whiteboard. Our server will be the judge. Try to beat your component.
            </Typography>
          </Paper>
        </Grid>
      </Grid>
      
      
      

      {
        loggedIn ? 
        <>
          <Typography>{username}</Typography> 
          <Button
            // disabled={ready}
            onClick={()=>{
              setReady(!ready);
              // TODO send ready signal to server
            }}
          >{ready ? "Leave" : "Ready"}</Button>
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

          {
            ready ? <GameModule></GameModule> : null
          }
          
        </>
        :
        <>
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

          
        </>
      }
    </div>
  );
}

export default Start;
