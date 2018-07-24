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
import ViewProfile from './scenes/ViewProfile.jsx';

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
        var content = [
          {
            name: "brand",
            text: "BRANDS",
            text2: "Brand",
            items: ["Adidas", "Bape", "Jordan Brand", "Palace", "Off-White", "Comme des Garcons", "Undercover", "Saint Laurent Paris", "Gucci", "Yeezy Boost", "Raf Simons ", "Antisocial Social Club", "Rick Owens", "Louis Vuitton"]
          },
          {
            name: "gender",
            text: "GENDER",
            text2: "Gender",
            items: ["Male", "Female", "Unisex"]
          },
          {
            name: "type",
            text: "TYPE",
            text2: "Type",
            items: ["Tops", "Bottoms", "Outerwear", "Footwear", "Accessories", "Other"]
          },
          {
            name: "condition",
            text: "CONDITION",
            text2: "Condition",
            items: ["Deadstock", "Very Good", "Good", "Slightly Used", "Used"]
          },
          {
            name: "size",
            text: "SIZE",
            text2: "Size",
            items: ["XS", "S", "M", "L", "XL"]
          }
        ]
        return (
            <div className="app">
                <Header id="" simple={this.state.simpleHeader} currentUser={this.state.user}/>
                <Switch>

                    <Route exact path="/" render={() => {
                        return (<Main filters={content} updateHeader={this.updateHeader}></Main>);
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

                    <Route path="/viewProfile/:id" render={({match}) => {
                        return (<ViewProfile match = {match} updateHeader={this.updateHeader}></ViewProfile>);
                    }}/>

                    <Route path="/listing/create" render={() => {
                        return (<CreateProduct filters={content} currentUser={this.state.user} updateHeader={this.updateHeader}></CreateProduct>);
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
