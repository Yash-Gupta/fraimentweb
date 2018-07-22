import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Message.css';
import * as firebase from 'firebase';


/* COMPONENTS */

class Message extends Component {
	render() {
		if(this.props.senderBool) var styling = "sender-message";
		else var styling = "reciever-message";

		return (
			<div key={this.props.id} className = {styling}>
				{/*<img src={this.props.userImageUrl} />*/}
				<p className="message"> {this.props.text} </p>
			</div>
		);
	}
}

export default Message;
