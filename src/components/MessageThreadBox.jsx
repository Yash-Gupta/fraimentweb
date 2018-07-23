import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/MessageThreadBox.css';
import * as firebase from 'firebase';

/* COMPONENTS */
const threadIds = [];
class MessageThreadBox extends Component {

	componentWillMount(){
		this.getContent = this.getContent.bind(this);
	}

	getContent(threadID, sellerBool){
		if(!sellerBool) var child = "seller_id";
		else var child = "buyer_id";

		firebase.database().ref('/threads/' + threadID).once("value").then((threadData) => {
			var lastSentBy = threadData.child("lastSentBy").val();
			var readThread = false;
			if(this.props.currentUser.uid == lastSentBy || lastSentBy == null) readThread = true;
			this.setState({read: readThread});

			firebase.database().ref("/threads/" + this.props.id + "/messages").orderByChild("timestamp").limitToFirst(1).once("value").then((snap) => {
				if(snap.val() != null){
					this.setState({last_message_text: snap.val()[Object.keys(snap.val())[0]]["message"]});
				} else {
					this.setState({last_message_text: "No messages found!"});
				}
			});

			firebase.database().ref('/users/' + threadData.child(child).val() + '/profilepic').once("value").then((snapshot) => {
				this.setState({recieverImageUrl: snapshot.val()});
			});
			firebase.database().ref('/users/' + threadData.child(child).val() + '/username').once("value").then((snapshot) => {
				this.setState({recieverUsername: snapshot.val()});
			});
		});
	}

	componentDidMount() {
		var self = this;
		firebase.database().ref("/threads/" + this.props.id + "/messages").orderByChild("timestamp").limitToFirst(1).on("child_added", function(snap) {
			self.setState({last_message_text: snap.child("message").val()});
		});

		firebase.database().ref("/threads/" + this.props.id).on("child_changed", function(snapshot){
			if(snapshot.key == "lastSentBy"){
				var readThread = false;
				if(self.props.currentUser.uid == snapshot.val()) readThread = true;
				self.setState({read: readThread});
			}
		});
	}

	componentWillReceiveProps(newProps){
		if(newProps.id != null){
			this.getContent(newProps.id, newProps.sellerBool);
		}
	}

	constructor(props){
		super(props);
		this.state = {
			last_message_text: "",
			recieverUsername: "",
			recieverImageUrl: ""
		}
		this.getContent(this.props.id, this.props.sellerBool);
	}

	render() {
		var classNameActive = "thread-box";
		if(this.props.active) classNameActive += " active";
		if(!this.state.read) classNameActive += " unread";

		return (
			<div className={classNameActive} imageurl={this.state.recieverImageUrl} onClick={this.props.onClick} id={this.props.id} username={this.state.recieverUsername}>
				<img src={this.state.recieverImageUrl} />
				<div className="thread-box-text">
					<p className="thread-username">@{this.state.recieverUsername}</p>
					<p>{this.state.last_message_text}</p>
				</div>
			</div>
		);
	}
}

export default MessageThreadBox;
