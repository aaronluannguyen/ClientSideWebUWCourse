import React, { Component } from 'react';
import {HashRouter as Router, Switch, Redirect, Route} from "react-router-dom";
import {ROUTES} from "./constants";
import './App.css';
import firebase from "firebase/app";
import "firebase/auth";
import "firebase/database";

// Import Views
import SignInView from "./Views/SignIn";
import SignUpView from "./Views/SignUp";
import MainView from "./Views/MainView"

class App extends Component {
  render() {
    return (
      <Router>
          <Switch>
              <Route exact path={ROUTES.signIn} component={SignInView} />
              <Route path={ROUTES.signUp} component={SignUpView}/>
              <Route path={ROUTES.main} component={MainView}/>
              <Redirect to={ROUTES.signIn}/>
          </Switch>
      </Router>
    );
  }
}

export default App;
