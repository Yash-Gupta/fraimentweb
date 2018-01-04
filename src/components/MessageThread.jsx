import React, { Component } from 'react';

import { Link } from 'react-router-dom';
import './css/MessageThread.css';
import * as firebase from 'firebase';


/* COMPONENTS */
import Message from './Message.jsx';

var messagesDb = [];
class MessageThread extends Component {

	componentWillReceiveProps(newProps){
		if(newProps.uid != null){
			firebase.database().ref("/threads/" + newProps.id + "/messages").orderByChild("timestamp").on("child_added", function(dataSnapshot) {
       			console.log("new child added");
       			var messageID = dataSnapshot.key;
				var message = dataSnapshot.child("message").val();
				var senderUid = dataSnapshot.child("senderID").val();
       			this.addMessage(newProps.uid, messageID, message, senderUid);
  			}.bind(this));
		}
	}

	addMessage(uid, messageID, message, senderUid){
		console.log(message);
		var self = this;
		if(senderUid === uid) var senderBool = true;
		else var senderBool = false; 
		var imageUrl = "";

		firebase.database().ref('/users/' + senderUid + '/profilepic').once("value").then((imgSnap) => {
          	imageUrl = imgSnap.val();
     	}).then(function(){
       		var tempMessage = (<Message id={messageID} text={message} senderBool={senderBool} userImageUrl={imageUrl}/>);
			messagesDb.push(tempMessage);
			self.setState({messages: messagesDb}, () => {
				document.querySelector(".message-thread").scrollTop = document.querySelector(".message-thread").scrollHeight;
			});
        });
	}

	constructor(props){
		super(props);
		this.state = {
			messages: []
		}

		this.addMessage = this.addMessage.bind(this);
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
