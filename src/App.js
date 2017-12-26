import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom'
import * as firebase from 'firebase';

/* COMPONENTS */
import Main from './scenes/Main.jsx';
import Header from './components/Header.jsx';

import ProductDetail from './scenes/ProductDetail.jsx';
import Signup from './scenes/Signup.jsx';
import Login from './scenes/Login.jsx';


class App extends Component {
    constructor(props){
        super(props);

        this.state = {
            user: null,
            simpleHeader:false
        }

        var config = {
            apiKey: "AIzaSyCUBfhynXfwNM9CTai6ZzHHwi50wzMk-bI",
            authDomain: "fraiment-api.firebaseapp.com",
            databaseURL: "https:\/\/fraiment-api.firebaseio.com",
            projectId: "fraiment-api",
            storageBucket: "fraiment-api.appspot.com",
            messagingSenderId: "628845242596"
        };
        firebase.initializeApp(config);

        this.updateHeader = this.updateHeader.bind(this);
    }

    componentDidMount() {
        firebase.auth().onAuthStateChanged((user) => {
          if (user) {
            this.setState({ user });
          } 
        });
    }

    updateHeader(simple){
        this.setState({simpleHeader:simple})
    }

    render() {
        console.log(firebase.auth().currentUser);
        return (
            <div>
                <Header id="" simple={this.state.simpleHeader} currentUser={firebase.auth().currentUser}/>
                <Switch>

                    <Route exact path="/" render={() => {
                        return (<Main updateHeader={this.updateHeader}></Main>);
                    }}/>

                    <Route path="/login" render={() => {
                        return (<Login updateHeader={this.updateHeader}></Login>);
                    }}/>

                    <Route path="/signup" render={() => {
                        return (<Signup updateHeader={this.updateHeader}></Signup>);
                    }}/>

                    <Route path="/listing/:id" render={() => {
                        return (<ProductDetail updateHeader={this.updateHeader}></ProductDetail>);
                    }}/>

                </Switch>
            </div>
        );
    }
}

export default App;
