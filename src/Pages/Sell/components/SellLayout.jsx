import React, { Component } from 'react';
import CreateListing from './CreateListing';
import AllListings from './AllListings';

class SellLayout extends Component {

	constructor(props){
		super(props);
	}

	render(){
		return (
			<div>
				<CreateListing />
				<AllListings />
			</div>
		);
	}
}

export default SellLayout;