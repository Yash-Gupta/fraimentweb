import React, { Component } from 'react';
import {Switch, Route} from 'react-router-dom';
import { render } from 'react-dom';

import './App.css';
import * as firebase from 'firebase';

import Home from './scenes/Home/components/Home';
import Header from './components/Header/components/Header';
import Account from './scenes/Account/components/Account';
import CreateListing from './scenes/CreateListing/components/CreateListing';
import Login from './scenes/Login/components/Login';
import CreateMessages from './components/MessageThread/components/CreateMessages';
import ProductDetail from './scenes/ProductDetail/components/ProductDetail';

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
          <Route exact path='/' component={Home}/>
          <Route exact path='/account' component={Account}/>
          <Route exact path = '/login' component={Login}/>
          <Route exact path = '/create_listing' component={CreateListing}/>
          <Route exact path = '/create_messages' component={CreateMessages}/>
          <Route exact path = '/product/:id' component={ProductDetail}/>        
       </Switch>
      </div>
    );
  }
}

export default App;




