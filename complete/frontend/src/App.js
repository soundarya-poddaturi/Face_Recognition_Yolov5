import './App.css'
import Homepage from "./components/homepage"
import Login from "./components/login"
import Register from "./components/register"
// import Student from "./components/student/student"
import Upload from "./components/upload"
import Detect from "./components/detect"


import { BrowserRouter as Router, Switch, Route } from "react-router-dom";
import { useState } from 'react';

function App() {

  const [ user, setLoginUser] = useState({})
  return (
    <div className="App">
      <Router>
        <Switch>
          <Route exact path="/">
            {
              user && user._id ? <Homepage setLoginUser={setLoginUser} /> : <Login setLoginUser={setLoginUser}/>
            }
          </Route>
          <Route path="/login"><Login setLoginUser={setLoginUser}/></Route>
          <Route path="/register"><Register /></Route>
          {/* <Route path="/student"><Student /></Route> */}
          <Route path="/upload"><Upload /></Route>
          <Route path="/detect"><Detect /></Route>
        </Switch>
      </Router>
    </div>
  );
}

export default App;
