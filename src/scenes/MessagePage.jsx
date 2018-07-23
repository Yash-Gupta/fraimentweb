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

	componentDidMount(){
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			document.getElementById("messageRight").classList.add("displayNone");
		}
	}

	chooseFirstThread(uid){
		var self = this;
		firebase.database().ref('/users/' + uid + '/buy_messages').limitToFirst(1).once('value', function(snap) {
			if(snap.val() == null){
				self.setState({username: null, active: false});
			}
			for(var keys in snap.val()){
				self.props.match.params.id = snap.val()[keys];
			}
		}).then(() => {
			firebase.database().ref('/threads/' + self.props.match.params.id).once("value").then((threadData) => {
				firebase.database().ref('/users/' + threadData.child("seller_id").val() + '/username').once("value").then((snapshot) => {
					this.setState({username: snapshot.val()});
				});
			});
			self.setState({uid: uid, threadID: self.props.match.params.id});
		});
	}

	componentWillReceiveProps(newProps){
		if(newProps.currentUser !== null && newProps.currentUser.uid !== this.state.uid){
			var self = this;
			if(this.props.match.params.id != null){
				var givenID = this.props.match.params.id;
				var exists = false;
				firebase.database().ref("/users/" + newProps.currentUser.uid + "/sell_messages/" + this.props.match.params.id).once("value", function(snap){
					if(snap.val() != null){
						exists = true;
						self.setState({uid: newProps.currentUser.uid, threadID: snap.val()});
						firebase.database().ref('/threads/' + snap.val()).once("value").then((threadData) => {
							firebase.database().ref('/users/' + threadData.child("seller_id").val() + '/username').once("value").then((snapshot) => {
								self.setState({username: snapshot.val()});
							});
						});
					}
				}).then(() => {
					firebase.database().ref("/users/" + newProps.currentUser.uid + "/buy_messages/" + this.props.match.params.id).once("value", function(snap2){
						if(snap2.val() != null) {
							exists = true;
							self.setState({uid: newProps.currentUser.uid, threadID: snap2.val()});
							firebase.database().ref('/threads/' + snap2.val()).once("value").then((threadData) => {
								firebase.database().ref('/users/' + threadData.child("seller_id").val() + '/username').once("value").then((snapshot) => {
									self.setState({username: snapshot.val()});
								});
							});
						}
						if(!exists){
							var threadKey = firebase.database().ref().child('threads').push().key;
							var newThread = {
								"buyer_id": newProps.currentUser.uid,
								"seller_id": givenID,
								"lastSentBy": newProps.currentUser.uid,
								"messages": {}
							};

							var uploadThread = {};
							uploadThread["/threads/" + threadKey] = newThread;
							uploadThread["/users/" + newProps.currentUser.uid + "/buy_messages/" + givenID] = threadKey;
							uploadThread["/users/" + givenID + "/sell_messages/" + newProps.currentUser.uid] = threadKey;
							firebase.database().ref().update(uploadThread, function(error){
								firebase.database().ref('/threads/' + threadKey).once("value").then((threadData) => {
									firebase.database().ref('/users/' + threadData.child("seller_id").val() + '/username').once("value").then((snapshot) => {
										self.setState({username: snapshot.val()});
									});
								});
								self.setState({uid: newProps.currentUser.uid, threadID: threadKey});
							});
						}
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
			active: true,
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
		this.shiftMobileView = this.shiftMobileView.bind(this);
	}

	shiftMobileView(event){
		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			document.getElementById("messageRight").classList.add("displayNone");
			document.getElementById("messageLeft").classList.remove("displayNone");
		}
	}

	toggleCreateOffer(event){
		this.setState({createOfferClosed: !this.state.createOfferClosed});
	}

	clickThread(event){

		if( /Android|webOS|iPhone|iPad|iPod|BlackBerry|IEMobile|Opera Mini/i.test(navigator.userAgent) ) {
			document.getElementById("messageRight").classList.remove("displayNone");
			document.getElementById("messageLeft").classList.add("displayNone");
		}

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
		var username = this.state.username;
		if(username == null || username == ""){
			username = "No messages selected";
		}else{
			username = "@" + username;
		}
		return (
			<div className="messages-container">
				<CreateOffer toggleView={this.toggleCreateOffer} hidden={this.state.createOfferClosed} uid={this.state.uid} threadID={this.state.threadID} />

				<MessageList className="messages-left" id="messageLeft" currentUser = {this.props.currentUser} currentThread={this.state.threadID} clickThread={this.clickThread} uid={this.state.uid}/>
				<div className="messages-right" id="messageRight">
					<p className="message-topbar"><span onClick={this.shiftMobileView} class="message-back"><i class="fas fa-chevron-left"></i></span>{username}</p>
					<MessageThread uid={this.state.uid} imageurl={this.state.senderImage} id={this.state.threadID}/>

					{this.state.active && (
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
					)}

				</div>
			</div>
		);
	}
}

export default MessagePage;
