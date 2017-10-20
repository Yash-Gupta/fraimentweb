import React, { Component } from 'react';
import { render } from 'react-dom';
import {Router, Route} from 'react-router';
import axios from 'axios';


import * as firebase from 'firebase';

class CreateMessages extends Component {

	constructor(props){
		super(props);
		this.state = {
			userid: "",
			message: ""
		}
		
		this.handleChange = this.handleChange.bind(this);
		this.sendMessage = this.sendMessage.bind(this);
	}

	sendMessage(event){

		event.preventDefault();

		var user = firebase.auth().currentUser;
		if (user) {
			// User is signed in
			//Add thread & add recipients to thread
			axios.get("http:\/\/34.211.71.161:3000/getByEmail?email=" + this.state.userid)
				.then(res => {
					var toID = res.data.uid;

					var postData = {};
					postData[toID] = true;
					postData[user.uid] = true;
			
					var threadExists = false;
					firebase.database().ref().child("threads").orderByChild(user.uid).equalTo(true).once("value",snapshot => {
						var threadID;

						snapshot.forEach(function(childNodes){
							if(childNodes.val()[user.uid] == true && childNodes.val()[toID] == true){
								threadID = Object.keys(snapshot.val())[0];
								
							}else{
							 	threadID = firebase.database().ref().child('threads').push().key;
					
								var updates = {};
								updates['/threads/' + threadID] = postData;
								firebase.database().ref().update(updates);

							}
						});

						var senderID = user.uid;
						var message = this.state.message;
			
						postData = {
							senderID: senderID,
							message: message,
							threadID: threadID
						};
			
						var messageID = firebase.database().ref().child('messages').push().key;
						
						var updates = {};
						updates['/messages/' + messageID] = postData;
						firebase.database().ref().update(updates);
					});


					//Get a key for a new Post.
					/*
		
					//Add Message with thread ID
					var senderID = user.uid;
					var message = this.state.message;
		
					postData = {
						senderID: senderID,
						message: message,
						threadID: threadID
					};
		
					var messageID = firebase.database().ref().child('messages').push().key;
					
					var updates = {};
					updates['/messages/' + messageID] = postData;
					firebase.database().ref().update(updates);*/
      			}
      		);
		} else {
 			console.log("No user logged in. Log in and try again");
		}
	}

	handleChange(event){
		switch (event.target.name) {
			case 'userid':
				this.setState({userid: event.target.value});
				break;

			case 'message':
				this.setState({message: event.target.value});
				break;

			default:
				break;
		}
	}

	render(){
		return (
			<form onSubmit={this.sendMessage}>
        		<label>
        		  To (userid):
        		  <input type="text" name="userid" onChange={this.handleChange} value={this.state.name} />
        		</label>
        		<label>
        		  Message:
        		  <input type="text" name="message" onChange={this.handleChange} value={this.state.author} />
        		</label>


        		<input type="submit" value="Submit" />
      		</form>
		);
	}
}

export default CreateMessages;