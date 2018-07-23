import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/MessageThread.css';
import * as firebase from 'firebase';

/* COMPONENTS */
import Message from './Message.jsx';
import Offer from './Offer.jsx';
import InfoMessage from './InfoMessage.jsx';

var messagesDb = [];
var seller_id;
var buyer_id;
class MessageThread extends Component {

	componentWillReceiveProps(newProps){
		if(newProps.uid != null && newProps.uid !== this.state.uid){
			var senderImage = false;
			var imageUrl = "";
			messagesDb = [];
			var self = this;

			firebase.database().ref("/threads/" + newProps.id).once("value", function(snap) {
				self.setState({
					seller_id: snap.child("seller_id").val() ,
					buyer_id: snap.child("buyer_id").val()
				})
				seller_id = snap.child("seller_id").val();
				buyer_id = snap.child("buyer_id").val()
			});

			firebase.database().ref("/threads/" + newProps.id + "/messages").orderByChild("-timestamp").off(); //remove previous listener to avoid double
			firebase.database().ref("/threads/" + newProps.id + "/messages").orderByChild("-timestamp").on("child_added", function(dataSnapshot) {
				var messageID = dataSnapshot.key;
				if(dataSnapshot.child("type").val() == "message"){
					this.addMessage(newProps.uid,
						dataSnapshot.child("senderID").val(),
						dataSnapshot.key,
						dataSnapshot.child("message").val()
					);
				} else if(dataSnapshot.child("type").val() == "offer"){
					this.addOffer(newProps.uid,
						dataSnapshot.key,
						dataSnapshot.child("senderID").val(),
						dataSnapshot.child("price").val(),
						dataSnapshot.child("note").val(),
						dataSnapshot.child("accepted").val(),
						dataSnapshot.child("listingID").val(),
						newProps.id
					);
				} else if(dataSnapshot.child("type").val() == "info"){
					this.addInfo(newProps.uid,
						dataSnapshot.key,
						dataSnapshot.child("message").val(),
						dataSnapshot.child("visible").child("seller").val(),
						dataSnapshot.child("visible").child("buyer").val(),
						dataSnapshot.child("data").val(),
						newProps.id,
					);
				}
			}.bind(this));
		}
	}

	addInfo(uid, infoID, message, sellerVisible, buyerVisible, data, threadID){
		if((sellerVisible && uid == seller_id) || (buyerVisible && uid == buyer_id)){
			var tempMessage = (<InfoMessage key={infoID} threadid={threadID} message={message} data={data} />);
			messagesDb.push(tempMessage);
			this.setState({messages: messagesDb}, () => {
				document.querySelector(".message-thread").scrollTop = document.querySelector(".message-thread").scrollHeight;
			});
		}
	}

	addOffer(uid, offerID, senderUid, price, note, accepted, listing_id, threadid){
		if(senderUid === uid) var senderBool = true;
		else var senderBool = false;
		var imageUrl = "";

		var tempMessage = (<Offer key={offerID} threadID={threadid} id={offerID} listingID={listing_id} price={price} note={note} accepted={accepted} senderBool={senderBool} userImageUrl={this.props.imageurl}/>);
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
			messages: [],
			sellerID: "",
			buyerID: ""
		}

		this.addMessage = this.addMessage.bind(this);
		this.addOffer = this.addOffer.bind(this);
		this.addInfo = this.addInfo.bind(this);
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
