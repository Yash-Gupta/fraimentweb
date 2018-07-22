import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Offer.css';
import * as firebase from 'firebase';


/* COMPONENTS */

class Offer extends Component {

	componentWillMount(){
		var self = this;
		firebase.database().ref("/listings/" + this.props.listingID + "/name").once("value", function(dataSnapshot) {
			self.setState({listingName: dataSnapshot.val()});
		});
	}

	constructor(props){
		super(props);
		this.state = {
			listingName: ""
		};

		this.accept = this.accept.bind(this);
		this.decline = this.decline.bind(this);
	}

	decline(){
		var info = {
			message: "Offer declined!",
			threadID: this.props.threadID,
			timestamp: -Date.now(),
			type: "info",
			data: {
				"listener": "decline_offer",
			},
			visible: {
				"seller": true,
				"buyer": true
			}
		};

		var message_id = firebase.database().ref().child('threads').child(this.props.threadID).child("messages").push().key;

		var updates = {};
		updates["/threads/" + this.props.threadID + "/messages/" + message_id] = info;

		firebase.database().ref().update(updates);
	}

	accept(){
		//check if listing is still active
		var self = this;
		console.log(this.props.listingID);
		firebase.database().ref("/listings/" + self.props.listingID + "/active").once("value", function(snap){
			console.log(snap.val());
			if(!snap.val()){
				var info = {
					message: "Listing is not active.",
					threadID: self.props.threadID,
					timestamp: -Date.now(),
					type: "info",
					data: {
						"listener": "listing_inactive"
					},
					visible: {
						"seller": true,
						"buyer": true
					}
				};

				var message_id = firebase.database().ref().child('threads').child(self.props.threadID).child("messages").push().key;
				var updates = {};
				updates["/threads/" + self.props.threadID + "/messages/" + message_id] = info;

				firebase.database().ref().update(updates);
				return;
			}else{
				var date = Date.now();
				var info = {
					"buyer": {
						message: "Offer accepted!",
						threadID: self.props.threadID,
						timestamp: -date,
						type: "info",
						data: {
							"listener": "create_payment",
							"price": self.props.price,
							"listing_id": self.props.listingID
						},
						visible: {
							"seller": false,
							"buyer": true
						}
					},
					"seller": {
						message: "Offer accepted! Waiting for payment",
						threadID: self.props.threadID,
						timestamp: -date,
						type: "info",
						data: {
							listener: "wait_payment",
						},
						visible: {
							"seller": true,
							"buyer": false
						}
					}
				};

				var buyer_message_id = firebase.database().ref().child('threads').child(self.props.threadID).child("messages").push().key;
				var seller_message_id = firebase.database().ref().child('threads').child(self.props.threadID).child("messages").push().key;

				var updates = {};
				updates["/threads/" + self.props.threadID + "/messages/" + buyer_message_id] = info["buyer"];
				updates["/threads/" + self.props.threadID + "/messages/" + seller_message_id] = info["seller"];

				firebase.database().ref().update(updates);
			}
		});
	}

	render() {
		if(this.props.accepted) styling += " offer-accepted";

		if (this.props.senderBool){
			var styling = "sender-offer";
			var action_items = (<p>Waiting for approval</p>);
		} else {
			var styling = "reciever-offer";
			var action_items = (
				<div className="action-items">
					<p onClick={this.accept} id="accept-btn">ACCEPT</p>
					<p onClick={this.decline} id="decline-btn">DECLINE</p>
				</div>
			);
		}

		return (
			<div key={this.props.id} className = {styling}>
				<div className="offer-container">
					<p className="price">${this.props.price} </p>
					<p className="note"> {this.props.note} </p>
					<Link to={"/listing/" + this.props.listingID}>{this.state.listingName}</Link>
					{action_items}
				</div>
			</div>
		);
	}
}

export default Offer;
