import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/CreateOffer.css';
import * as firebase from 'firebase';

/* COMPONENTS */

class CreateOffer extends Component {

	componentWillReceiveProps(newProps){
		/*if(newProps.currentUser !== null && newProps.currentUser.uid !== this.state.uid){
			this.setState({uid: newProps.currentUser.uid});

			if(this.props.match.params.id == null){
				var self = this;
				firebase.database().ref('/users/' + newProps.currentUser.uid + '/buy_messages').limitToFirst(1).once('value', function(snap) {
  					for(var keys in snap.val()){
  						self.props.match.params.id = keys;
  					}
				}).then(() => {
					self.setState({threadID: self.props.match.params.id});
				});
			}
		}*/
	}

	constructor(props){
		super(props);

		this.state = {
			price: null,
			note: ""
		}
		
		this.submitOffer = this.submitOffer.bind(this);
		this.onChange = this.onChange.bind(this);

	}

	onChange(event){
		switch(event.target.id){

			case "price":
				this.setState({price: event.target.value});
				break;
			case "note":
				this.setState({note: event.target.value});
				break;
		}
	}

	submitOffer(event){
		if(event.key === "Enter" || event.currentTarget.id == "sendBtn"){
			event.preventDefault();
			
			//create offer
			var newOffer = {
				price: this.state.price,
				note: this.state.note,
				senderID: this.props.uid,
				accepted: false,
				timestamp: -Date.now(),
				type: "offer"
			};

        	var offerID = firebase.database().ref('/threads/' + this.props.threadID).child('messages').push().key;

			var addOffer = {};
			addOffer['/threads/' + this.props.threadID + '/messages/' + offerID] = newOffer;

			firebase.database().ref().update(addOffer);
			document.getElementById("price").value = "";
			document.getElementById("note").value = "";
			this.props.toggleView();
		}

		if(document.getElementById("messageUserInput").value.replace(/^\s+|\s+$/g, '') === "" || document.getElementById("messageUserInput").value == null){ document.getElementById("sendBtn").disabled = true; }
		else { document.getElementById("sendBtn").disabled = false; }
	}

	render() {
		return (
			<div className={this.props.hidden ? "create-offer-container hidden": "create-offer-container" }>
				<div className="create-offer-modal">
					<p id="closeBtn" onClick={this.props.toggleView}>X</p>

					<form> 
						<p className="modal-title"><i className="fas fa-dollar-sign"></i>Make an offer</p><hr />

						<input value={this.state.price} id="price" onChange={this.onChange} type="number" min="0.01" step="0.01" />
						<textarea value={this.state.note} id="note" onChange={this.onChange}> </textarea>

						<input type="submit" onClick={this.submitOffer} id="sendBtn" value="Send" name="sendButton" />

					</form>
				</div>
			</div>
		);
	}
}

export default CreateOffer;
