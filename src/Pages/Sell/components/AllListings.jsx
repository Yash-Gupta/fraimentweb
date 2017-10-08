import React, { Component } from 'react';
import * as firebase from 'firebase'
import '../styles/AllListings.css';
import '../../../../node_modules/bootstrap/dist/css/bootstrap.min.css';

class AllListings extends Component {

	constructor(props){
		super(props);
		
		this.state = {
			listings: []
		}

		firebase.database().ref('/listings').once("value").then((snapshot) => {
            snapshot.forEach((data) => {
            	var listings = this.state.listings;
            	listings.push(data.val());
            	this.setState({listings: listings});
            });
        });
		//this.handleChange = this.handleChange.bind(this);
		//this.createListing = this.createListing.bind(this);
	}

	render(){
		var rows = [];
		this.state.listings.map((x, i) => {
			rows.push(
				<div key={i} className ="col-md-4 post" id = "post">
					<p className="postname">{x.name}</p>
					<p className= "postdesigner">{x.author}</p>
					<p className= "postprice">{x.price}</p>
				</div>
			);
		})
		return (
			<div id = "itemrow" className= "row">
				{rows}
			</div>
		);
	}
}

export default AllListings;