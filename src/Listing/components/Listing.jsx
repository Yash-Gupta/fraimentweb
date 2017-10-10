import React, { Component } from 'react';
import '../styles/Listing.css';


class Listing extends Component {

	constructor(props){
		super(props);
	}

	render(){
		return (
			<div className ="col-md-4 post" id = "post">
				<img className = "postimg" src = "{this.props.img_url}">
				<hr>
				<p className = "postname">{this.props.title}</p>
				<p className = "postdesigner">{this.props.designer}, {this.props.size}</p>
				<p className = "postprice">${this.props.price}</p>
				

			</div>
		);
	}
}

export default Listing;