import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/MessagePage.css';
import * as firebase from 'firebase';

/* COMPONENTS */
import MessageList from "../components/MessageList.jsx";
import MessageThread from "../components/MessageThread.jsx";
import CreateOffer from "../components/CreateOffer.jsx";

class MessagePage extends Component {

	componentWillMount(){
		this.props.updateHeader(false);
	}

	chooseFirstThread(uid){
		var self = this;
		firebase.database().ref('/users/' + uid + '/buy_messages').limitToFirst(1).once('value', function(snap) {
			for(var keys in snap.val()){
				self.props.match.params.id = snap.val()[keys];
			}
		}).then(() => {
			firebase.database().ref('/threads/' + self.props.match.params.id).once("value").then((threadData) => {
				firebase.database().ref('/users/' + threadData.child("seller_id").val() + '/username').once("value").then((snapshot) => {
					this.setState({username: snapshot.val()});
				});
			});
			self.setState({threadID: self.props.match.params.id});
		});
	}

	componentWillReceiveProps(newProps){
		if(newProps.currentUser !== null && newProps.currentUser.uid !== this.state.uid){
			var self = this;
			this.setState({uid: newProps.currentUser.uid});
			if(this.props.match.params.id != null){
				var givenID = this.props.match.params.id;
				var exists = false;
				firebase.database().ref("/users/" + newProps.currentUser.uid + "/sell_messages/" + this.props.match.params.id).once("value", function(snap){
					self.setState({threadID: snap.val()});
					if(snap.val() != null) exists = true;
				}).then(() => {
					firebase.database().ref("/users/" + newProps.currentUser.uid + "/buy_messages/" + this.props.match.params.id).once("value", function(snap2){
						if(snap2.val() != null) exists = true;
						self.setState({threadID: snap2.val()}, (() => {
							if(!exists){
								var newThread = {
									"buyer_id": newProps.currentUser.uid,
									"seller_id": givenID,
									"lastSentBy": newProps.currentUser.uid,
									"messages": {}
								};

								var uploadThread = {};
								var threadKey = firebase.database().ref().child('threads').push().key;
								uploadThread["/threads/" + threadKey] = newThread;
								uploadThread["/users/" + newProps.currentUser.uid + "/buy_messages/" + givenID] = threadKey;
								uploadThread["/users/" + givenID + "/sell_messages/" + newProps.currentUser.uid] = threadKey;
								firebase.database().ref().update(uploadThread, function(error){
									self.setState({threadID: threadKey});
								});
							}
						}));
					});
				})
			}else{
				this.chooseFirstThread(newProps.currentUser.uid);
			}
		}
	}

	constructor(props){
		super(props);

		this.state = {
			threadID: "",
			uid: null,
			username: "",
			senderImage: "",
			createOfferClosed: true,
		}

		this.clickThread = this.clickThread.bind(this);
		this.submitMessage = this.submitMessage.bind(this);
		this.toggleCreateOffer = this.toggleCreateOffer.bind(this);
		this.chooseFirstThread = this.chooseFirstThread.bind(this);
	}

	toggleCreateOffer(event){
		this.setState({createOfferClosed: !this.state.createOfferClosed});
	}

	clickThread(event){
		var threadID = event.currentTarget.id;
		var uid = this.state.uid;
		firebase.database().ref('/threads/' + threadID + "/lastSentBy").once("value", function(snap){
			if(snap.val() != uid){
				var updates = {};
				updates["/threads/" + threadID + "/lastSentBy"] = null;
				firebase.database().ref().update(updates);
			}
		});

		if(event.currentTarget.id != this.state.threadID){
			this.setState({threadID: event.currentTarget.id, username: event.currentTarget.getAttribute("username"), senderImage: event.currentTarget.getAttribute("imageurl")});
		}
	}

	submitMessage(event){
		if(event.key === "Enter" || event.currentTarget.id == "sendBtn"){
			event.preventDefault();
			var date = Date.now();
			var newMessage = {
				message: document.getElementById("messageUserInput").value,
				senderID: this.state.uid,
				threadID: this.state.threadID,
				timestamp: -date,
				type: "message"
			};

			var messageID = firebase.database().ref().child('messages').push().key;

			var addMessage = {};
			addMessage['/threads/' + this.state.threadID + '/messages/' + messageID] = newMessage;
			addMessage['/threads/' + this.state.threadID + '/lastSentBy'] = this.state.uid;
			addMessage['/threads/' + this.state.threadID + '/lastActive'] = date;

			firebase.database().ref().update(addMessage);
			document.getElementById("messageUserInput").value = "";
		}

		if(document.getElementById("messageUserInput").value.replace(/^\s+|\s+$/g, '') === "" || document.getElementById("messageUserInput").value == null){ document.getElementById("sendBtn").disabled = true; }
		else { document.getElementById("sendBtn").disabled = false; }


	}

	render() {
		return (
			<div className="messages-container">
				<CreateOffer toggleView={this.toggleCreateOffer} hidden={this.state.createOfferClosed} uid={this.state.uid} threadID={this.state.threadID} />

				<MessageList className="messages-left" currentUser = {this.props.currentUser} currentThread={this.state.threadID} clickThread={this.clickThread} uid={this.state.uid}/>
				<div className="messages-right">
					<p className="message-topbar">@{this.state.username}</p>
					<MessageThread uid={this.state.uid} imageurl={this.state.senderImage} id={this.state.threadID}/>

					<div className="messages-send">
						<form method="POST" >
							<input onKeyDown={this.submitMessage} placeholder="Type a message..." name="message" id="messageUserInput"/>
							<input type="submit" onClick={this.submitMessage} id="sendBtn" value="Send" name="sendButton" />
							<div className="action-icons">
								<div className="action-icon" onClick={this.toggleCreateOffer}>
									MAKE OFFER
								</div>
							</div>
						</form>
					</div>
				</div>
			</div>
		);
	}
}

export default MessagePage;
