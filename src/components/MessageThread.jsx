import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/MessageThread.css';
import * as firebase from 'firebase';

/* COMPONENTS */
import Message from './Message.jsx';
import Offer from './Offer.jsx';

var messagesDb = [];
class MessageThread extends Component {

	componentWillReceiveProps(newProps){
		if(newProps.uid != null && newProps.uid !== this.state.uid){
			var senderImage = false; //TODO - what is senderImage supposed to do here s
			var imageUrl = "";
			messagesDb = [];
			firebase.database().ref("/threads/" + newProps.id + "/messages").orderByChild("-timestamp").on("child_added", function(dataSnapshot) {
				var messageID = dataSnapshot.key;

				if(dataSnapshot.child("type").val() == "message")
				this.addMessage(newProps.uid,
					dataSnapshot.child("senderID").val(),
					dataSnapshot.key,
					dataSnapshot.child("message").val());
					else
					this.addOffer(newProps.uid,
						dataSnapshot.key,
						dataSnapshot.child("senderID").val(),
						dataSnapshot.child("price").val(),
						dataSnapshot.child("note").val(),
						dataSnapshot.child("accepted").val());
			}.bind(this));
		}
	}

	addOffer(uid, offerID, senderUid, price, note, accepted){
		if(senderUid === uid) var senderBool = true;
		else var senderBool = false;
		var imageUrl = "";

		var tempMessage = (<Offer key={offerID} id={offerID} price={price} note={note} accepted={accepted} senderBool={senderBool} userImageUrl={this.props.imageurl}/>);
		messagesDb.push(tempMessage);
		this.setState({messages: messagesDb}, () => {
			document.querySelector(".message-thread").scrollTop = document.querySelector(".message-thread").scrollHeight;
		});
	}

	addMessage(uid, senderUid, messageID, message){
		if(senderUid === uid) var senderBool = true;
		else var senderBool = false;
		var imageUrl = "";

		var tempMessage = (<Message key={messageID} id={messageID} text={message} senderBool={senderBool} userImageUrl={this.props.imageurl}/>);
		messagesDb.push(tempMessage);
		this.setState({messages: messagesDb}, () => {
			document.querySelector(".message-thread").scrollTop = document.querySelector(".message-thread").scrollHeight;
		});
	}

	constructor(props){
		super(props);
		this.state = {
			messages: []
		}

		this.addMessage = this.addMessage.bind(this);
		this.addOffer = this.addOffer.bind(this);
	}

	render() {
		return (
			<div className = "message-thread">
			{this.state.messages}
			</div>
		);
	}
}

export default MessageThread;
