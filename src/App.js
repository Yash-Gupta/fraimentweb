import React, { Component } from 'react';
import './App.css';
import { Switch, Route } from 'react-router-dom'
import * as firebase from 'firebase';

/* COMPONENTS */
import Main from './scenes/Main.jsx';
import Header from './components/Header.jsx';

import Login from './scenes/Login.jsx';
import Signup from './scenes/Signup.jsx';
import ConfigurePaypal from './scenes/ConfigurePaypal.jsx';
import AuthorizePaypal from './services/AuthorizePaypal.jsx';

import Profile from './scenes/Profile.jsx';

import CreateProduct from './scenes/CreateProduct.jsx';
import ProductDetail from './scenes/ProductDetail.jsx';

import MessagePage from './scenes/MessagePage.jsx';

/* CUSTOM CSS */


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
        return (
            <div className="app">
                <Header id="" simple={this.state.simpleHeader} currentUser={this.state.user}/>
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

                    <Route path="/configure_paypal" render={() => {
                        return (<ConfigurePaypal updateHeader={this.updateHeader}></ConfigurePaypal>);
                    }}/>

                    <Route path="/authorize_paypal" render={() => {
                        return (<AuthorizePaypal updateHeader={this.updateHeader} currentUser={this.state.user} />);
                    }}/>

                     <Route path="/profile" render={() => {
                        return (<Profile updateHeader={this.updateHeader}></Profile>);
                    }}/>

                    <Route path="/listing/create" render={() => {
                        return (<CreateProduct currentUser={this.state.user} updateHeader={this.updateHeader}></CreateProduct>);
                    }}/>

                    <Route path="/listing/:id" render={({match}) => {
                        return (<ProductDetail match={match} updateHeader={this.updateHeader}></ProductDetail>);
                    }}/>

                    <Route path="/messages/:id?" render={({match}) => {
                        return (<MessagePage match={match} currentUser={this.state.user} updateHeader={this.updateHeader}></MessagePage>);
                    }}/>

                </Switch>
            </div>
        );
    }
}

export default App;
