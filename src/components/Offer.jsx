import React, { Component } from 'react';
import { Link } from 'react-router-dom';
import './css/Offer.css';
import * as firebase from 'firebase';


/* COMPONENTS */

class Offer extends Component {
	render() {
		if(this.props.senderBool) var styling = "sender-offer";
		else var styling = "reciever-offer";

		if(this.props.accepted) styling += " offer-accepted";

		return (
			<div key={this.props.id} className = {styling}>
				<img src={this.props.userImageUrl} />
				<div className="offer-container"> 
					<p className="price"> {this.props.price} </p>
					<p className="note"> {this.props.note} </p>
					<div className="action-items">
						<p id="accept-btn">ACCEPT</p>
						<p id="decline-btn">DECLINE</p>
					</div>
				</div>
			</div>
		);
	}
}

export default Offer;
