import React, { useEffect } from 'react';

import { Button, Typography, Grid, Paper } from '@mui/material';

import { getAuth, signOut, signInWithPopup, GoogleAuthProvider, onAuthStateChanged } from "firebase/auth";
import DrawingBoard from 'react-drawing-board';

import make_prediction from './vision/labelImage';
import { collection, addDoc, query, where , getDocs } from "firebase/firestore"; 
import { getFirestore } from "firebase/firestore"

import {
  gql, useMutation
} from "@apollo/client";

// import firebase from "firebase";
// // Required for side-effects
// require("firebase/firestore");
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


const GameModule = (props) => {
  const [operations, setOperations] = React.useState();
  const question = props.question;

  const db = getFirestore();
  const auth = getAuth();
  const user = auth.currentUser;


  async function handleSubmission(data) {
    console.log("response", data );
    var result = false;
    data.forEach((Element) => {
      console.log(Element)
      if (Element.description.toLowerCase() == question.toLowerCase()){
        result = true; 
      }
    })
    console.log(result)
    //console.log(data[0])
    if (result == true){
      alert("Congratulations!")
      const docRef = await addDoc(collection(db, "record"), {
        user_ID: user.uid,
        result: result,
        question: question,
        time: Date.now(),
      });
      console.log("Document written with ID: ", docRef.id);
      
    } else {
      alert("Sorry, try again!")
    }
    
  };

  return(
    <Grid container justifyContent={'center'} alignItems={'center'}>
      <Grid item style={{
        width: 840,
        backgroundColor: 'black',
        padding:20,
      }}>

        <Typography> </Typography>
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

            make_prediction(imageData, handleSubmission);
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

  const [loggedIn, setLoggedIn] = React.useState(false);
  const [username, setUsername] = React.useState("");
  const [ready, setReady] = React.useState(false);
  const [recordsData, setRecords] = React.useState([]);

  const [question, setQuestion] = React.useState("");

  const [getQuestionMutation, {data}] = useMutation(gql`mutation GetQuestion{getQuestion}`)

  async function getRecords(uid) {
    const db = getFirestore();
    const citiesRef = collection(db, "record");
    const q = query(citiesRef, where("user_ID", "==", uid));
    var data = [];
    const querySnapshot = await getDocs(q);
    querySnapshot.forEach((doc) => {
      // doc.data() is never undefined for query doc snapshots
      console.log(doc.id, " => ", doc.data());

      data.push(doc.data());
    });

    console.log("data: ", data);
    setRecords(data);
  }

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
              

              // TODO send ready signal to server
              
              if (!ready) {
                getQuestionMutation({
                  variables: {}
                })
                .then(Response => {
                  console.log("get question: ", Response);
                });
              }
              setReady(!ready);
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

      <Grid container justifyContent={'center'} alignItems={'center'} >
        <Grid item>
          <Paper variant="outlined" style={{
            width: 300,
            padding: 16,
          }}>
            {
              recordsData.map((Element, index) => {
                // doc.data() is never undefined for query doc snapshots
                const newDate = new Date(Element.time);
                    return (
                      <Typography key={index}>time: {newDate.getMonth()+1}-{newDate.getDate()} Time:{newDate.getHours()} question: {Element.question} result: {Element.result} </Typography>
                    )
                  })
            }
            <Typography>
              user_ID: {user.email}
            </Typography>
          </Paper>
        </Grid>
      </Grid>

          <Typography>
            {data && data.getQuestion && ready ? "your question is:" + data.getQuestion : ""}
          </Typography>
          {
            ready ? <GameModule question = {data ? data.getQuestion : ""}></GameModule> : null
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

                  getRecords(user.uid)

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
