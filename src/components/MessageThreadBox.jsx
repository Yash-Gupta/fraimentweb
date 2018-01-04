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
		console.log(child);
		firebase.database().ref('/threads/' + threadID).once("value").then((threadData) => {
			this.setState({last_message_text: threadData.child("last_message_text").val()});
			firebase.database().ref('/users/' + threadData.child(child).val() + '/profilepic').once("value").then((snapshot) => {
            	this.setState({recieverImageUrl: snapshot.val()});
       		});
        	firebase.database().ref('/users/' + threadData.child(child).val() + '/username').once("value").then((snapshot) => {
            	this.setState({recieverUsername: snapshot.val()});
       		});
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

		return (
			<div className={classNameActive} onClick={this.props.onClick} id={this.props.id} username={this.state.recieverUsername}>
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
