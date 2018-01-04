import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/MessagePage.css';
import * as firebase from 'firebase';

/* COMPONENTS */
import MessageList from "../components/MessageList.jsx";
import MessageThread from "../components/MessageThread.jsx";

class MessagePage extends Component {

	componentWillMount(){
		this.props.updateHeader(false);
	}

	componentWillReceiveProps(newProps){
		if(newProps.currentUser !== null && newProps.currentUser.uid !== this.state.uid){
			this.setState({uid: newProps.currentUser.uid});		
		}
	}

	constructor(props){
		super(props);

		this.state = {
			threadID: "",
			uid: null,
			username: "",
		}

		if(this.props.match.params.id !== null) this.state.threadID = this.props.match.params.id; 

		this.clickThread = this.clickThread.bind(this);
		this.submitMessage = this.submitMessage.bind(this);
	}

	clickThread(event){
		console.log();
		if(event.currentTarget.id != this.state.threadID){
			this.setState({threadID: event.currentTarget.id, username: event.currentTarget.getAttribute("username")});
		}
	}

	submitMessage(event){
		if(event.key === "Enter"){
			event.preventDefault();
			//create message
			var newMessage = {
				message: event.target.value,
				senderID: this.state.uid,
				threadID: this.state.threadID,
				timestamp: Date.now()
			};

        	var messageID = firebase.database().ref().child('messages').push().key;

			var addMessage = {};
			addMessage['/threads/' + this.state.threadID + '/messages/' + messageID] = {
				message: event.target.value,
				senderID: this.state.uid,
				threadID: this.state.threadID,
				timestamp: -Date.now()
			};

			firebase.database().ref().update(addMessage);
			event.currentTarget.value = "";
		}
	}

	render() {
		return (
			<div className="messages-container">
				<MessageList className="messages-left" currentThread={this.state.threadID} clickThread={this.clickThread} uid={this.state.uid}/>
				<div className="messages-right">
					<p className="message-topbar">@{this.state.username}</p> 
					<MessageThread uid={this.state.uid} id={this.state.threadID}/>

					<div className="messages-send">
						<form method="POST"> 
							<input onKeyPress={this.submitMessage} placeholder="Type a message..." name="message" />
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default MessagePage;
