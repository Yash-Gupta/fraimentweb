import React, { Component } from 'react';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';

import './App.css';
import Header from './Header/components/Header';
import SellLayout from './Pages/Sell/components/SellLayout';
import * as firebase from 'firebase'
import Login from './Pages/Login/components/Login';


class App extends Component {
  constructor(props){
    super(props);
    var config = {
      apiKey: "AIzaSyCUBfhynXfwNM9CTai6ZzHHwi50wzMk-bI",
      authDomain: "fraiment-api.firebaseapp.com",
      databaseURL: "https:\/\/fraiment-api.firebaseio.com",
      projectId: "fraiment-api",
      storageBucket: "fraiment-api.appspot.com",
      messagingSenderId: "628845242596"
    };

    firebase.initializeApp(config);
    firebase.auth().signOut();

    this.state = {
      database: firebase.database(),
    }
  }
  render() {
    return (
      <div>
        <Header />
        <SellLayout />
        <Login />
      </div>
    );
  }
}

export default App;
