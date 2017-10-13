import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import { render } from 'react-dom';
//import {Router, Route} from 'react-router';

import './App.css';
import Header from './Header/components/Header';
import Account from './Account/components/Account';
import SellLayout from './Pages/Sell/components/SellLayout';
import Login from './Pages/Login/components/Login';
import * as firebase from 'firebase';
import CreateMessages from './Messages/components/CreateMessages';

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
  }
  render() {
    return (
      <div>
        <Header />
        <Switch>
          <Route exact path='/' component={SellLayout}/>
          <Route exact path='/account' component={Account}/>
          <Route exact path = '/login' component={Login}/>
          <Route exact path = '/create_messages' component={CreateMessages}/>
        </Switch>
      </div>
    );
  }
}

export default App;




