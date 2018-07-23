import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/CreateOffer.css';
import * as firebase from 'firebase';

/* COMPONENTS */

class CreateOffer extends Component {

	componentWillReceiveProps(newProps){
		if(newProps.threadID != null){
			var currentListings = [];
			var self = this;
			firebase.database().ref("/threads/" + newProps.threadID + "/seller_id").once("value", function(snap){
				firebase.database().ref("/users/" + snap.val() + "/listings").once("value", function(snap2){
					snap2.forEach(function(listing){
						firebase.database().ref("/listings/" + listing.key).once("value", function(snap3){
							if(snap3.child("active").val()){
								currentListings.push({
									"id": listing.key,
									"name": snap3.child("name").val()
								});
							}
							self.setState({availableListings: currentListings});
						});
					});
				});
			});
		}
	}

	constructor(props){
		super(props);

		this.state = {
			price: 0.00,
			note: "",
			shipping: 0,
			listingID: "",
			availableListings: []
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
			case "listing":
				this.setState({listingID: event.target.value});
				break;
		}
	}

	submitOffer(event){
		if(event.key === "Enter" || event.currentTarget.id == "sendBtn"){
			event.preventDefault();

			var listingID = this.state.listingID;
			if(listingID == "") listingID = this.state.availableListings[0].id;

			var newOffer = {
				price: this.state.price,
				listingID: listingID,
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

		//if(document.getElementById("messageUserInput").value.replace(/^\s+|\s+$/g, '') === "" || document.getElementById("messageUserInput").value == null){ document.getElementById("sendBtn").disabled = true; }
		//else { document.getElementById("sendBtn").disabled = false; }
	}

	render() {
		return (
			<div className={this.props.hidden ? "create-offer-container hidden": "create-offer-container" }>
				<div className="create-offer-modal">
					<p id="closeBtn" onClick={this.props.toggleView}>X</p>
					<p className="modal-title"><i className="fas fa-dollar-sign"></i>Make an offer</p><hr />

					<form>
						<span>
							<label>Price: </label>
							<div>
								<input className="create-product-input" value={this.state.price} id="price" onChange={this.onChange} type="number" value={this.state.price} min="0.01" step="0.01"></input>
							</div>
						</span>

						<span>
							<label>Note: </label>
							<div>
								<textarea className="create-product-input"  resizable="false" value={this.state.note} id="note" onChange={this.onChange}placeholder="Write your message..."></textarea>
							</div>
						</span>
						<span>
							<label>Listing: </label>
							<div>
								<select id="listing" className="create-product-input" value={this.state.listingID} onChange={this.onChange}>
									{this.state.availableListings.map((l) => {
										return (<option key={l.id} value={l.id}>{l.name}</option>);
									})}
								</select>
							</div>
						</span>

						<input type="submit" id="sendBtn" name="sendButton" className="create-product-submit" onClick={this.submitOffer} value="Create"></input>
					</form>
				</div>
			</div>
		);
	}
}

export default CreateOffer;
