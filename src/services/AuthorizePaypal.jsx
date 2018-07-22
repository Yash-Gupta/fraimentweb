import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
//import './css/ConfigurePaypal.css';
import * as firebase from 'firebase';
import axios from 'axios';
import { Link } from 'react-router-dom';
import * as qs from 'query-string';

import LoginPaypal from '../components/LoginPaypal';

class AuthorizePaypal extends Component {

  componentWillReceiveProps(newProps){
		if(newProps.currentUser != null){
      var params = qs.parse(newProps.location.search);

      var self = this;
      axios.post("https://api.sandbox.paypal.com/v1/identity/openidconnect/tokenservice", 'grant_type=authorization_code&code=' + params.code, {
        auth: {
          username: 'AQzUbjbU0SVNbwjIIstVU28iaMFiBvpXeqKHeHQxAo_5yhFwT1mFKg5bTNDTEMIkvUZAaC6TBYE8DVQO',
          password: 'ENs5iQvqznuOrrz9qFmdCNI6atXBqYeDbL9q4FFkqrA8SlSUdsnPPKDDMQ2WZle5zjXLLSa06bXmvAYc'
        },
        headers: {'Content-Type': 'application/x-www-form-urlencoded'}
      }).then(function(response) {
        var token = response.data.access_token;

        //TODO: check if account is business account
        axios.get("https://api.sandbox.paypal.com/v1/oauth2/token/userinfo?schema=openid", {
          headers: {'Authorization': "Bearer " + token}
        }).then(function(response){
          if(response.data.account_type == "BUSINESS"){
            var uploadUser = {};
            uploadUser['/users/' + newProps.currentUser.uid + "/paypal"] = response.data;

            firebase.database().ref().update(uploadUser);
            self.props.history.push('/');
          }else{
            var errors = self.state.errors;
            errors.push("You must have a business PayPal account to participate!");
            self.setState({errors: errors})
          }
        })
      })
		}
	}

  constructor(props){
    super(props);

    this.state = {
      errors: []
    }
  }

  componentWillMount(){
    this.props.updateHeader(true);
  }

	render() {
    if(this.state.errors.length > 0){
      var tryagain = (<p>Click <Link to="/configure_paypal">here</Link> to try again. </p>);
    }
		return (<div><p>{this.state.errors}</p> {tryagain}</div>);
	}
}

	export default withRouter(AuthorizePaypal);
