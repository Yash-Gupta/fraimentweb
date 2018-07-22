import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/InfoMessage.css';
import * as firebase from 'firebase';
import PaypalExpressBtn from 'react-paypal-express-checkout';

/* COMPONENTS */

class InfoMessage extends Component {

	componentWillMount(){
	}

  componentWillReceiveProps(newProps){
  }

	constructor(props){
		super(props);
		this.state = {
      message: ""
    };
	}

	render() {
    var paypal_btn = (<div></div>);
    if(this.props.data.listener == "create_payment"){
      var client = {
        sandbox: 'AQzUbjbU0SVNbwjIIstVU28iaMFiBvpXeqKHeHQxAo_5yhFwT1mFKg5bTNDTEMIkvUZAaC6TBYE8DVQO',
        production: 'demo_production_client_id'
      };

      var onSuccess = (payment) => {
        console.log("success in payment");
        //send data to nodejs to run payouts api
        //create new info message for payment successful (visible to both)
        var info = {
  				message: "Payment successful via PayPal!",
  				threadID: this.props.threadid,
  				timestamp: -Date.now(),
  				type: "info",
  				data: {
  					"listener": "done_payment",
  				},
  				visible: {
  					"seller": true,
  					"buyer": true
  				}
  			};

        var message_id = firebase.database().ref().child('threads').child(this.props.threadid).child("messages").push().key;
        var updates = {};
        updates["/threads/" + this.props.threadid + "/messages/" + message_id] = info;
        updates["/listings/" + this.props.data.listing_id + "/active"] = false;
        firebase.database().ref().update(updates);

      };

      paypal_btn = (<PaypalExpressBtn env={"sandbox"} client={client} currency={'USD'} total={parseFloat(this.props.data.price)} onSuccess={onSuccess} />);
    }

		return (
			<div className="info-message">
        {this.props.message}{paypal_btn}
      </div>
		);
	}
}

export default InfoMessage;
