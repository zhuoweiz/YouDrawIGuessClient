import logo from './logo.svg';
import './App.css';
import Start from './Start';

import {
  useQuery,
  gql
} from "@apollo/client";

import {
  BrowserRouter as Router,
  Switch,
  Route,
  // Link
} from "react-router-dom";

function App() {
  const { data } = useQuery(gql`query Test{ test }`);

  if(data) {
    console.log("test query: " , data);
  }

  return (
    <Router>
      <div className="App">
        <Switch>
          <Route path="/start">
            <Start></Start>
          </Route>

          <Route path="/">
            <header className="App-header">
              
              
              <a 
                className="Start-link"
                href="/start"
                rel="noopener noreferrer"
              >
                <img src={logo} className="App-logo" alt="logo" />
              </a>
              <p>
                YOU DRAW I GUESS {data && data.test ? data.test : null}
              </p>
              <a
                className="App-link"
                href="https://github.com/zhuoweiz/YouDrawIGuess"
                target="_blank"
                rel="noopener noreferrer"
              >
                <code>A HackRice project</code>
              </a>
            </header>
          </Route>

          
        </Switch>
      </div>
    </Router>
  );
}

export default App;
 