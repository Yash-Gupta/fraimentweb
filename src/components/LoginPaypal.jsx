import React, { Component } from 'react';
import { withRouter} from 'react-router-dom';
import './css/LoginPaypal.css';
import * as firebase from 'firebase';
import axios from 'axios';

class LoginPaypal extends Component {
	render() {

    var client_id = "AQzUbjbU0SVNbwjIIstVU28iaMFiBvpXeqKHeHQxAo_5yhFwT1mFKg5bTNDTEMIkvUZAaC6TBYE8DVQO";
    //var client_id = "AY7Gbu7mkMhtefAHzKuvoto-FByMwfrkop_8Zu1o8cxPCr8rXynKDzHZS3M2_1qAuia7r0-eSen4yJfd";
    var redirect_uri = "http://localhost:3000/authorize_paypal";

    //sandbox
    var paypal_uri = "https://www.sandbox.paypal.com/signin/authorize?client_id=" + client_id + "&response_type=token&scope=openid+profile+email+https%3A%2F%2Furi.paypal.com%2Fservices%2Fpaypalattributes&redirect_uri=" + redirect_uri;

    //live
    //var paypal_uri = "https://www.paypal.com/signin/authorize?client_id=" + client_id + "&response_type=code&scope=openid+profile+email+https%3A%2F%2Furi.paypal.com%2Fservices%2Fpaypalattributes&redirect_uri=" + redirect_uri;

		return (
      <a href={paypal_uri} className="paypal-login-container"><img src="https://www.paypalobjects.com/webstatic/en_US/developer/docs/lipp/loginwithpaypalbutton.png" /></a>
		);
	}
}

export default LoginPaypal;
